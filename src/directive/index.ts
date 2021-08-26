import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import dialogDrag from './dialog/drag'

const install = function(app) {
  console.log("进入注册",app)
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('dialogDrag', dialogDrag)
}

// if (window.Vue) {
//   window['hasRole'] = hasRole
//   window['hasPermi'] = hasPermi
//   window['dialogDrag'] = dialogDrag
//   Vue.use(install); // eslint-disable-line
// }

export default install
