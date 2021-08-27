import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { ElMessage } from "element-plus";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";
// import { useStore } from "vuex";
import store from "../store";
// console.log(useStore())
// const store = useStore();
// import Home from "../views/Home.vue";
// interface MyRouteRecordRaw extends RouteRecordRaw{
//   hidden?:boolean
// }
/* Layout */
import Layout from "@/layout/index.vue";
type MyRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean;
};
export const constantRoutes: Array<MyRouteRecordRaw> = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect.vue"),
      },
    ],
  },
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
  {
    path: "",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "index",
        component: () => import("@/views/index.vue"),
        name: "Index",
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "profile",
        component: () => import("@/views/system/user/profile/index.vue"),
        name: "Profile",
        meta: { title: "个人中心", icon: "user" },
      },
    ],
  },
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
  routes: constantRoutes,
});

// 路由守卫，权限位置

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect", "/bind", "/register"];

router.beforeEach((to, from, next) => {
  NProgress.start();
  console.log("这里初始化了吗");
  if (getToken()) {
    console.log(store);
    to.meta.title && store.dispatch("settings/setTitle", to.meta.title);
    /* has token*/
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch("GetInfo")
          .then(() => {
            store.dispatch("GenerateRoutes").then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              // router.addRoutes(accessRoutes) // 动态添加可访问路由表
              accessRoutes.forEach(item => {
                if (item.path != "http://ruoyi.vip" && item.path != "*" && item.path != "https://gitee.com/JavaLionLi/RuoYi-Vue-Plus") {
                  console.log(item);
                  router.addRoute(item); // 动态添加可访问路由表
                }
                // router.addRoute(item); // 动态添加可访问路由表
              });
              next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
            });
          })
          .catch(err => {
            store.dispatch("LogOut").then(() => {
              ElMessage.error(err);
              next({ path: "/" });
            });
          });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
