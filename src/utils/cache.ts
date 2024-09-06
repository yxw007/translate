import { CacheRecord } from "../types";

export class Cache {
  private cache: Map<string, CacheRecord>;
  constructor() {
    this.cache = new Map<string, CacheRecord>();
  }
  /**
   * @param key
   * @param value
   * @param time millisecond
   */
  set(key: string, value: any, time: number) {
    if (time <= 0) {
      throw new Error("time must be greater than 0");
    }
    const oldRecord = this.cache.get(key);
    if (oldRecord) {
      clearTimeout(oldRecord.timeout);
    }
    const record: CacheRecord = {
      value,
      expire: Date.now() + time,
    };
    if (!isNaN(record.expire)) {
      record.timeout = setTimeout(() => this.del(key), time) as unknown as number;
    }
    this.cache.set(key, record);
  }
  get(key: string) {
    return this.cache.get(key);
  }
  delete(key: string) {
    let canDelete = true;
    const oldRecord = this.cache.get(key);
    if (oldRecord) {
      if (!isNaN(oldRecord.expire) && oldRecord.expire < Date.now()) {
        canDelete = false;
      } else {
        clearTimeout(oldRecord.timeout);
      }
    } else {
      canDelete = false;
    }
    if (canDelete) {
      this.del(key);
    }
    return canDelete;
  }
  private del(key: string) {
    this.cache.delete(key);
  }
  clear() {
    for (const [, val] of this.cache.entries()) {
      clearTimeout(val.timeout);
    }
    this.cache.clear();
  }
}
