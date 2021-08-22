<template>
  <div class="login">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">RuoYi-Vue-Plus后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2021 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCodeImg } from "@/api/login";
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { reactive, ref, toRefs } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
// 响应式数据
const data: any = reactive({
  codeUrl: "",
  cookiePassword: "",
  loginForm: {
    username: "admin",
    password: "admin123",
    rememberMe: false,
    code: "",
    uuid: ""
  },
  loginRules: {
    username: [
      { required: true, trigger: "blur", message: "请输入您的账号" }
    ],
    password: [
      { required: true, trigger: "blur", message: "请输入您的密码" }
    ],
    code: [{ required: true, trigger: "change", message: "请输入验证码" }]
  },
  loading: false,
  // 验证码开关
  captchaOnOff: true,
  // 注册开关
  register: false,
  redirect: undefined
})
const loginFormRef: any = ref(null)
const { codeUrl, loginForm, loginRules, loading, captchaOnOff, register, redirect } = toRefs(data)
const route = useRoute()
const router = useRouter()
const store = useStore()
watch(route, (route) => {
  redirect.value = route.query && route.query.redirect;
}, { immediate: true })

getCode();
getCookie();

async function getCode() {
  let res: any = await getCodeImg()
  console.log(res)
  res = {
    data: res
  }
  captchaOnOff.value = res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff;
  if (captchaOnOff) {
    codeUrl.value = "data:image/gif;base64," + res.data.img;
    console.log(loginForm)
    console.log( loginForm.uuid)
    loginForm.value.uuid = res.data.uuid;
  }
}
function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.username : username,
    password: password === undefined ? loginForm.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.username.value, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.password.value), { expires: 30 });
        Cookies.set('rememberMe', loginForm.rememberMe.vaalue, { expires: 30 });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove('rememberMe');
      }
      store.dispatch("Login", data.loginForm).then(() => {
        router.push({ path: redirect.value || "/" })
      }).catch(() => {
        loading.value = false;
        if (captchaOnOff.value) {
          getCode();
        }
      });
    }
  });
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
