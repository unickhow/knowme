<template>
  <main id="card-generator">
    <div class="container max-w-[575px] min-h-100vh mx-auto shadow-xl px-6 py-4 relative">
      <div class="kv mb-8">
        <h1 class="mb-2 main-title">knowme</h1>
        <p class="m-0 text-gray-900 text-sm flex flex-wrap items-center">A readme cards generator, inspired by
          <a class="inline-flex items-center px-2 visited:text-current" href="https://github.com/anuraghazra/github-readme-stats" target="_blank">github-readme-stats</a>
        </p>
        <i class="text-sm text-gray-500">Language card is WIP.</i>
      </div>

      <CardBlock title="GitHub's username" class="field--username">
        <template #icon>
          <mdiDrawPen class="mr-2 text-[#F19F19]" />
        </template>
        <div class="flex items-center text-gray-600">
          <span class="mr-1">@</span>
          <input type="text" autofocus v-model.trim="username" class="is-input w-[150px]">
        </div>
      </CardBlock>

      <div class="tab-marks sm:absolute sm:rotate-90 -right-[84px] top-80 flex">
        <span
          v-for="tabName in tabs"
          class="py-2 px-4 bg-gray-300 opacity-30 rounded-t-md cursor-pointer"
          :class="{ 'bg-white !opacity-100 color-[#ff7a00]': tab === tabName }"
          @click="tab = tabName">{{ tabName }}</span>
      </div>

      <StatsCard v-show="tab === 'stats'" @resetUserName="username = ''" />
      <RepoCard v-show="tab === 'repo'" @resetUserName="username = ''" />

      <footer class="text-center">
        <a class="p-1 opacity-50 color-[#1d1d1d] hover:opacity-100 transition-opacity" href="https://github.com/unickhow/knowme" target="_blank">
          <zmdiGithubBox />
        </a>
      </footer>
    </div>
  </main>
</template>

<script lang="ts" setup>
import mdiDrawPen from '~icons/mdi/draw-pen';
import zmdiGithubBox from '~icons/zmdi/github-box';
import CardBlock from './components/cardBlock.vue';
import StatsCard from './components/StatsCard/index.vue';
import RepoCard from './components/RepoCard/index.vue';
import { Tabs } from './enums/tabs';

const tabs = Object.values(Tabs)
const tab = ref(tabs[0])
const username = ref('')

provide('username', username)
</script>

<style scoped>
.container {
  background-color: #fff;
  font-family: 'Ubuntu', sans-serif;
}

.main-title {
  z-index: 1;
  @apply relative;
}

.main-title::before {
  @apply absolute;
  content: '';
  bottom: .15rem;
  left: -.25rem;
  width: 80px;
  height: .8rem;
  background: #ff7a00;
  opacity: .6;
  z-index: -1;
}
</style>

<style>
html, body {
  background-color: #ececec;
  margin: 0;
  padding: 0;
}

.is-btn {
  @apply text-gray-700 bg-transparent px-4 py-2 border-none rounded-full cursor-pointer transition-colors transition-shadow;
  @apply hover:text-gray-900 active:translate-y-0.2 active:shadow;
  @apply disabled:shadow-none disabled:text-gray-400;
  box-shadow: -10px -10px 15px rgba(245, 245, 245, .5), 6px 6px 15px rgba(70, 70, 70, .12);
}

.is-btn:active svg {
  color: #ff70aa;
}
</style>
