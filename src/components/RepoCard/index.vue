<template>
  <div class="repo-card">
    <CardBlock title="Repository name" class="field--username">
      <template #icon>
        <octiconRepo class="mr-2 text-[#F19F19]" />
      </template>
      <div class="flex items-center text-gray-600">
        <input type="text" autofocus v-model.trim="repoName" class="is-input w-[150px]" @keyup.enter="handleGenerate">
      </div>
    </CardBlock>

    <CardBlock title="Others" class="field--others">
      <template #icon>
        <icRoundDashboardCustomize class="mr-2 text-[#F19F19]" />
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
import lucideCopy from '~icons/lucide/copy';
import mdiClipboardCheckOutline from '~icons/mdi/clipboard-check-outline';
import octiconRepo from '~icons/octicon/repo'
import mdiCardAccountDetailsStarOutline from '~icons/mdi/card-account-details-star-outline';
import fluentArrowReset24Filled from '~icons/fluent/arrow-reset-24-filled';
import icRoundDashboardCustomize from '~icons/ic/round-dashboard-customize'

import CardBlock from '../cardBlock.vue'
import { useThrottleFn, useClipboard } from '@vueuse/core'

const username = inject('username', '')
const repoName = ref('')
const shouldShowOwner = ref(false)

const allQueries = computed(() => {
  // username
  let str: string[] = [`username=${username.value}`, `repo=${repoName.value}`]

  // hide stats
  if (shouldShowOwner.value) {
    str.push('show_owner=true')
  }

  return str.join('&')
})

const assembledApi = computed(() => `https://github-readme-stats.vercel.app/api/pin/?${allQueries.value}`)
const fullMd = computed(() => `[![${username.value}'s GitHub stats](${assembledApi.value})](https://github.com/anuraghazra/github-readme-stats)`)
const { copy, copied, isSupported } = useClipboard({ source: fullMd })
const handleCopyMd = () => {
  if (isSupported) {
    copy()
    return
  }
}

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
