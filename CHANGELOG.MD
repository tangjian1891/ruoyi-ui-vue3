1.更新vue,@vue/compiler-sfc 为3.2.4
2.语法变化 模板引用ref https://vue3js.cn/docs/zh/guide/composition-api-template-refs.html
3.非空断言！https://cloud.tencent.com/developer/article/1610693
4.volar版本bug，回退版本至 0.27.3
5.按键修饰符 KeyboardEvent.keyCode 废弃 https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode  event.keyCode被event.code替换，建议将它们转换为它们的 kebab-cased (短横线) 命名对齐。 注:keyup.13，使用keyup.entry
6.移除native修饰符 
https://v3.vuejs.org/guide/migration/v-on-native-modifier-removed.html#v-on-native-modifier-removed  移除原因
https://v3.vuejs.org/guide/migration/emits-option.html#_3-x-behavior   新的emits，更好的控制
7.插槽。vue3使用vue2.6全新插槽语法，旧的语法已被移除 https://cn.vuejs.org/v2/guide/components-slots.html
8.事件出事this.$emit()调整。 https://v3.vuejs.org/api/sfc-script-setup.html#defineprops-and-defineemits 配合6移除native阅读
9.css module值得使用。可以替换webpack4的scss变量:export导出方式。 文档地址:https://v3.vuejs.org/api/sfc-style.html#style-module

10.vue2挂载到原型的。现在挂载为 app.config.globalProperties上.调用方式  internalInstance.appContext.config.globalProperties 为 https://v3.vuejs.org/api/composition-api.html#getcurrentinstance   还有一种为internalInstance.proxy   
https://juejin.cn/post/6911883529098002446  getCurrentInstance



关于jsx的使用 
https://juejin.cn/post/6911883529098002446
https://juejin.cn/post/6984656399812788238


 全部替换为 空


<!-- 依赖升级 --> 
@riophae/vue-treeselect 升级为 vue3-treeselect
vuedraggable 升级为   vuedraggable@next
<!-- webpack内部不在 polyfill node模块,所以path模块必须手动引入 -->
path-browserify  以及 process