<template>
  <div ref="demo" class="palette-wrapper">
    <div
      ref="knob"
      class="outer-wheel"
      :style="{ background: state.bgColor, transform: `rotate(${finalAngle}deg)` }">
    </div>
    <div class="palette">
      <label
        class="palette__tag"
        v-for="(color, index) in state.colors"
        :style="{ background: color }">
        <code :style="{ color: isColorBrighten(color) ? 'black' : 'white' }">
          {{ color.toUpperCase() }}<small :class="{ 'opacity-0': state.colors.length <= 2 }" @click.self="removeColor(index)">✕</small>
        </code>
        <input type="color" v-model="state.colors[index]">
      </label>
      <button class="ml-[.25rem] py-1 px-2 is-btn" @click="addColor">+</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fromEvent, useObservable } from '@vueuse/rxjs'
import { switchMap, map } from 'rxjs/operators'
import { takeUntil } from 'rxjs/operators'

const genRandomColor = () => {
  const hex = Math.floor(Math.random() * 16777215).toString(16)
  return `#${hex.padStart(6, '0')}`;
}

const R2D = 180 / Math.PI
const state: any = reactive({
  knobDeg: 0,
  colors: [genRandomColor(), genRandomColor()],
  isRotating: false,
  tempRotation: 0,
  rotation: 0,
  startAngle: 0,
  rotateCenter: {
    x: 0,
    y: 0
  },
  bgColor: computed(() => `linear-gradient(0deg, ${state.colors.join(",")})`),
})

const knob = ref()
const app = ref<HTMLElement>(document.querySelector('#app')!)

const emit = defineEmits(['paletteChange'])
const paletteResult = computed(() => {
  return `${finalAngle.value - 90},${state.colors.map((color: string) => color.slice(1)).join(",")}`
})

const dragWheel = useObservable(
  fromEvent(knob, 'mousedown').pipe(
    map(evt => {
      const { clientX, clientY } = evt as MouseEvent
      const rect = knob.value.getBoundingClientRect()
      const { top, left, height, width } = rect
      state.rotateCenter = {
        x: left + width / 2,
        y: top + height / 2
      }
      const x = clientX - state.rotateCenter.x
      const y = clientY - state.rotateCenter.y
      state.startAngle = R2D * Math.atan2(y, x)
      state.tempRotation = state.rotation
    }),
    switchMap(
      start => fromEvent(app, 'mousemove').pipe(
        map(evt => {
          evt.preventDefault()
          const { clientX, clientY } = evt as MouseEvent
          const x = clientX - state.rotateCenter.x;
          const y = clientY - state.rotateCenter.y;
          const d = R2D * Math.atan2(y, x);
          state.rotation = d - state.startAngle;
        }),
        takeUntil(fromEvent(app, 'mouseup').pipe(map(() => {
          if (state.tempRotation !== state.rotation) {
            state.knobDeg += state.rotation
            state.rotation = 0
          }
        })))
      )
    )
  )
)

const addColor = () => {
  state.colors.push(genRandomColor())
}

const removeColor = (index: number) => {
  if (state.colors.length > 2) {
    state.colors.splice(index, 1)
  }
}

const isColorBrighten = (hex: string) => {
  const color = +`0x${hex.slice(1)}`
  const r = color >> 16
  const g = (color >> 8) & 255
  const b = color & 255
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  return hsp > 127.5
}

const finalAngle = computed(() => {
  const deg = (state.knobDeg + state.rotation) % 360
  const positiveDeg = deg < 0 ? 360 + deg : deg
  return +positiveDeg.toFixed()
})

watch(
  paletteResult,
  (value: string) => {
    emit('paletteChange', value)
  },
  {
    immediate: true
  }
)
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
.palette {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 1rem;
}
.palette label {
  position: relative;
  padding-right: 0;
  padding-left: 12px;
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
