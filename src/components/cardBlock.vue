<template>
  <div class="field-group">
    <legend class="mb-4 -ml-3 font-bold flex items-center text-xl tracking-wide">
      <slot name="icon">
      </slot>
      <slot name="title">
        <h4 class="m-0">{{ props.title }}</h4>
      </slot>
    </legend>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  }
})
</script>


<style scoped>
.field-group {
  @apply flex flex-col mb-4 rounded-md p-4;
  box-shadow: 10px 10px 15px rgba(225, 225, 225, 0.5);
}
</style>