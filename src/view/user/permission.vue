<template>
  <div class="data-table">
    <div class="nav">
      <el-button
        type="primary"
        v-if="hasPer('permission:add')"
        icon="el-icon-plus"
        @click="dialogVisible = true"
        size="mini"
      >新加权限</el-button>
    </div>
    <el-table v-loading="tabLoading" :data="tableData" stripe style="width: 100%;min-height:520px;">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称">
        <template slot-scope="scope">{{scope.row.menuName}}---{{scope.row.permissionName}}</template>
      </el-table-column>
      <el-table-column prop="permissionCode" label="权限值"></el-table-column>
          <el-table-column label="权限状态">
        <template slot-scope="scope">
             <i
            v-if="scope.row.status==0"
            class="el-icon-warning"
            style="color:#e6a23c;font-size:24px;"
          ></i>
          <i v-else class="el-icon-success" style="color:#67C23A;font-size:24px;"></i>
        </template>

      </el-table-column>
      <el-table-column
        fixed="right"
        v-if="hasPer('permission:edit')||hasPer('permission:delete')"
        label="操作"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            @click="editOne(scope.row)"
            type="primary"
            icon="el-icon-edit-outline"
            size="mini"
            v-if="hasPer('permission:edit')"
          >编辑</el-button>
          <el-button
            type="danger"
            v-if="hasPer('permission:delete')"
            @click="deleteOne(scope.row)"
            icon="el-icon-delete"
            size="mini"
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
      :title="add?'新加权限':'编辑权限'"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="handleClosed"
      :close-on-click-modal="false"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="所属模块" prop="menuName">
          <el-input v-model="formData.menuName" placeholder="请输入模块名"></el-input>
        </el-form-item>
        <el-form-item label="权限操作" prop="permissionName">
          <el-input v-model="formData.permissionName" placeholder="请输入操作"></el-input>
        </el-form-item>
        <el-form-item label="权限值" prop="permissionCode">
          <el-input v-model="formData.permissionCode" placeholder="请输入权限值"></el-input>
        </el-form-item>
         <el-form-item label="权限值" prop="permissionCode">
          <el-switch v-model="formData.status"
          :active-value="1"
          :inactive-value="0"
          ></el-switch>
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
  getPermissionList,
  createPermission, //新加权限
  editPermission,
  getPermission,
  deletePermission
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
        menuName: "",
        permissionName: "", // 状态
        permissionCode: "",
        isRequired: ""
      },
      rules: {
        menuName: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            pattern: /[\u4e00-\u9fa5]/g,
            message: "必须为中文",
            trigger: "blur"
          }
        ],
        permissionName: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            pattern: /[\u4e00-\u9fa5]/g,
            message: "必须为中文",
            trigger: "blur"
          }
        ],
        permissionCode: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList({ limit: this.limit, offset: this.offset });
  },
    computed:{
    ...mapGetters(['tabLoading'])
  },
  methods: {
    // 新加数据
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新加权限
          createPermission(this.formData).then(res => {
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
    // 跟新权限信息
    editForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新加权限
          editPermission(this.formData.id, this.formData).then(res => {
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

    // 根据id 获取权限
    getById(data) {
      console.log(data);
      getPermission(data).then(res => {
        this.formData = res.data;
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
    // 获取权限列表
    getList(data) {
      getPermissionList(data)
        .then(res => {
          this.tableData = res.data.rows;
           if(this.tableData.length<1){
            this.offset = this.offset-1>1?this.offset-1:1
          }
          this.total = res.data.count;
        })
        .catch(err => {});
    },
    // 根据id删除 权限
     deleteOne(data) {
      this.$msgbox({
        title: "删除操作",
        message: "确定要删除吗?",
        callback: e => {
          if (e == "confirm") {
            deletePermission(data.id).then(res => {
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
