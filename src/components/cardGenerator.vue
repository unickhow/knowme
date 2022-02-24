<template>
  <main id="card-generator">
    <div class="container max-w-[800px] min-h-100vh mx-auto shadow-xl px-6 py-4">
      <h1 class="mb-2">Hail Anurag !</h1>
      <p class="mt-0 mb-8">Inspired by <a href="https://github.com/anuraghazra/github-readme-stats" target="_blank">github-readme-stats</a></p>

      <div class="field-group field--username">
        <legend class="mb-4 -ml-3 font-bold flex text-xl tracking-wide">
          <mdiDrawPen class="mr-2 text-[#F19F19]" />
          GitHub's username
        </legend>
        <div class="flex items-center text-gray-600">
          <span class="mr-1">@</span>
          <input type="text" autofocus v-model.trim="username" class="is-input w-[150px]" @keyup.enter="handleGenerate">
        </div>
      </div>
      <div class="field-group field--hiding-stats">
        <legend class="mb-4 -ml-3 font-bold flex text-xl tracking-wide">
          <mdiDrawPen class="mr-2 text-[#F19F19]" />
          Hiding Stats
        </legend>
        <div v-for="(value, key) in Stats" :key="key" class="mb-2">
          <label class="cursor-pointer text-gray-600">
            <input
              type="checkbox"
              name="hiding-stats"
              class="mr-2"
              v-model="hidingStats"
              :value="key">
            <span>{{ value }}</span>
          </label>
        </div>
      </div>
      <div class="field-group field--others">
        <legend class="mb-4 -ml-3 font-bold flex text-xl tracking-wide">
          <mdiDrawPen class="mr-2 text-[#F19F19]" />
          Others
        </legend>
        <div v-for="(value, key) in boolFlags" :key="key" class="mb-2">
          <label class="cursor-pointer text-gray-600">
            <input
              type="checkbox"
              class="mr-2"
              v-model="boolFlags[key]"
              :value="value">
            <span>{{ key }}</span>
          </label>
        </div>
      </div>
      <div class="field-group field--customization">
        <legend class="mb-4 -ml-3 font-bold flex text-xl tracking-wide">
          <mdiDrawPen class="mr-2 text-[#F19F19]" />
          Customization
        </legend>
        <div v-for="(prop, key) in customization" :key="key" class="mb-2">
          <label class="cursor-pointer text-gray-600 inline-flex items-center">
            <input
              type="checkbox"
              class="mr-2"
              v-model="prop.isChecked">
            <span>{{ key }}</span>
            <input type="color" class="ml-2" v-model="prop.hex">
          </label>
        </div>
      </div>

      <div class="bg-gray-100 rounded p-4 my-8 break-all">
        <legend class="mb-2 font-bold">Preview</legend>
        <div class="flex">
          <code class="mr-4 leading-normal">{{ assembledApi }}</code>
          <button class="border-none p-1 bg-transparent ml-auto text-gray-400 cursor-pointer hover:text-gray-600" @click="handleCopyMd">
            <lucideCopy v-show="!copied" />
            <mdiClipboardCheckOutline v-show="copied" class="color-[#F19F19]" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <button class="is-btn flex items-center mr-4 disabled:pointer-events-none" :disabled="!username" @click="handleGenerate">
          <mdiCardAccountDetailsStarOutline class="mr-2" />
          <span>Generate</span>
        </button>
        <button class="is-btn flex items-center" @click="handleReset">
          <fluentArrowReset24Filled class="mr-2" />
          <span>Reset</span>
        </button>
      </div>
      <div class="my-8 text-center">
        <img class="max-w-full" :src="imgSrc" alt="">
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import mdiCardAccountDetailsStarOutline from '~icons/mdi/card-account-details-star-outline';
import mdiDrawPen from '~icons/mdi/draw-pen';
import lucideCopy from '~icons/lucide/copy';
import mdiClipboardCheckOutline from '~icons/mdi/clipboard-check-outline';
import fluentArrowReset24Filled from '~icons/fluent/arrow-reset-24-filled';
import { useThrottleFn, useClipboard } from '@vueuse/core'

const username = ref('')

enum Stats {
  stars = 'stars',
  commits = 'commits',
  prs = 'pull requests',
  issues = 'issues',
  contribs = 'contributes'
}
const hidingStats = ref([])

const initFlags = () => ({
  count_private: false,
  show_icons: false,
  hide_title: false,
  hide_rank: false,
  include_all_commits: false,
  disable_animations: false
})
const boolFlags = ref(initFlags())

const initCustomize = () => ({
  title_color: {
    isChecked: false,
    hex: '#000000'
  },
  text_color: {
    isChecked: false,
    hex: '#000000'
  },
  icon_color: {
    isChecked: false,
    hex: '#000000'
  },
  border_color: {
    isChecked: false,
    hex: '#000000'
  },
  bg_color: {
    isChecked: false,
    hex: '#000000'
  }
})
const customization = ref(initCustomize())

const allQueries:string = computed(() => {
  // username
  let str: string[] = [`username=${username.value}`]

  // hide stats
  if (hidingStats.value.length) {
    str.push(`hide=${hidingStats.value.join(',')}`)
  }

  // other flags
  for (const [key, value] of Object.entries(boolFlags.value)) {
    if (value) {
      str.push(`${key}=true`)
    }
  }

  // customization
  for (const [key, prop] of Object.entries(customization.value)) {
    if (prop.isChecked) {
      str.push(`${key}=${prop.hex.substr(1)}`)
    }
  }

  return str.join('&')
})

const assembledApi = computed(() => `https://github-readme-stats.vercel.app/api?${allQueries.value}`)
const fullMd = computed(() => `[![${username.value}'s GitHub stats](${assembledApi.value})](https://github.com/anuraghazra/github-readme-stats)`)
const { copy, copied, isSupported } = useClipboard({ source: fullMd })
const handleCopyMd = () => {
  if (isSupported) {
    copy()
    return
  }
}

const imgSrc = ref('')
const handleGenerate = useThrottleFn(() => {
  if (!username.value) return false
  imgSrc.value = assembledApi.value
}, 1000, false)

const handleReset = () => { 
  username.value = ''
  hidingStats.value = []
  boolFlags.value = initFlags()
  customization.value = initCustomize()
}
</script>

<style scoped>
.container {
  background-color: #fff;
}
.field-group {
  @apply flex flex-col mb-4 rounded-md p-4;
  box-shadow: 10px 10px 15px rgba(225, 225, 225, 0.5);
}

.is-btn {
  @apply text-gray-700 bg-transparent px-4 py-2 border-none rounded-full cursor-pointer transition-colors transition-shadow;
  @apply hover:text-gray-900 active:translate-y-0.2 active:shadow;
  @apply disabled:shadow-none disabled:text-gray-400;
  box-shadow: -10px -10px 15px rgba(245, 245, 245, .5), 6px 6px 15px rgba(70, 70, 70, .12);
}

.is-btn:active svg {
  color: #F19F19;
}
</style>
