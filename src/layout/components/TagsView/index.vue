<template>
  <div ref="elRef" id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tagRef"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新页面</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li v-if="!isLastView()" @click="closeRightTags">关闭右侧</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>

import ScrollPane from './ScrollPane.vue'
// import path from 'path'
const path = require('path')
import { computed, reactive, ref, toRefs } from '@vue/reactivity'
import { useStore } from 'vuex'
import { nextTick, onMounted, watch } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
const data: any = reactive({
  visible: false,
  top: 0,
  left: 0,
  selectedTag: {},
  affixTags: []
})
const tagRef = ref(null)
const scrollPaneRef = ref(null)
const elRef = ref(null)
const store = useStore()
const route = useRoute()
const router = useRouter()
const { visible, top, left, selectedTag, affixTags } = toRefs(data)
let visitedViews: any = computed(() => {
  return store.state.tagsView.visitedViews
})
let routes = computed(() => {
  return store.state.permission.routes
})
let theme = computed(() => {
  return store.state.settings.theme;
})
onMounted(() => {
  initTags()
  addTags()
})

watch(route, () => {
  addTags()
  moveToCurrentTag()
})
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})


function isActive(routeParam) {
  return routeParam.path === route.path
}
function activeStyle(tag) {
  if (!isActive(tag)) return {};
  return {
    "background-color": theme,
    "border-color": theme
  };
}

function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

function isLastView() {
  try {
    return data.selectedTag.fullPath === visitedViews[visitedViews.length - 1].fullPath
  } catch (err) {
    return false
  }
}

function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}


function initTags() {
  const affixTags = data.affixTags = filterAffixTags(routes)
  for (const tag of affixTags) {
    // Must have tag name
    if (tag.name) {
      store.dispatch('tagsView/addVisitedView', tag)
    }
  }
}


function addTags() {
  const { name } = route
  if (name) {
    store.dispatch('tagsView/addView', route)
  }
  return false
}

function moveToCurrentTag() {

  this.$nextTick(() => {
    for (const tag of tagRef) {
      if (tag.to.path === this.$route.path) {
        scrollPaneRef.moveToTarget(tag)
        // when query is different then update
        if (tag.to.fullPath !== route.fullPath) {
          store.dispatch('tagsView/updateVisitedView', this.$route)
        }
        break
      }
    }
  })
}

function refreshSelectedTag(view) {
  store.dispatch('tagsView/delCachedView', view).then(async () => {
    const { fullPath } = view
    await nextTick()
    router.replace({
      path: '/redirect' + fullPath
    })
  })
}

function closeSelectedTag(view) {
  store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
function closeRightTags() {
  store.dispatch('tagsView/delRightTags', data.selectedTag).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}

function closeOthersTags() {
  router.push(this.selectedTag)
  store.dispatch('tagsView/delOthersViews', data.selectedTag).then(() => {
    moveToCurrentTag()
  })
}

function closeAllTags(view) {
  store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
    if (data.affixTags.some(tag => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}

function toLastView(visitedViews, view?) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

function openMenu(tag, e) {
  const menuMinWidth = 105
  const offsetLeft = elRef.getBoundingClientRect().left // container margin left
  const offsetWidth = elRef.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const left = e.clientX - offsetLeft + 15 // 15: margin right

  if (left > maxLeft) {
    this.left = maxLeft
  } else {
    this.left = left
  }

  data.top = e.clientY
  data.visible = true
  data.selectedTag = tag
}


function closeMenu() {
  data.visible = false
}


function handleScroll() {
  closeMenu()
}

</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
