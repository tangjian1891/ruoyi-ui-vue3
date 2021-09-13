import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
import { getConfigKey } from "@/api/system/config";
import { getDicts } from "@/api/system/dict/data";
import directives from "./directive";
import SvgIcon from "./components/SvgIcon/index.vue";
import "element-plus/theme-chalk/index.css";

import "@/assets/styles/index.scss"; // global css
import "@/assets/styles/ruoyi.scss"; // ruoyi css

import Pagination from "@/components/Pagination/index.vue";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar/index.vue";
// 字典标签组件
import DictTag from "@/components/DictTag/index.vue";
// 富文本组件
import Editor from "@/components/Editor/index.vue"
const app = createApp(App);
app.use(ElementPlus);

app.config.globalProperties.getDicts = getDicts;
app.config.globalProperties.getConfigKey = getConfigKey;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.handleTree = handleTree;

app.config.globalProperties.msgSuccess = function (msg) {
  app.config.globalProperties.$message({ showClose: true, message: msg, type: "success" });
};
app.config.globalProperties.$foo = "做啥啊啊啊啊";
app.config.globalProperties.foo = "做啥啊啊啊啊";
app.config.globalProperties.msgError = function (msg) {
  app.config.globalProperties.$message({ showClose: true, message: msg, type: "error" });
};

app.config.globalProperties.msgInfo = function (msg) {
  app.config.globalProperties.$message.info(msg);
};
app.component("svg-icon", SvgIcon); //全局icon
app.component("pagination", Pagination);
app.component("RightToolbar", RightToolbar);
app.component("DictTag", DictTag);
app.component("Editor", Editor);
const req = require.context("./assets/icons/svg", false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

app.use(directives); //注册插件

app.use(store);
app.use(router);

app.mount("#app");
