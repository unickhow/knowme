<template>
  <div class="lang-card">
    <CardBlock title="Exclude Repos">
      <template #icon>
        <OcticonRepoDeleted16 class="mr-2 text-[#ff7a00]" />
      </template>
      <div
        v-for="(name, index) in excludeRepos"
        :key="index"
        class="flex mb-4">
        <input v-model="excludeRepos[index]" type="text" class="is-input">
        <button
          v-if="excludeRepos.length > 1"
          class="is-btn p-0 ml-2 w-30px h-30px rounded-full flex items-center justify-center"
          @click="excludeRepos.splice(index, 1)">
          <LaTimes />
        </button>
      </div>
      <div class="mt-4">
        <button v-if="excludeRepos.length < 5" class="is-btn flex items-center" @click="excludeRepos.push('')">
          <PhPlusDuotone class="mr-2" />
          <span>Add</span>
        </button>
      </div>
    </CardBlock>

    <CardBlock title="Languages">
      <template #icon>
        <BxCodeBlock class="mr-2 text-[#ff7a00]" />
      </template>
      <div class="field mb-4">
        <h5 class="text-lg m-0 mb-2">Counts</h5>
        <div class="flex">
          <input class="counter-range mx-2" type="range" v-model="langsCount" min="1" max="10" step="1">
          <span>{{ langsCount }}</span>
        </div>
      </div>
      <div class="field">
        <h5 class="text-lg m-0 mb-2">Hide</h5>
        <div
          v-for="(lang, index) in hideLangs"
          :key="index"
          class="flex mb-4">
          <input v-model="hideLangs[index]" type="text" class="is-input">
          <button
            v-if="hideLangs.length > 1"
            class="is-btn p-0 ml-2 w-30px h-30px rounded-full flex items-center justify-center"
            @click="hideLangs.splice(index, 1)">
            <LaTimes />
          </button>
        </div>
        <div class="mt-4">
          <button v-if="hideLangs.length < 5" class="is-btn flex items-center" @click="hideLangs.push('')">
            <PhPlusDuotone class="mr-2" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </CardBlock>

    <CardBlock title="Layout">
      <template #icon>
        <MdiViewCompact class="mr-2 text-[#ff7a00]" />
      </template>
      <div class="flex flex-col">
        <label class="cursor-pointer mb-2">
          <input v-model="layoutType" type="radio" name="layout" id="" value="default">
          <span class="ml-2">Default</span>
        </label>
        <label class="cursor-pointer">
          <input v-model="layoutType" type="radio" name="layout" id="" value="compact">
          <span class="ml-2">Compact</span>
        </label>
      </div>
    </CardBlock>

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
import CardBlock from '../cardBlock.vue'
import { useThrottleFn } from '@vueuse/core'
import MdPreview from '../mdPreview.vue'
import mdiCardAccountDetailsStarOutline from '~icons/mdi/card-account-details-star-outline';
import fluentArrowReset24Filled from '~icons/fluent/arrow-reset-24-filled';
import LaTimes from '~icons/la/times'
import PhPlusDuotone from '~icons/ph/plus-duotone'
import OcticonRepoDeleted16 from '~icons/octicon/repo-deleted-16'
import BxCodeBlock from '~icons/bx/code-block'
import MdiViewCompact from '~icons/mdi/view-compact'

const username = inject('username', '') as any

const excludeRepos = ref([''])
const hideLangs = ref([''])
const langsCount = ref(5)
const layoutType = ref('default') // compact

const allQueries = computed(() => {
  let str: string[] = [`username=${username.value}`]

  if (excludeRepos.value.length) {
    str.push(`exclude_repo=${excludeRepos.value.filter(Boolean).join(',')}`)
  }

  if (hideLangs.value.length) {
    str.push(`hide=${hideLangs.value.filter(Boolean).join(',')}`)
  }

  if (langsCount.value) {
    str.push(`langs_count=${langsCount.value}`)
  }

  if (layoutType.value !== 'default') {
    str.push(`layout=${layoutType.value}`)
  }

  return str.join('&')
})
const assembledApi = computed(() => `https://github-readme-stats.vercel.app/api/top-langs/?${allQueries.value}`)

const imgSrc = ref('https://via.placeholder.com/495x195.png?text=check+your+username')
const handleGenerate = useThrottleFn(() => {
  if (!username.value) return false
  imgSrc.value = assembledApi.value
}, 1000, false)

const emit = defineEmits(['resetUserName'])
const handleReset = () => {
  emit('resetUserName')
}
</script>
