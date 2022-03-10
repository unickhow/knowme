<template>
  <div class="palette-wrapper">
    {{ finalAngle }} deg
    <div
      ref="knob"
      class="outer-wheel"
      :style="{ background: state.bgColor, transform: `rotate(${state.knobDeg + state.rotation}deg)` }"
      @mousedown.prevent="startRotate"
      @mousemove.prevent="onRotating"
      @mouseup.prevent="stopRotate">
    </div>
    <div class="palette">
      <label
        class="palette__tag"
        v-for="(color, index) in state.colors"
        :style="{ background: color }">
        <code :style="{ color: isColorBrighten(color) ? 'black' : 'white' }">
          {{ color.toUpperCase() }}<small @click.self="removeColor(index)">✕</small>
        </code>
        <input type="color" v-model="state.colors[index]">
      </label>
      <button @click="addColor">+</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const genRandomColor = () => {
  const hex = Math.floor(Math.random() * 16777215).toString(16)
  return `#${hex.padStart(6, '0')}`;
}

const state: any = reactive({
  knobDeg: 0,
  colors: [genRandomColor(), genRandomColor()],
  isRotating: false,
  tempRotation: 0,
  rotation: 0,
  r2d: 180 / Math.PI,
  startAngle: 0,
  rotateCenter: {
    x: 0,
    y: 0
  },
  bgColor: computed(() => `linear-gradient(0deg, ${state.colors.join(",")})`),
})

const knob = ref()

const startRotate = (evt: MouseEvent) => {
  const rect = knob.value.getBoundingClientRect()
  const { top, left, height, width } = rect
  state.rotateCenter = {
    x: left + width / 2,
    y: top + height / 2
  }
  const x = evt.clientX - state.rotateCenter.x
  const y = evt.clientY - state.rotateCenter.y
  state.startAngle = state.r2d * Math.atan2(y, x)
  state.tempRotation = state.rotation
  state.isRotating = true
}

const onRotating = (evt: MouseEvent) => {
  if (state.isRotating) {
    const x = evt.clientX - state.rotateCenter.x;
    const y = evt.clientY - state.rotateCenter.y;
    const d = state.r2d * Math.atan2(y, x);
    state.rotation = d - state.startAngle;
  }
}

const stopRotate = (evt: MouseEvent) => {
  if (state.tempRotation !== state.rotation) {
    state.knobDeg += state.rotation;
    state.rotation = 0;
  }
  state.isRotating = false;
}

const addColor = () => {
  state.colors.push(genRandomColor())
}

const removeColor = (index: number) => {
  if (state.colors.length > 2) state.colors.splice(index, 1)
}

const isColorBrighten = (hex: string) => {
  const color = +`0x${hex.slice(1)}`
  const r = color >> 16
  const g = (color >> 8) & 255
  const b = color & 255
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  return hsp > 127.5
}

const finalAngle = computed(() => ((state.knobDeg + state.rotation) % 360).toFixed())
</script>

<style scoped>
.palette-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.outer-wheel {
  margin-top: 1rem;
  width: 200px;
  height: 200px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.outer-wheel .inner-wheel {
  width: 60px;
  height: 60px;
  position: relative;
}
.outer-wheel .inner-wheel .inner-wheel__knob {
  box-shadow: inset 4px -4px 10px #1f1f1f;
  border-radius: 100%;
  background: #3d3d3d;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.outer-wheel .inner-wheel .inner-wheel__knob span {
  color: #fafafa;
  font-size: 1.5rem;
  offset-rotate: 90deg;
}
.outer-wheel .inner-wheel .inner-wheel__knob span::after {
  content: "°";
}
.outer-wheel .inner-wheel .inner-wheel__anchor {
  box-shadow: inset -4px 0px 8px #ff9f1c;
  position: absolute;
  right: calc(50% - 10px);
  top: 0px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #ffc857;
}
.palette {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.palette label {
  position: relative;
  padding-top: 4px;
  padding-right: 0;
  padding-bottom: 4px;
  padding-left: 12px;
  border: solid 1px #ddd;
  border-radius: 4px;
}
.palette label:not(:last-child) {
  margin: 0.25rem;
}
.palette label code small {
  padding: 8px;
  cursor: pointer;
}
.palette label input {
  opacity: 0;
  width: 1px;
  height: 1px;
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
