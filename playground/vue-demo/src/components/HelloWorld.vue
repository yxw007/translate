<script setup lang="ts">
import { ref } from 'vue'
import { Translator, getLanguage, engines, FromLanguage, ToLanguage } from "@yxw007/translate"

defineProps<{ msg: string }>()

const { from, to } = getLanguage("google");
Object.assign(from, { "auto": "auto" });

const translator = new Translator();
translator.use(engines.google());
const originText = ref("hello");
const translatedText = ref("");

const selectedFromLanguage = ref("auto");
const selectedToLanguage = ref("zh-CN");

const translating = ref(false);

async function translate() {
  translating.value = true;
  translatedText.value = "";
  translator.translate(originText.value, {
    engine: "google",
    from: selectedFromLanguage.value as unknown as FromLanguage<"google">,
    to: selectedToLanguage.value as unknown as ToLanguage<"google">
  }).then(res => {
    translatedText.value = res.join("")
  }).catch(e => {
    translatedText.value = e.message;
    console.error(e);
  }).finally(() => {
    translating.value = false;
  });
}

</script>

<template>
  <h1>{{ msg }}</h1>

  <div>
    originText:
    <textarea v-model="originText"
              type="text"
              placeholder="please input origin text" />
  </div>

  <div>
    <label for="from-language">From:</label>
    <select id="from-language"
            v-model="selectedFromLanguage">
      <option v-for="(value, key) in from"
              :key="key"
              :value="value">{{ key }}</option>
    </select>
  </div>

  <div>
    <label for="to-language">To:</label>
    <select id="to-language"
            v-model="selectedToLanguage">
      <option v-for="(value, key) in to"
              :key="key"
              :value="value">{{ key }}</option>
    </select>
  </div>

  <div>
    translated text:
    <p v-if="translating">...</p> {{ translatedText }}
  </div>

  <p></p>

  <button @click="translate"> translate </button>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
