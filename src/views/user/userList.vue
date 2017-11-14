<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <!--<el-table-column type="index" width="50"></el-table-column>-->
      <el-table-column prop="userId" label="序号" width="50"></el-table-column>
      <el-table-column prop="userName" label="姓名" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80" :formatter="formatSex" sortable></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="130"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="130"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="130"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button type="primary" @click="userDetailClick(scope.$index, scope.row)" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-col :span="24" class="toolbar" style="text-align: center; padding-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
        :page-size="pageSize"
        :page-sizes="[10]"
        :current-page="pageIndex"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sourceTotal">
      </el-pagination>
    </el-col>

    <!-- Tab页卡 -->
    <el-dialog :title="currtUser" :visible="userTabVisible" width="100%" :close-on-click-modal="false"
               @close="userTabVisible=false" top="5vh" :fullscreen="true">
      <el-tabs v-model="userTabName" type="card" @tab-click="tabHandleClick">
        <el-tab-pane label="账户信息" name="1" class="tab-user-info">
          <el-button type="primary" @click="editUserInfo">修改</el-button>
          <form class="el-form el-form--label-left el-form--inline">
            <div class="el-form-item"><label class="el-form-item__label">姓名</label>
              <div class="el-form-item__content"><span>{{userDetail.userName}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">性别</label>
              <div class="el-form-item__content"><span>{{userDetail.sex}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">userBalance</label>
              <div class="el-form-item__content"><span>{{userDetail.userBalance}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">E-mail</label>
              <div class="el-form-item__content"><span>{{userDetail.email}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">手机</label>
              <div class="el-form-item__content"><span>{{userDetail.phone}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">手机状态</label>
              <div class="el-form-item__content"><span>{{userDetail.phoneStatus}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">创建时间</label>
              <div class="el-form-item__content"><span>{{userDetail.createTimeStr}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">最后更新时间</label>
              <div class="el-form-item__content"><span>{{userDetail.updateTimeStr}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">别名</label>
              <div class="el-form-item__content"><span>{{userDetail.aliasName}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">银行卡状态</label>
              <div class="el-form-item__content"><span>{{userDetail.bankStatus}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">E-mail状态</label>
              <div class="el-form-item__content"><span>{{userDetail.emailStatus}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">AgentCode</label>
              <div class="el-form-item__content"><span>{{userDetail.agentCode}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">用户级别</label>
              <div class="el-form-item__content"><span>{{userDetail.userLevel}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">QQ</label>
              <div class="el-form-item__content"><span>{{userDetail.qq}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">生日</label>
              <div class="el-form-item__content"><span>{{userDetail.birthday}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">状态</label>
              <div class="el-form-item__content"><span>{{userDetail.status}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">取款密码</label>
              <div class="el-form-item__content"><span>{{userDetail.withdrawalPassword}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">地址</label>
              <div class="el-form-item__content"><span>{{userDetail.address}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">存款ID</label>
              <div class="el-form-item__content"><span>{{userDetail.depositGroupId}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">地域</label>
              <div class="el-form-item__content">
                <span>{{userDetail.area}}-{{userDetail.province}}-{{userDetail.city}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">securityLevel</label>
              <div class="el-form-item__content"><span>{{userDetail.securityLevel}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">最新登录IP</label>
              <div class="el-form-item__content"><span>{{userDetail.lastloginIp}}</span></div>
            </div>
          </form>
        </el-tab-pane>
        <el-tab-pane label="提款信息" name="2">
          <el-table :data="withdrawals" highlight-current-row style="width: 100%;">
            <el-table-column prop="userId" label="序号" width="50"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="bankName" label="银行"></el-table-column>
            <el-table-column prop="branchbankName" label="支行"></el-table-column>
            <el-table-column prop="bankNo" label="卡号"></el-table-column>
            <el-table-column prop="withdrawalNo" label="交易单号"></el-table-column>
            <el-table-column prop="requestWithdrawalAmount" label="金额"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="createTime" label="时间"></el-table-column>
            <el-table-column prop="province" label="省"></el-table-column>
            <el-table-column prop="city" label="市"></el-table-column>
            <el-table-column prop="district" label="街道"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="存款信息" name="3">
          <el-table :data="depositList" highlight-current-row style="width: 100%;">
            <el-table-column prop="userId" label="序号" width="50"></el-table-column>
            <el-table-column prop="orderNo" label="订单号"></el-table-column>
            <el-table-column prop="serialNumber" label="流水号"></el-table-column>
            <el-table-column prop="offlineBankName" label="银行"></el-table-column>
            <el-table-column prop="offlinearea" label="地区"></el-table-column>
            <el-table-column prop="offlineProvince" label="省"></el-table-column>
            <el-table-column prop="offlineAccountname" label="市"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="bankCode" label="银行简称"></el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="actualAmount" label="actualAmount"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="转账信息" name="4">转账信息</el-tab-pane>
        <el-tab-pane label="余额日志信息" name="5">余额日志信息</el-tab-pane>
        <el-tab-pane label="反水信息" name="6">反水信息</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="userTabVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!--修改用户界面-->
    <el-dialog :title="currtUser" :visible="editUserFormVisible" :close-on-click-modal="false"
               @close="editUserFormVisible=false" top="5vh">
      <el-form :model="editUserForm" label-width="100px" :rules="editUserFormRules" ref="editUserForm">
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editUserForm.address"></el-input>
        </el-form-item>
        <el-form-item label="手机状态">
          <el-radio-group v-model="editUserForm.phoneStatus">
            <el-radio class="radio" :label="0">未激活</el-radio>
            <el-radio class="radio" :label="1">激活</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="E-mail状态">
          <el-radio-group v-model="editUserForm.emailStatus">
            <el-radio class="radio" :label="0">未激活</el-radio>
            <el-radio class="radio" :label="1">激活</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户等级">
          <el-input-number v-model="editUserForm.userLevel" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="存款ID">
          <el-input v-model="editUserForm.depositGroupId"></el-input>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-radio-group v-model="editUserForm.status">
            <el-radio class="radio" :label="0">未激活</el-radio>
            <el-radio class="radio" :label="1">激活</el-radio>
            <el-radio class="radio" :label="2">暂停</el-radio>
            <el-radio class="radio" :label="3">危险账号</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editUserFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editUserSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import { requestUserList, requestUserDetail, editUserInfo, withdrawalByUserId, depositListByUserId } from '@/api/api'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
    components: {ElForm},
    name: 'userList',
    data () {
      return {
        filters: {
          name: ''
        },
        users: [],
        userDetail: {},
        currtUser: '',
        listLoading: false,
        sourceTotal: 100,
        pageIndex: 1,
        pageSize: 10,
        userTabName: '1',
        userTabVisible: false,
        editUserFormVisible: false,
        editLoading: false,
        editUserForm: {
          userId: 26,
          address: '',
          phone: '',
          email: '',
          phoneStatus: 0,
          emailStatus: 0,
          userLevel: 0,
          depositGroupId: 0,
          status: 0
        },
        editUserFormRules: {
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ]
        },
        withdrawals: [],
        depositList: []
      }
    },
    methods: {
      formatSex: function (row, column) {
        return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知'
      },
      formatStatus: function (row, column) {
        if (row.status === 0) {
          return '未激活'
        } else if (row.status === 1) {
          return '激活'
        } else if (row.status === 2) {
          return '暂停'
        } else if (row.status === 3) {
          return '危险账号'
        }
      },
      userDetailClick (index, row) {
        this.currtUser = row.userName
        this.userTabVisible = true
        if (this.userTabName === '1') {
          this.getUserDetail(row.userId)
        } else if (this.userTabName === '2') {
          this.getWithdrawalByUserId(row.userId)
        } else if (this.userTabName === '3') {
          this.getDepositListByUserId(row.userId)
        }
        console.log(index + ' - ' + row)
      },
      handleSizeChange: function (size) {
        this.pageSize = size
        this.pageIndex = 1
        console.log(`每页 ${size} 条`)
      },
      handleIndexChange: function (index) {
        this.pageIndex = index
        this.getUserList()
        console.log(`当前页: ${index}`)
      },
      tabHandleClick (tab, event) {
        console.log(tab)
        if (tab.label === '账户信息') {
          this.getUserDetail()
        } else if (tab.label === '提款信息') {
          this.getWithdrawalByUserId(this.userDetail.userId)
        } else if (tab.label === '存款信息') {
          this.getDepositListByUserId(this.userDetail.userId)
        }
      },
      editUserInfo () {
        this.editUserForm = this.userDetail
        this.currtUser = this.userDetail.userName
        this.editUserFormVisible = true
      },
      editUserSubmit () {
        this.$refs.editUserForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              // let para = Object.assign({}, this.editUserForm)
              let para = 'userId=' + this.editUserForm.userId + '&address=' + this.editUserForm.address + '' +
                '&phone=' + this.editUserForm.phone + '&email=' + this.editUserForm.email + '' +
                '&phoneStatus=' + this.editUserForm.phoneStatus + '&emailStatus=' + this.editUserForm.emailStatus + '' +
                '&userLevel=' + this.editUserForm.userLevel + '&depositGroupId=' + this.editUserForm.depositGroupId + '' +
                '&status=' + this.editUserForm.status
              editUserInfo(para).then((res) => {
                this.editLoading = false
                let {status, data} = res
                if (status === 'success') {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                  this.editUserFormVisible = false
                  this.getUserDetail(this.editUserForm.userId)
                } else {
                  this.$notify({
                    title: status,
                    message: data,
                    type: 'error'
                  })
                }
              })
            })
          }
        })
      },
      getUserList () {
        let para = {userId: 26, pageNumber: this.pageIndex}
        this.listLoading = true
        requestUserList(para).then((res) => {
          let {status, data, currentPageNumber, totalNumber} = res
          console.log(status)
          this.pageIndex = currentPageNumber
          this.sourceTotal = totalNumber
          this.users = data
          this.listLoading = false
        })
      },
      getUserDetail (userId) {
        let para = {userId: userId}
        requestUserDetail(para).then((res) => {
          let {status, data} = res
          console.log(status)
          this.userDetail = data[0]
        })
      },
      getWithdrawalByUserId (userId) {
        let para = {userId: userId}
        withdrawalByUserId(para).then((res) => {
          let {status, data} = res
          console.log(status)
          this.withdrawals = data
        })
      },
      getDepositListByUserId (userId) {
        let para = {userId: userId}
        depositListByUserId(para).then((res) => {
          let {status, data} = res
          console.log(status)
          this.depositList = data
        })
      }
    },
    mounted () {
      this.getUserList()
    }
  }
</script>

<style scoped>

  .tab-user-info .el-form--inline {
    padding: 10px 20px;
  }

  .tab-user-info .el-form--inline .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 49%;
  }

  .tab-user-info .el-form--inline label {
    width: 100px;
    color: #99a9bf;
  }

</style>
