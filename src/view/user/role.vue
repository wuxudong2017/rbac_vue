<template>
  <div class="data-table">
    <div class="nav">
      <el-button
        type="primary"
        v-if="hasPer('role:add')"
        icon="el-icon-plus"
        @click="dialogVisible = true"
        size="mini"
      >新加角色</el-button>
    </div>
    <el-table  v-loading="tabLoading" :data="tableData" stripe style="width: 100%;min-height:520px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" size="mini" type="success">正常</el-tag>
          <el-tag v-else type="danger" size="mini">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatDate" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column :formatter="formatDate" prop="updateTime" label="跟新时间"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        v-if="hasPer('role:edit') || hasPer('role:delete')  "
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            @click="editOne(scope.row)"
            type="primary"
            icon="el-icon-edit-outline"
            size="mini"
            v-if="hasPer('role:edit')"
          >编辑</el-button>
          <el-button
            type="danger"
            @click="deleteOne(scope.row)"
            icon="el-icon-delete"
            size="mini"
            v-if="hasPer('role:delete')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加数据弹窗 -->
    <el-dialog
      :title="add?'新加角色':'编辑角色'"
      :visible.sync="dialogVisible"
      width="60%"
      @closed="handleClosed"
      :close-on-click-modal="false"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="formData.status" label="1" checked>正常</el-radio>
          <el-radio v-model="formData.status" label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item v-if="!add" label="菜单&权限">
          <div v-for=" (menu,_index) in permissionList" :key="menu.menuName">
            <span style="width: 100px;display: inline-block;">
              <el-button
                :type="isMenuNone(_index)?'':(isMenuAll(_index)?'success':'primary')"
                size="mini"
                style="width:80px;"
                @click="checkAll(_index)"
              >{{menu.menuName}}</el-button>
            </span>
            <div style="display: inline-block;margin-left:20px;">
              <el-checkbox-group v-model="permissionCheck">
                <el-checkbox
                  v-for="perm in menu.permission"
                  :label="perm.id"
                  @change="checkRequired(perm,_index)"
                  :key="perm.id"
                >
                  <span :class="{requiredPerm:perm.requiredPerm===1}">{{perm.permissionName}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <p style="color:#848484;">说明:红色权限为对应菜单内的必选权限</p>
        </el-form-item>
        <el-form-item>
          <el-button v-if="add" type="primary" size="mini" @click="submitForm('ruleForm')">提交</el-button>
          <el-button v-else type="primary" size="mini" @click="editForm('ruleForm')">提交</el-button>
          <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {
  getRoleListA,
  createRole, //新加角色
  editRole,
  getRole,
  getPermissionListA,
  deleteRole
} from "@/api/userRole";
export default {
  name: "v-user",
  data() {
    return {
      add: true, //判断是否是添加
      dialogVisible: false, //弹窗
      tableData: [],
      total: 0,
      limit: 10,
      offset: 1,
      formData: {
        roleName: "",
        status: "1", // 状态
        permission: []
      },
      permissionList: [],
      permissionCheck: [],
      rules: {
        roleName: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList({ limit: this.limit, offset: this.offset });
    this.getPermisison();
  },
    computed:{
    ...mapGetters(['tabLoading','roleName'])
  },
  methods: {
    isMenuNone(_index) {
      //判断本级菜单内的权限是否一个都没选
      let menu = this.permissionList[_index].permission;
      let result = true;
      for (let j = 0; j < menu.length; j++) {
        if (this.permissionCheck.indexOf(menu[j].id) > -1) {
          result = false;
          break;
        }
      }
      return result;
    },
    isMenuAll(_index) {
      //判断本级菜单内的权限是否全选了
      let menu = this.permissionList[_index].permission;
      let result = true;
      for (let j = 0; j < menu.length; j++) {
        if (this.permissionCheck.indexOf(menu[j].id) < 0) {
          result = false;
          break;
        }
      }
      return result;
    },
    checkAll(_index) {
      //点击菜单   相当于全选按钮
      let v = this;
      if (v.isMenuAll(_index)) {
        //如果已经全选了,则全部取消
        v.noPerm(_index);
      } else {
        //如果尚未全选,则全选
        v.allPerm(_index);
      }
    },
    allPerm(_index) {
      //全部选中
      let menu = this.permissionList[_index].permission;
      for (let j = 0; j < menu.length; j++) {
        this.addUnique(menu[j].id, this.permissionCheck);
      }
    },
    noPerm(_index) {
      //全部取消选中
      let menu = this.permissionList[_index].permission;
      for (let j = 0; j < menu.length; j++) {
        let idIndex = this.permissionCheck.indexOf(menu[j].id);
        if (idIndex > -1) {
          this.permissionCheck.splice(idIndex, 1);
        }
      }
    },
    addUnique(val, arr) {
      //数组内防重复地添加元素
      let _index = arr.indexOf(val);
      if (_index < 0) {
        arr.push(val);
      }
    },
    checkRequired(_perm, _index) {
      //本方法会在勾选状态改变之后触发
      let permId = _perm.id;
      if (this.permissionCheck.indexOf(permId) > -1) {
        //选中事件
        //如果之前未勾选本权限,现在勾选完之后,tempRole里就会包含本id
        //那么就要将必选的权限勾上
        this.makeReuqiredPermissionChecked(_index);
      } else {
        //取消选中事件
        if (_perm.requiredPerm === 1) {
          //如果是必勾权限,就把本菜单的权限全部移出
          //(其实也可以提示用户本权限是菜单里的必选,请先取消勾选另外几个权限,交互太麻烦,此处就直接全部取消选中了)
          this.noPerm(_index);
        }
      }
    },
    makeReuqiredPermissionChecked(_index) {
      //将本菜单必选的权限勾上
      let menu = this.permissionList[_index].permission;
      for (let j = 0; j < menu.length; j++) {
        let perm = menu[j];
        if (perm.requiredPerm === 1) {
          //找到本菜单的必选权限,将其勾上
          this.addUnique(perm.id, this.permissionCheck);
        }
      }
    },
    // 获取权限列表
    getPermisison() {
      getPermissionListA().then(res => {
        this.permissionList = res.data;
      });
    },
    // 新加数据
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新加角色
          createRole(this.formData).then(res => {
            this.$message({
              type: res.code == 1 ? "success" : "error",
              message: res.message
            });
            this.dialogVisible = false;
            this.getList({ limit: this.limit, offset: this.offset });
            this.resetForm(formName);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 跟新角色信息
    editForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新加角色
          this.formData.permissionCheck = this.permissionCheck;

          editRole(this.formData.id, this.formData).then(res => {
            this.$message({
              type: res.code == 1 ? "success" : "error",
              message: res.message
            });
            this.dialogVisible = false;
            this.getList({ limit: this.limit, offset: this.offset });
            this.resetForm(formName);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 根据id 获取角色
    getById(data) {
      getRole(data).then(res => {
        this.formData = res.data;
        this.permissionCheck = res.data.permission;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 弹窗关闭
    handleClosed() {
      this.dialogVisible = false;
      this.add = true;
      this.resetForm("ruleForm");
    },
    // 获取角色列表
    getList(data) {
      getRoleListA(data)
        .then(res => {
          if(this.roleName=="超级管理员"){
             this.tableData = res.data.rows;
          }else{
            this.tableData = res.data.rows.filter(item=>{
              return item.roleName!="超级管理员"?item:false
            })
          }
         
           if(this.tableData.length<1){
            this.offset = this.offset-1>1?this.offset-1:1
          }
          this.total = res.data.count;
        })
        .catch(err => {});
    },
    // 根据id删除 角色
 
     deleteOne(data) {
      this.$msgbox({
        title: "删除操作",
        message: "确定要删除吗?",
        callback: e => {
          if (e == "confirm") {
            deleteRole(data.id).then(res => {
              this.$message({
                type: res.code == 1 ? "success" : "error",
                message: res.message,
                
              });
              this.getList({ limit: this.limit, offset: this.offset });
            });
           
          }
         
        }
      });
    },
    editOne(row) {
      this.dialogVisible = true;
      this.add = false;
      this.getById(row.id);
    },
    //分页
    handleSizeChange(val) {
      this.limit = val;
    },
    handleCurrentChange(val) {
      this.offset = val;
    }
  },
  watch: {
    limit(res) {
      this.getList({ limit: res, offset: this.offset });
    },
    offset(res) {
      this.getList({ limit: this.limit, offset: res });
    }
  }
};
</script>

<style lang="scss">
</style>
