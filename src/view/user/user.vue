<template>
  <div class="data-table">
    <div class="nav">
      <el-button
        type="primary"
        v-if="hasPer('user:add')"
        icon="el-icon-plus"
        @click="dialogVisible = true"
        size="mini"
      >新加用户</el-button>
    </div>
    <el-table v-loading="tabLoading" :data="tableData" stripe style="width: 100%;min-height:520px">
      <el-table-column prop="jobNumber" label="工号"></el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>性别: {{ scope.row.sex==1?"男":"女" }}</p>
            <p>年龄: {{ scope.row.age }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.status==1?'success':'danger'"
          >{{scope.row.status==1?'正常':'休息'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="phone" label="联系电话"></el-table-column>
      <el-table-column :formatter="formatDateA" prop="entryTime" label="入职时间"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180"
        v-if="hasPer('user:edit') || hasPer('user:delete')"
      >
        <template slot-scope="scope">
          <el-button
            @click="editOne(scope.row)"
            type="primary"
            icon="el-icon-edit-outline"
            size="mini"
            v-if="hasPer('user:edit')"
          >编辑</el-button>
          <el-button
            type="danger"
            :disabled="scope.row.isSuper==1"
            @click="deleteOne(scope.row)"
            v-if="hasPer('user:delete')"
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
        :current-page="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加数据弹窗 -->
    <el-dialog
      :title="add?'新加用户':'编辑用户'"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="handleClosed"
      :close-on-click-modal="false"
    >
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请填写真实的中文名"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input type="number" v-model="formData.age" placeholder="年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="formData.sex" label="1" checked>男</el-radio>
          <el-radio v-model="formData.sex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="formData.address" placeholder="常用联系地址"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime">
          <el-date-picker
            v-model="formData.entryTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="formData.roleId" placeholder="请选择角色">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="formData.status" label="1" checked>正常</el-radio>
          <el-radio v-model="formData.status" label="0">休息</el-radio>
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
import { mapGetters } from "vuex";
import {
  getUserList,
  getRoleList,
  userListAdd,
  userEdit,
  getUser,
  deleteUser
} from "@/api/userRole";
import { error } from "util";
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
      roleList: [], //角色列表
      formData: {
        username: "",
        password: "",
        entryTime: "",
        name: "", // 用户姓名(中文)
        age: "", //年龄
        avatar: "", //头像
        phone: "", //联系电话
        sex: "1", //性别
        address: "", //地址
        roleId: "", //角色id
        status: "1" // 状态
      },
      rules: {
        username: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            pattern: /[\u4e00-\u9fa5]/g,
            message: "必须为中文",
            trigger: "blur"
          }
        ],
        age: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /\d/g, message: "必须为数字", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        address: [{ required: true, message: "不能为空", trigger: "blur" }],
        roleId: [{ required: true, message: "不能为空" }],
        entryTime: [{ required: true, message: "不能为空" }]
      }
    };
  },
  created() {
    this.getList({ limit: this.limit, offset: this.offset });
    this.getRoleList();
  },
  computed: {
    ...mapGetters(["tabLoading", "roleName"])
  },
  methods: {
    // 性别转换
    sexFun(row, column) {
      let sex = row[column.prototype] || 1;
      if (sex == 1) {
        return "男";
      }
      return "女";
    },
    // 新加数据
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新加用户
          userListAdd(this.formData).then(res => {
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
    // 跟新用户信息
    editForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 新加用户
          userEdit(this.formData.id, this.formData).then(res => {
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

    // 根据id 获取用户
    getById(data) {
      getUser(data).then(res => {
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
    // 获取用户列表
    getList(data) {
      getUserList(data)
        .then(res => {
          if (this.roleName == "超级管理员") {
            this.tableData = res.data.rows;
          } else {
            this.tableData = res.data.rows.filter(item => {
              if (!item.isSuper) {
                return item;
              }
            });
          }

          if (this.tableData.length < 1) {
            this.offset = this.offset - 1 > 1 ? this.offset - 1 : 1;
          }
          this.total = res.data.count;
        })
        .catch(err => {});
    },
    // 根据id删除 用户
    deleteOne(data) {
      this.$msgbox({
        title: "删除操作",
        message: "确定要删除吗?",
        callback: e => {
          if (e == "confirm") {
            deleteUser(data.id).then(res => {
              this.$message({
                type: res.code == 1 ? "success" : "error",
                message: res.message
              });
              this.getList({ limit: this.limit, offset: this.offset });
            });
          }
        }
      });
    },
    getRoleList() {
      getRoleList().then(res => {
        this.roleList = res.data;
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
