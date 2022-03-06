<template>
  <div class="repo-card">
    <CardBlock title="Repository name" class="field--username">
      <template #icon>
        <octiconRepo class="mr-2 text-[#ff7a00]" />
      </template>
      <div class="flex items-center text-gray-600">
        <input type="text" autofocus v-model.trim="repoName" class="is-input w-[150px]" @keyup.enter="handleGenerate">
      </div>
    </CardBlock>

    <CardBlock title="Others" class="field--others">
      <template #icon>
        <icRoundDashboardCustomize class="mr-2 text-[#ff7a00]" />
      </template>
      <div>
        <label class="cursor-pointer text-gray-600">
          <input
            type="checkbox"
            class="mr-2"
            v-model="shouldShowOwner"
            :value="true">
          <span>Show owner</span>
        </label>
      </div>
    </CardBlock>

    <CardBlock title="Customization" class="field--customization">
      <template #icon>
        <gridiconsCustomize class="mr-2 text-[#ff7a00]" />
      </template>
      <div v-for="(prop, key) in customization" :key="key" class="mb-2">
        <label class="cursor-pointer text-gray-600 inline-flex items-center">
          <input
            type="checkbox"
            class="mr-2"
            v-model="prop.isChecked">
          <span>{{ caseConvert(key) }}</span>
          <input type="text" class="ml-2" v-model="prop.value">
        </label>
      </div>
    </CardBlock>

    <ThemePreview v-model:theme="selectedTheme" category="repo" />

    <MdPreview :apiUrl="assembledApi" />

    <div class="flex items-center justify-center">
      <button class="is-btn flex items-center mr-4 disabled:pointer-events-none" :disabled="!username || !repoName" @click="handleGenerate">
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
import octiconRepo from '~icons/octicon/repo'
import mdiCardAccountDetailsStarOutline from '~icons/mdi/card-account-details-star-outline';
import fluentArrowReset24Filled from '~icons/fluent/arrow-reset-24-filled';
import icRoundDashboardCustomize from '~icons/ic/round-dashboard-customize'
import gridiconsCustomize from '~icons/gridicons/customize'
import { useThrottleFn } from '@vueuse/core'
import CardBlock from '../cardBlock.vue'
import MdPreview from '../mdPreview.vue'
import ThemePreview from '../themePreview.vue'
import caseConvert from '../../utils/caseConvert'

const username = inject('username', '') as any
const repoName = ref('')
const shouldShowOwner = ref(false)
const selectedTheme = ref('default_repocard')

const initCustomization = () => ({
  cache_seconds: {
    isChecked: false,
    value: 1800,
  },
  border_radius: {
    isChecked: false,
    value: 0
  }
})
const customization = ref(initCustomization())

const allQueries = computed(() => {
  let str: string[] = [`username=${username.value}`, `repo=${repoName.value}`]

  if (shouldShowOwner.value) {
    str.push('show_owner=true')
  }

  // customization
  for (const [key, prop] of Object.entries(customization.value)) {
    if (prop.isChecked) {
      str.push(`${key}=${prop.value}`)
    }
  }

  if (selectedTheme.value !== 'default_repocard') str.push(`theme=${selectedTheme.value}`)

  return str.join('&')
})

const assembledApi = computed(() => `https://github-readme-stats.vercel.app/api/pin/?${allQueries.value}`)

const imgSrc = ref('https://via.placeholder.com/495x195.png?text=check+your+username')
const handleGenerate = useThrottleFn(() => {
  if (!username.value) return false
  imgSrc.value = assembledApi.value
}, 1000, false)

const emit = defineEmits(['resetUserName'])
const handleReset = () => {
  emit('resetUserName')
  repoName.value = ''
  shouldShowOwner.value = false
}
</script>
