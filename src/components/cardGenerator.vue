<template>
  <main id="card-generator">
    <div class="container max-w-[800px] min-h-100vh mx-auto shadow-xl px-6 py-4">
      <h1 class="mb-2">Hail Anurag !</h1>
      <p class="mt-0 mb-8">inspired by <a href="https://github.com/anuraghazra/github-readme-stats" target="_blank">github-readme-stats</a></p>

      <div class="flex flex-col mb-4">
        <legend class="mb-2 font-bold">GitHub's username</legend>
        <input type="text" v-model="form.username">
      </div>
      <div class="flex flex-col mb-4">
        <legend class="mb-2 font-bold">Hiding Stats</legend>
        <div v-for="stat in Stats" :key="stat">
          <input :id="`stat_${stat}`" type="checkbox" name="hiding-stats" v-model="form.hide" :value="stat">
          <label :for="`stat_${stat}`">{{ stat }}</label>
        </div>
      </div>
      <div class="flex flex-col mb-4">
        <legend class="mb-2 font-bold">Others</legend>
        <div>
          <input id="count_private" type="checkbox" v-model="form.count_private" :value="true">
          <label for="count_private">count_private</label>
        </div>
        <div>
          <input id="show_icons" type="checkbox" v-model="form.show_icons" :value="true">
          <label for="show_icons">show_icons</label>
        </div>
      </div>

      <p class="bg-gray-100 rounded p-4">Preview:<br>
        <code>{{ assembledApi }}</code>
      </p>

      <button @click="handleGenerate">Generate</button>
      <div class="mt-8">
        <img :src="imgSrc" alt="">
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
enum Stats {
  stars = 'stars',
  commits = 'commits',
  prs = 'prs',
  issues = 'issues',
  contribs = 'contribs'
}

const isGenerate = ref(false)
const imgSrc = ref('')
const form = reactive({
  username: '',
  hide: [],
  count_private: false,
  show_icons: false
})

const allQueries:string = computed(() => {
  let str: string[] = []
  for (const [key, value] of Object.entries(form)) {
    if (typeof value === 'string') {
      str.push(`${key}=${value}`)
    } else if (Array.isArray(value)) {
      str.push(`${key}=${value.join(',')}`)
    } else if (typeof value === 'boolean' && !!value) {
      str.push(`${key}=${value}`)
    }
  }
  return str.join('&')
})
// [![${form.username}'s GitHub stats](https://github-readme-stats.vercel.app/api?${allQueries.value})](https://github.com/anuraghazra/github-readme-stats)
const assembledApi = computed(() => `https://github-readme-stats.vercel.app/api?${allQueries.value}`)

const handleGenerate = () => {
  imgSrc.value = assembledApi.value
}
</script>
