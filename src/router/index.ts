import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
// import Home from "../views/Home.vue";
// interface MyRouteRecordRaw extends RouteRecordRaw{
//   hidden?:boolean
// }
type MyRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean;
};
export const constantRoutes: Array<MyRouteRecordRaw> = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path(.*)',
  //       component: (resolve) => require(['@/views/redirect'], resolve)
  //     }
  //   ]
  // },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/login.vue"),
    hidden: true,
  },
  // {
  //   path: '/register',
  //   component: (resolve) => require(['@/views/register'], resolve),
  //   hidden: true
  // },
  // {
  //   path: '/404',
  //   component: (resolve) => require(['@/views/error/404'], resolve),
  //   hidden: true
  // },
  // {
  //   path: '/401',
  //   component: (resolve) => require(['@/views/error/401'], resolve),
  //   hidden: true
  // },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: (resolve) => require(['@/views/index'], resolve),
  //       name: 'Index',
  //       meta: { title: '首页', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/user',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'profile',
  //       component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
  //       name: 'Profile',
  //       meta: { title: '个人中心', icon: 'user' }
  //     }
  //   ]
  // },
  // {
  //   path: '/system/user-auth',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'role/:userId(\\d+)',
  //       component: (resolve) => require(['@/views/system/user/authRole'], resolve),
  //       name: 'AuthRole',
  //       meta: { title: '分配角色', activeMenu: '/system/user'}
  //     }
  //   ]
  // },
  // {
  //   path: '/system/role-auth',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'user/:roleId(\\d+)',
  //       component: (resolve) => require(['@/views/system/role/authUser'], resolve),
  //       name: 'AuthUser',
  //       meta: { title: '分配用户', activeMenu: '/system/role'}
  //     }
  //   ]
  // },
  // {
  //   path: '/system/dict-data',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index/:dictId(\\d+)',
  //       component: (resolve) => require(['@/views/system/dict/data'], resolve),
  //       name: 'Data',
  //       meta: { title: '字典数据', activeMenu: '/system/dict'}
  //     }
  //   ]
  // },
  // {
  //   path: '/system/oss-config',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: (resolve) => require(['@/views/system/oss/config'], resolve),
  //       name: 'OssConfig',
  //       meta: { title: '配置管理', activeMenu: '/system/oss'}
  //     }
  //   ]
  // },
  // {
  //   path: '/monitor/job-log',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: (resolve) => require(['@/views/monitor/job/log'], resolve),
  //       name: 'JobLog',
  //       meta: { title: '调度日志', activeMenu: '/monitor/job'}
  //     }
  //   ]
  // },
  // {
  //   path: '/tool/gen-edit',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index/:tableId(\\d+)',
  //       component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
  //       name: 'GenEdit',
  //       meta: { title: '修改生成配置', activeMenu: '/tool/gen'}
  //     }
  //   ]
  // }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes:constantRoutes,
});

export default router;
