<template>
  <div class="bg-gray-100 rounded p-4 my-8 break-all">
    <legend class="mb-2 font-bold">Preview</legend>
    <div class="flex">
      <code class="mr-4 leading-normal">{{ props.apiUrl }}</code>
      <button class="border-none p-1 bg-transparent ml-auto text-gray-400 cursor-pointer hover:text-gray-600" @click="handleCopyMd">
        <lucideCopy v-show="!copied" />
        <mdiClipboardCheckOutline v-show="copied" class="color-[#F19F19]" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import lucideCopy from '~icons/lucide/copy'
import mdiClipboardCheckOutline from '~icons/mdi/clipboard-check-outline'
import { useClipboard } from '@vueuse/core'

const username = inject('username', '') as any
const props = defineProps({
  apiUrl: {
    type: String,
    default: ''
  }
})
const fullMd = computed(() => `[![${username.value}'s GitHub stats](${props.apiUrl})](https://github.com/anuraghazra/github-readme-stats)`)
const { copy, copied, isSupported } = useClipboard({ source: fullMd })
const handleCopyMd = () => {
  if (isSupported) {
    copy()
    return
  }
}

</script>
