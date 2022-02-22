<template>
  <div class="container">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam et, illum voluptatum itaque odio alias ad! Minus illum, amet soluta totam facilis ducimus laboriosam error. Obcaecati dicta saepe quod ratione quam tempora optio, maxime voluptatibus incidunt assumenda corporis accusantium harum beatae cupiditate autem, natus tempore facilis et laudantium? Iure ratione debitis, earum, expedita ipsam impedit, eligendi odio delectus magni officia dicta sequi nulla quasi eius tempora. Distinctio, similique hic autem id fugit temporibus natus saepe corrupti, tenetur fugiat labore! Libero dignissimos vel quibusdam tempora at totam et vitae hic nesciunt corrupti, facilis, dicta voluptatibus assumenda reiciendis magni dolorem doloribus nihil.
  </div>
  <h1 class="text-base bg-red-200 hover:text-gray-600 transition-color">{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Docs
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<style scoped>
</style>
