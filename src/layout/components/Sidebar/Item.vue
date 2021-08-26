<template>
  <svg-icon v-if="icon" :icon-class="icon" />
  <span v-if="title">{{ title }}</span>
</template>
<script lang="ts">
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: 'qwer'
    },
    title: {
      type: String,
      default: 'qwer'
    }
  },
  // render(h, context) {
  //   // console.log(context)
  //   // console.log( this.props)
  //   // const { icon, title } = this.props
  //   // const vnodes = []

  //   // if (icon) {
  //   //   vnodes.push("<svg-icon icon-class={'icon'}/>")
  //   // }

  //   // if (title) {
  //   //   vnodes.push("<span slot='title'>{('title')}</span>")
  //   // }
  //   // return vnodes
  //   // return <span>你好啊</span>
  //   return '按钮'
  // }
}
</script>
