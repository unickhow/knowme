<template>
  <div class="stats-card">
    <CardBlock title="Hiding Stats" class="field--hiding-stats">
      <template #icon>
        <bxHide class="mr-2 text-[#F19F19]" />
      </template>
      <div v-for="(value, key) in Stats" :key="key" class="mb-2">
        <label class="cursor-pointer text-gray-600">
          <input
            type="checkbox"
            name="hiding-stats"
            class="mr-2"
            v-model="hidingStats"
            :value="key">
          <span>{{ caseConvert(value) }}</span>
        </label>
      </div>
    </CardBlock>
    <CardBlock title="Others" class="field--others">
      <template #icon>
        <icRoundDashboardCustomize class="mr-2 text-[#F19F19]" />
      </template>
      <div v-for="(value, key) in boolFlags" :key="key" class="mb-2">
        <label class="cursor-pointer text-gray-600">
          <input
            type="checkbox"
            class="mr-2"
            v-model="boolFlags[key]"
            :value="value">
          <span>{{ caseConvert(key) }}</span>
        </label>
      </div>
    </CardBlock>

    <CardBlock title="Customization" class="field--customization">
      <template #icon>
        <icBaselineStyle class="mr-2 text-[#F19F19]" />
      </template>
      <div v-for="(prop, key) in customization" :key="key" class="mb-2">
        <label class="cursor-pointer text-gray-600 inline-flex items-center">
          <input
            type="checkbox"
            class="mr-2"
            v-model="prop.isChecked">
          <span>{{ caseConvert(key) }}</span>
          <input type="color" class="ml-2" v-model="prop.hex">
        </label>
      </div>
    </CardBlock>

    <CardBlock title="Others" class="field--theme">
      <template #icon>
        <mdiThemeLightDark class="mr-2 text-[#F19F19]" />
      </template>
      <div class="mb-2">
        <label class="cursor-pointer text-gray-600 inline-flex items-center">
          <select v-model="selectedTheme" class="px-2 py-1">
            <option v-for="theme in themeOptions" :value="theme">{{ theme.name }}</option>
          </select>
        </label>
      </div>
    </CardBlock>

    <!-- ^^^ manipulator ^^^ -->

    <MdPreview :apiUrl="assembledApi" />

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
      <img class="max-w-full" :class="{ 'rounded-md': imgSrc.includes('placeholder.com') }" :src="imgSrc" alt="">
    </div>
  </div>
</template>

<script lang="ts" setup>
import mdiCardAccountDetailsStarOutline from '~icons/mdi/card-account-details-star-outline';
import icBaselineStyle from '~icons/ic/baseline-style';
import bxHide from '~icons/bx/hide';
import mdiThemeLightDark from '~icons/mdi/theme-light-dark';
import icRoundDashboardCustomize from '~icons/ic/round-dashboard-customize';
import fluentArrowReset24Filled from '~icons/fluent/arrow-reset-24-filled';
import { useThrottleFn } from '@vueuse/core'
import { Themes } from '../../enums/themes';
import CardBlock from '../cardBlock.vue';
import MdPreview from '../mdPreview.vue'

const username = inject('username', '')

enum Stats {
  stars = 'stars',
  commits = 'commits',
  prs = 'pull_requests',
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

const themeOptions = Object.entries(Themes).map(([key, value]) => ({
  name: key,
  value
}))
const selectedTheme = ref(themeOptions[0])

const allQueries = computed(() => {
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

  // theme
  if (selectedTheme.value.name !== 'default') str.push(`theme=${selectedTheme.value.value}`)

  return str.join('&')
})

const caseConvert = (str: string) => {
  const sentence = str.split('_')
  return sentence.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const assembledApi = computed(() => `https://github-readme-stats.vercel.app/api?${allQueries.value}`)

const imgSrc = ref('https://via.placeholder.com/495x195.png?text=check+your+username')
const handleGenerate = useThrottleFn(() => {
  if (!username.value) return false
  imgSrc.value = assembledApi.value
}, 1000, false)

const emit = defineEmits(['resetUserName'])
const handleReset = () => { 
  emit('resetUserName')
  hidingStats.value = []
  boolFlags.value = initFlags()
  customization.value = initCustomize()
}
</script>

<style scoped></style>
