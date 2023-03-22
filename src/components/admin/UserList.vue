<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体 -->
        <!-- 卡片视图区 -->
        <el-card>
            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 搜索区域 -->
                    <el-input placeholder="请输入搜索内容">
                        <el-button slot="append" icon="el-icon-zoom-in"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
        created(){
            this.getUserList();
        },
        data(){
            return {

            }
        },
        methods: {
            //获取所有用户
            getUserList(){
                console.log(123)
            },
        },
}
</script>
<style lang="less" scoped>
/* 面包屑样式 */
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

/* 卡片区域  !important 提高样式级别 */
.el-card {
    box-shadow: 0 1px 1px rgba(0, 8, 10, 0.15) !important;
}
</style>