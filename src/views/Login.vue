<template>
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
           class="login-container">
    <h3 class="title">Admin Login</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item>
      <!--<el-button type="info" class="item-btn" @click.native.prevent="handleReset">重置</el-button>-->
      <el-button type="primary" class="item-btn" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '@/api/api'
  import MenuUtils from '@/utils/MenuUtils'

  var routers = []
  export default {
    data () {
      return {
        logining: false,
        loginForm: {
          account: 'admin',
          checkPass: '123'
        },
        loginRules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          checkPass: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        checked: true
      }
    },
    methods: {
      handleReset () {
        this.$refs.loginForm.resetFields()
      },
      handleLogin (data, user) {
        window.sessionStorage.setItem('menuData', JSON.stringify(data))
        window.sessionStorage.setItem('user', JSON.stringify(user))
        MenuUtils(routers, data)
      },
      handleSubmit (ev) {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.logining = true
            var loginParams = {userName: this.loginForm.account, password: this.loginForm.checkPass}
            requestLogin(loginParams).then(res => {
              this.logining = false
              let {status, data} = res
              if (status !== 'success') {
                this.$notify({
                  title: '错误',
                  message: status,
                  type: 'error'
                })
              } else {
                // this.handleLogin(data, user)
                let user = {userId: data.userId,
                  name: data.userName,
                  remainder: data.remainder,
                  avatar: 'http://o73el5cs1.bkt.clouddn.com/icon-avatar.jpg'}
                this.handleLogin(data.functionList, user)
                this.$router.addRoutes(routers)
                this.$router.push({path: '/userList'})
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 10% auto;
    background: #FFFFFF;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    width: 350px;
    padding: 35px 35px 15px 35px;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 15px 0px;

    }
    .item-btn {
      width: 100%;
    }
  }
</style>
