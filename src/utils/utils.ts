import { TranslationError } from "..";
import pfs from "fs/promises";
import fs from "fs";
import path from "path";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGapLine() {
  return "-".repeat(20);
}

export function getErrorMessages<T extends Error>(e: T, prefix = "Translate fail ! "): string {
  if (e instanceof TypeError) {
    return prefix + ((e.cause as any)?.message ?? e.message);
  }
  return prefix + e.message;
}

export async function throwResponseError(name: string, res: any) {
  let bodyRes = null;
  try {
    bodyRes = await res.json();
  } catch (e) {}
  return new TranslationError(name, `Translate fail ! ${res.status}: ${res.statusText} ${bodyRes?.message ?? ""}`);
}

export function splitText(text: string, maxCharacterNum: number): string[] {
  const SPLIT_PRIORITY = [
    /\n\n+/, // 段落分隔（优先保留空行）
    /[.。！？?!\n]/, // 中日韩句子结束符+英文标点+换行
    /[;；]/, // 分号（中英文）
    /[,，]/g, // 逗号（中英文）
    /\s/, // 空格（避免切分单词）
  ];
  const BEST_MATCH_RATIO = 0.7;

  const chunks: string[] = [];

  while (text.length > 0) {
    const chunk = text.slice(0, maxCharacterNum);

    // Scene 1：Prioritization of cases not subject to severance
    if (text.length <= maxCharacterNum) {
      chunks.push(text);
      break;
    }

    // Scene 2：Finding Split Points by Priority
    let splitPos = -1;
    for (const delimiter of SPLIT_PRIORITY) {
      const regex = new RegExp(delimiter.source + "(?=[^]*)", "g"); // back-to-front search

      let m, longestMatch;
      while ((m = regex.exec(chunk)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (longestMatch != null) {
          longestMatch = m.index > longestMatch.index ? m : longestMatch;
        } else {
          longestMatch = m;
        }
      }

      if (longestMatch?.index !== undefined && longestMatch.index >= maxCharacterNum * BEST_MATCH_RATIO) {
        splitPos = longestMatch.index;
        break; // Finding Quality Split Points
      }
    }

    // Scene 3：Conservative splitting in the absence of a suitable separator
    if (splitPos === -1) {
      splitPos = chunk.lastIndexOf(" ", maxCharacterNum); // look for the space
      splitPos = splitPos === -1 ? maxCharacterNum : splitPos; // forcible division
    }

    if (splitPos == 0) {
      text = text.slice(splitPos + 1);
    } else {
      chunks.push(text.slice(0, splitPos));
      text = text.slice(splitPos);
    }
  }

  return chunks;
}

export function isOverMaxCharacterNum(text: string[] | undefined | null, max_character_num: number) {
  if (!text || text.length <= 0) {
    return false;
  }
  const total = text.reduce((pre, cur) => pre + cur.length, 0);
  return total > max_character_num;
}

export async function cleanDir(dir: string) {
  if (fs.existsSync(dir)) {
    const filePaths = await pfs.readdir(dir);
    for (const file of filePaths) {
      const curPath = path.join(dir, file);
      await (fs.lstatSync(curPath).isDirectory() ? pfs.rm(curPath, { recursive: true }) : pfs.unlink(curPath));
    }
    await pfs.rm(dir, { recursive: true });
  }
}

export async function copyDir(src: string, dest: string) {
  await pfs.mkdir(dest, { recursive: true });
  const filePaths = await pfs.readdir(src);
  for (const file of filePaths) {
    const curPath = path.join(src, file);
    const destPath = path.join(dest, file);
    await (fs.lstatSync(curPath).isDirectory() ? copyDir(curPath, destPath) : pfs.copyFile(curPath, destPath));
  }
}
