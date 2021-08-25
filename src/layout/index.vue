<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
  
    <Sidebar
      class="sidebar-container"
      :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }"
    />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
    <div>你好</div>
  </div>
</template>
 
<script setup lang="ts">
import RightPanel from '@/components/RightPanel/index.vue'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import { useResizeMixin } from './mixin/ResizeHandler'
import { mapState, useStore } from 'vuex'

import { computed, reactive, ref } from '@vue/reactivity'
import { useCssModule } from '@vue/runtime-dom'

const variables = reactive(useCssModule('variables')) //css变量
const store = useStore()
const { theme, sideTheme, showSettings, needTagsView, fixedHeader } = store.state.settings
const { sidebar, device } = store.state.app

useResizeMixin()//混入

const classObj = computed(() => {
  return {
    hideSidebar: !sidebar.opened,
    openSidebar: sidebar.opened,
    withoutAnimation: sidebar.withoutAnimation,
    mobile: device === 'mobile'
  }
})


function handleClickOutside() {
  store.dispatch('app/closeSideBar', { withoutAnimation: false })
}

</script>
<style lang="scss" module="variables">
@import "~@/assets/styles/variables.scss";
</style>


<style lang="scss" scoped >
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
