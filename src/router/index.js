import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect:"/welcome",
    children:[
              {
                path: "/welcome",
                component: Welcome
            },
            {
              path: "/user",
              component: UserList
          },
    ]
  },

 
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问，from从哪访问，next接着next(url)重定向到URL上next()继续访问to路径
  if(to.path=='/login')return next();
  //获取user
  const userFlag = window.sessionStorage.getItem("user");
  if(!userFlag)return next('/login');//无值返回登录页
  next();//符合要求
})

export default router
