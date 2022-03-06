<template>
  <CardBlock title="Theme" class="field--theme">
    <template #icon>
      <mdiThemeLightDark class="mr-2 text-[#ff7a00]" />
    </template>
    <div class="mb-2">
      <label class="cursor-pointer text-gray-600 inline-flex items-center">
        <select :value="props.theme" @change="onThemeChange" class="px-2 py-1">
          <option v-for="theme in themeOptions" :value="theme">{{ theme }}</option>
        </select>
      </label>
    </div>
    <figure class="m-0 my-2">
      <img
        :src="props.category === 'stats' ? statsPreview(props.theme) : repoPreview(props.theme)"
        class="max-w-[400px] w-full"
        alt="theme-preview">
    </figure>
    <a href="https://github.com/anuraghazra/github-readme-stats/blob/master/themes/README.md" class="text-xs text-gray-400" target="_blank">
      <i>- theme preview (github-readme-stats/themes/README.md)</i>
    </a>
  </CardBlock>
</template>

<script lang="ts" setup>
import CardBlock from './cardBlock.vue'
import mdiThemeLightDark from '~icons/mdi/theme-light-dark'
import { Themes as statsThemes, getPreviewImg as statsPreview } from '../enums/statsThemes'
import { Themes as repoThemes, getPreviewImg as repoPreview } from '../enums/repoThemes'

const props = defineProps(['theme', 'category'])

const themeOptions = computed(() => {
  return props.category === 'stats' ? statsThemes : repoThemes
})

const emit = defineEmits(['update:theme'])

const onThemeChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const themeSelected = target.value
  emit('update:theme', themeSelected)
}
</script>
