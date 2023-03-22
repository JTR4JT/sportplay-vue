<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="">
                <span>个人运动平台</span>
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="iscollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapase">|||</div>
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff" unique-opened
                    :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObject[item.id]"></i>
                            <span>{{ item.title }}</span>
                        </template>

                        <el-menu-item :index="it.path " v-for="it in item.sList" :key="it.id" @click="saveNavState(it.path)">
                            <template slot="title">
                                <i :class="iconsObject[it.id]"></i>
                                <span>{{ it.title }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体类容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import router from '@/router';

export default {
    data() {
        return {
            // 菜单列表
            menuList: [],
            iscollapse: false,
            iconsObject: {
                "100": "iconfont icon-icon-guanliyuan",
                "200": "iconfont icon-fanshe",
                "101": "iconfont icon-yonghu",
                "102": "iconfont icon-quanxian",
                "103": "iconfont icon-yundong-",
                "104": "iconfont icon-jianshenfang",
                "201": "iconfont icon-kepuxuanjiao",
                "202": "iconfont icon-qialuli",
                "203": "iconfont icon-yingyangke",
                "204": "iconfont icon-search",
            },
            activePath:'/welcome',//默认路径
        };
    },
    created() {
        //加载时查询menuList
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');//取出session里面的path
    },
    methods: {
        logout() {
            window.sessionStorage.clear(); //清除session
            this.$router.push("/login");
        },
        // 获取导航菜单方法
        async getMenuList() {
            const { data: res } = await this.$http.get("menus");
            console.log(res);
            if (res.flag != 200)
                return this.$message.error("获取失败");
            this.menuList = res.menus;
        },
        //控制伸缩
        toggleCollapase() {
            this.iscollapse = !this.iscollapse;
        },
        //保存路径
        saveNavState(activePath){
            window.sessionStorage.setItem("activePath",activePath);
            this.activePath = activePath;
        },
    },
    components: { router }
}
</script>
<style lang="less" scoped>
//充满
.home-container {
    height: 100%;
}

//头部样式
.el-header {
    background-color: #373d41;
    display: flex;
    /*左右贴边 */
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }

}

//侧边栏样式
.el-aside {
    background-color: #333744;

    .el-menu {
        border-right: none; // 对其右边框
    }
}

//主体样式
.el-main {
    background-color: #eaedf1;
}


img {
    width: 55px;
    height: 55px;
}

//收缩按钮
.toggle-button {
    background-color: #4A5064;
    font-size: 10;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer; //显示小手
}
</style>