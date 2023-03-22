<template>
  <div class ="login_container">
    <!-- 登录块 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="未加载">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login_form" label-width="0">
        <!-- 用户名 -->
        <el-form-item prop="username" >
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-zhanghao"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">提交</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

  export default{
      data() {
        return {
          //表单数据
          loginForm: {
            username: "admin",
            password: "123456"
          },
          //验证对象
          loginRules: 
          {
              //校验规则
              username: [
              { required: true, message: '请输入用户名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ],
              password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
              ],
          },
        }
      },
      methods: {
        //重置表单
        restLoginForm()
        {
          this.$refs.loginFormRef.resetFields();
        },
        //处理登录
        login(){
          this.$refs.loginFormRef.validate(async valid =>{
            if( !valid ) return;
            const {data:res} = await this.$http.post("login",this.loginForm);
            if(res.flag == "ok")
            {
              window.sessionStorage.setItem("user",res.user);//存储User对象
                this.$message.success("登录成功");
                this.$router.push({path:"/home"});
             
            }else{
              this.$message.error("操作失败");
            }
          })
        },
      },
  }
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 2px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #0ee;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
