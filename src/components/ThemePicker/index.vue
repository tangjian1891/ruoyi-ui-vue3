<template>
  <el-color-picker
    v-model="data.theme"
    :predefine="['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d',]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script lang="ts" setup>
import { computed, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch, defineEmits } from "@vue/runtime-core";
// import { themeVarsKey } from "element-plus";
import { useStore } from "vuex";

const version = require('element-plus/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color
const data = reactive({
  chalk: '', // content of theme-chalk css
  theme: ''
})
const store = useStore()
const emits = defineEmits(['change']) //事件
const instance = getCurrentInstance()
const { appContext: { config: { globalProperties } } }: any = getCurrentInstance()
const defaultTheme = computed(() => {
  return store.state.settings.theme
})

console.log(defaultTheme.value)

watch(defaultTheme, (val: string) => {
  console.log("赋值了啊啊啊", val)
  data.theme = val
}, { immediate: true })

watch(() => data.theme, async (val: string) => {
  const oldVal = data.chalk ? data.theme : ORIGINAL_THEME
  if (typeof val !== 'string') return
  const themeCluster = getThemeCluster(val.replace('#', ''))
  const originalCluster = getThemeCluster(oldVal.replace('#', ''))

  const $message = globalProperties.$message({
    message: '  Compiling the theme',
    customClass: 'theme-message',
    type: 'success',
    duration: 0,
    iconClass: 'el-icon-loading'
  })

  const getHandler = (variable, id) => {
    return () => {
      const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''))
      const newStyle = updateStyle(instance[variable], originalCluster, themeCluster)

      let styleTag = document.getElementById(id)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', id)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = newStyle
    }
  }

  if (!data.chalk) {
    const url = `https://unpkg.com/element-plus@${version}/lib/theme-chalk/index.css`
    await getCSSString(url, 'chalk')
  }

  const chalkHandler = getHandler('chalk', 'chalk-style')

  chalkHandler()

  const styles = [].slice.call(document.querySelectorAll('style'))
    .filter(style => {
      const text = style.innerText
      return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
    })
  styles.forEach(style => {
    const { innerText } = style
    if (typeof innerText !== 'string') return
    style.innerText = updateStyle(innerText, originalCluster, themeCluster)
  })

  emits('change', val)
  // emits.ch
  $message.close()
})

function updateStyle(style, oldCluster, newCluster) {
  let newStyle = style
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
  })
  return newStyle
}

function getCSSString(url, variable) {
  return new Promise<void>(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        instance[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
        resolve()
      }
    }
    xhr.open('GET', url)
    xhr.send()
  })
}

function getThemeCluster(theme) {
  const tintColor = (color, tint) => {
    let red: number | string = parseInt(color.slice(0, 2), 16)
    let green: number | string = parseInt(color.slice(2, 4), 16)
    let blue: number | string = parseInt(color.slice(4, 6), 16)

    if (tint === 0) { // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))

      red = red.toString(16)
      green = green.toString(16)
      blue = blue.toString(16)

      return `#${red}${green}${blue}`
    }
  }

  const shadeColor = (color, shade) => {
    let red: number | string = parseInt(color.slice(0, 2), 16)
    let green: number | string = parseInt(color.slice(2, 4), 16)
    let blue: number | string = parseInt(color.slice(4, 6), 16)

    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
  }

  const clusters = [theme]
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
  }
  clusters.push(shadeColor(theme, 0.1))
  return clusters
}
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
