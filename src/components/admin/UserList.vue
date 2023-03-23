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
                    <el-input placeholder="请输入搜索内容"  v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-zoom-in" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <!--作用域插槽 scope.row 存储了当前行的信息 -->
                    <template slot-scope="scope"><!--数据模板-->
                        <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 权限 -->
                        <el-tooltip effect="dark" content="分配权限" placement="top-start"
                            :enterable="false"><!--文字提示 enterable 隐藏-->
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 size-change 每页最大数变化 current-change 页数变化 layout 功能组件-->
            <div>
                <el-pagination 
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum" 
                    :page-sizes="[1, 2, 5, 100]" 
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="total"></el-pagination>
            </div>
                <!-- 新增用户 -->
            <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%"
             @close="addDialogClosed">
             <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules"
                    ref="addFormRef" label-width="70px">
                    <!-- 用户名 -->
                    <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <!-- 邮箱 -->
                    <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                </el-form>
                 <!-- 内容底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>

       <!-- 修改对话框 -->
            <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%"
             @close="editDialogClosed">
             <!-- 内容主体区域 -->
                <el-form :model="editForm" :rules="editFormRules"
                    ref="editFormRef" label-width="70px">
                    <!-- 用户名 -->
                    <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password"></el-input>
                    </el-form-item>
                    <!-- 邮箱 -->
                    <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                </el-form>
                 <!-- 内容底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>
            

        </el-card>
    </div>
</template>
<script>
export default {
    created() {
        this.getUserList();
    },
    data() {
        return {
            //查询学习实体
            queryInfo: {
                query: "",
                pageNum: 1,
                pageSize: 5,
            },
            userList: [],//用户列表
            total: 0,//总记录数
            addDialogVisible: false,//对话框状态
            addForm: {
                username: '',
                password: '',
                email: ''
            },
            //修改用户信息
            editForm:{
                username: '',
                password: '',
                email: ''
            },
            editDialogVisible: false,
            // 增加验证规则
      addFormRules:{
            username:[
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
            ],
            password:[
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
            ],
            email:[
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" }
            ],
            },
            //修改
            editFormRules:{
            username:[
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" }
            ],
            password:[
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
            ],
            email:[
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { min: 5, max: 15, message: "请输入正确邮箱地址", trigger: "blur" }
            ],
            },
        }
    },
    methods: {
        //获取所有用户
        async getUserList() {
            // 调用post请求
            const { data: res } = await this.$http.get("allUser", {
                params: this.queryInfo
            });
            this.userList = res.data; // 将返回数据赋值
            this.total = res.numbers; // 总个数
        },
            // 监听pageSize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getUserList(); // 数据发生改变重新申请数据
        },
        // 监听pageNum改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getUserList(); // 数据发生改变重新申请数据
        },
        //修改用户状态
        async userStateChanged(userInfo){
            const { data: res } = await this.$http.put(`userState?id=${userInfo.id}&state=${userInfo.state}`);
            if (res != "success") {
                    userInfo.id = !userInfo.id;
                    return this.$message.error("操作失败！！！");
                    }
            this.$message.success("操作成功！！！");
        },
        // 监听添加用户
   addDialogClosed(){
      this.$refs.addFormRef.resetFields();// 重置表单项
    },
    // 添加用户
    addUser(){
        this.$refs.addFormRef.validate(async valid =>{
        console.log(valid);
        if( !valid ) return;
        // 发起请求
        const {data:res} = await this.$http.post("addUser",this.addForm);
        if (res != "success") {
        userinfo.state = !userinfo.state;
        return this.$message.error("操作失败！！！");
        }
        this.$message.success("操作成功！！！");
        //隐藏
        this.addDialogVisible = false;
        this.getUserList();
      })
    },
    //根据主键删除
    async deleteUser(id){
        const confirmResult = await this.$confirm('操作会永久删除用户学习,是否继续','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err => err)
        if(confirmResult != 'confirm'){
            return this.$message.info("已取消删除");
        }
        const {data:res} = await this.$http.delete("deleteUser?id="+id);
        if (res != "success") {
        return this.$message.error("删除失败！！！");
        }
        this.$message.success("删除成功！！！");
        this.getUserList();
    },
    //显示对话框修改
    async showEditDialog(id){
        const {data:res} = await this.$http.get("getUpdate?id="+id);
        this.editForm = res;
        this.editDialogVisible = true;
    },
    //关闭对话框
    editDialogClosed(){
        this.$refs.editFormRef.resetFields();
    },
    //确定修改
    editUserInfo(){
        this.$refs.editFormRef.validate(async valid =>{
            if(!valid)return;
            //发起修改请求
          const {data:res} = await this.$http.put("editUser",this.editForm);
          if (res != "success") {
                return this.$message.error("修改失败！！！");
                }
                this.$message.success("修改成功！！！");

                this.editDialogVisible = false;
                this.getUserList();
        })
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