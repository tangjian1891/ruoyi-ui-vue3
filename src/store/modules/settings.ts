// import variables from '@/assets/styles/element-variables.scss'
const variables = require("@/assets/styles/element-variables.scss");
import defaultSettings from "@/settings";
console.log("这是什么啊啊",variables)
const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings;
console.log(localStorage.getItem("layout-setting"))
const storageSetting = JSON.parse(localStorage.getItem("layout-setting")) || "";
console.log(storageSetting.theme || '#1890ff')
const state = {
  title: "",
  theme: storageSetting.theme || '#1890ff',
  sideTheme: storageSetting.sideTheme || sideTheme,
  showSettings: showSettings,//侧边栏配置
  topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle,
};
const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    console.log('进入设置了')
    if (Object.prototype.hasOwnProperty.call(state,key)) {
      console.log('进入设置了')
      state[key] = value;
    }
  },
};

const actions = {
  // 修改布局设置
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  },
  // 设置网页标题
  setTitle(context, title) {
    // state.title = title;
    console.warn("这代码写的有问题啊,TODO",title)
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
