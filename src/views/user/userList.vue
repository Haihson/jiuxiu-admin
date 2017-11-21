<template>
  <section>
    <div class="userlist-part" v-loading="listLoading">
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名、手机号、邮件"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUserList">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row style="width: 100%;">
        <el-table-column prop="userName" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="130" align="center"></el-table-column>
        <el-table-column prop="userLevel" label="用户等级" align="center"></el-table-column>
        <el-table-column prop="createTime" label="开始时间" align="center" width="150"
                         :formatter="formatTime"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" width="150"
                         :formatter="formatTime"></el-table-column>
        <el-table-column prop="userBalance" label="Balance" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" :formatter="formatUserStatus"></el-table-column>
        <el-table-column label="操作" align="center" width="90">
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
    </div>

    <!-- Tab页卡 -->
    <el-dialog :title="currtUser" :visible="userTabVisible" width="100%" :close-on-click-modal="false"
               @close="userTabVisible=false" top="5vh" :fullscreen="true" custom-class="dialog-body-padding">
      <el-tabs v-model="userTabName" type="card" @tab-click="tabHandleClick">
        <el-tab-pane label="账户信息" name="1" class="tab-user-info" v-loading="tabLoading">
          <el-button type="primary" @click="editUserInfo" style="float: right">编辑</el-button>
          <form class="el-form el-form--label-left el-form--inline">
            <div class="el-form-item"><label class="el-form-item__label">姓名</label>
              <div class="el-form-item__content"><span>{{userDetail.userName}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">性别</label>
              <div class="el-form-item__content"><span>{{ formatSex(userDetail.sex) }}</span></div>
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
              <div class="el-form-item__content"><span>{{ formatPhoneStatus(userDetail.phoneStatus) }}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">创建时间</label>
              <div class="el-form-item__content"><span>{{ formatTime('row', 'col', userDetail.createTimeStr) }}</span>
              </div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">最后更新时间</label>
              <div class="el-form-item__content"><span>{{ formatTime('row', 'col', userDetail.updateTimeStr) }}</span>
              </div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">别名</label>
              <div class="el-form-item__content"><span>{{userDetail.aliasName}}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">银行卡状态</label>
              <div class="el-form-item__content"><span>{{ formatPhoneStatus(userDetail.bankStatus) }}</span></div>
            </div>
            <div class="el-form-item"><label class="el-form-item__label">E-mail状态</label>
              <div class="el-form-item__content"><span>{{ formatPhoneStatus(userDetail.emailStatus) }}</span></div>
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
              <div class="el-form-item__content"><span>{{ formatUserStatus('row', 'col', userDetail.status) }}</span>
              </div>
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
        <el-tab-pane label="出款信息" name="2" v-loading="tabLoading">
          <el-table :data="withdrawals" highlight-current-row style="width: 100%;">
            <el-table-column prop="withdrawalNo" label="交易单号" align="center"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" width="120"></el-table-column>
            <el-table-column prop="bankName" label="银行" align="center"></el-table-column>
            <el-table-column prop="bankNo" label="卡号" align="center" width="200"></el-table-column>
            <el-table-column prop="requestWithdrawalAmount" label="金额" align="center"></el-table-column>
            <el-table-column prop="createTime" label="时间" align="center" :formatter="formatTime"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" :formatter="formatKuanStatus"></el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-col :span="24" class="toolbar" style="text-align: center; padding-top: 10px;">
            <el-pagination
              @size-change="withdrawalHandleSizeChange"
              @current-change="withdrawalHandleIndexChange"
              :page-size="withdrawalPageSize"
              :page-sizes="[10]"
              :current-page="withdrawalPageIndex"
              layout="total, sizes, prev, pager, next, jumper"
              :total="withdrawalSourceTotal">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="存款信息" name="3" v-loading="tabLoading">
          <el-table :data="depositList" highlight-current-row style="width: 100%;">
            <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="serialNumber" label="流水号" align="center"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" width="120"></el-table-column>
            <el-table-column prop="depositChannelType" label="存款通道" align="center"
                             :formatter="formatChannelType"></el-table-column>
            <el-table-column prop="requestDepositAmount" label="金额" align="center"></el-table-column>
            <el-table-column prop="createtime" label="创建时间" align="center" :formatter="formatTime"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" :formatter="formatKuanStatus"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="转账信息" name="4" v-loading="tabLoading">
          <el-table :data="transferList" highlight-current-row style="width: 100%;">
            <el-table-column prop="transferNo" label="流水号" align="center"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center" width="120"></el-table-column>
            <el-table-column prop="fromGame" label="fromGame" align="center"></el-table-column>
            <el-table-column prop="toGame" label="toGame" align="center"></el-table-column>
            <el-table-column prop="transferAmount" label="金额" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatTime"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" :formatter="formatTransferStatus"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="余额日志信息" name="5" v-loading="tabLoading">
          <el-table :data="balanceChange" highlight-current-row style="width: 100%;">
            <el-table-column prop="orderNo" label="流水号" align="center"></el-table-column>
            <el-table-column prop="adminName" label="姓名" align="center" width="120"></el-table-column>
            <el-table-column prop="operator" label="操作明细" align="center"></el-table-column>
            <el-table-column prop="beforeBalance" label="上次余额" align="center"></el-table-column>
            <el-table-column prop="afterBalance" label="当前余额" align="center"></el-table-column>
            <el-table-column prop="requestAmount" label="操作金额" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" align="center" :formatter="formatBalanceChange"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatTime"></el-table-column>
          </el-table>
        </el-tab-pane>
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
  import {
    requestUserList, requestUserDetail,
    editUserInfo, withdrawalByUserId,
    depositListByUserId, transferListByUserId,
    balanceChangeByUserId
  } from '@/api/api'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'

  export default {
    components: {
      ElFormItem,
      ElForm
    },
    name: 'userList',
    data () {
      return {
        filters: {
          name: '',
          status: '',
          dateRange: ''
        },
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '未激活'
        }, {
          value: '1',
          label: '激活'
        }, {
          value: '2',
          label: '暂停'
        }, {
          value: '3',
          label: '危险账号'
        }],
        users: [],
        userDetail: {},
        currtUser: '',
        listLoading: false,
        tabLoading: false,
        sourceTotal: 100,
        pageIndex: 1,
        pageSize: 10,
        withdrawalSourceTotal: 100,
        withdrawalPageIndex: 1,
        withdrawalPageSize: 10,
        userTabName: '1',
        userTabVisible: false,
        editUserFormVisible: false,
        editLoading: false,
        editUserForm: {
          userId: '',
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
        depositList: [],
        transferList: [],
        balanceChange: []
      }
    },
    methods: {
      formatTime: function (row, column, cellValue) {
        let date = new Date(cellValue)
        let YYYY = date.getFullYear() + '-'
        let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let dd = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
        let HH = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
        let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
        let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return YYYY + MM + dd + HH + mm + ss
      },
      formatUserStatus: function (row, column, cellValue) {
        if (cellValue === 1) {
          return '未激活'
        } else if (cellValue === 2) {
          return '激活'
        } else if (cellValue === 3) {
          return '暂停'
        } else if (cellValue === 4) {
          return '危险账号'
        }
      },
      formatSex: function (sex) {
        if (sex === 1) {
          return '男'
        } else if (sex === 2) {
          return '女'
        } else {
          return '其他'
        }
      },
      formatPhoneStatus: function (status) {
        if (status === 1) {
          return '未激活'
        } else if (status === 2) {
          return '激活'
        } else {
          return ''
        }
      },
      formatChannelType: function (row, column, cellValue) {
        if (cellValue === 0) {
          return '在线存款'
        } else if (cellValue === 1) {
          return '离线存款'
        }
      },
      formatBalanceChange: function (row, column, cellValue) {
        if (cellValue === 1) {
          return '存款'
        } else if (cellValue === 2) {
          return '取款'
        } else if (cellValue === 3) {
          return '转入游戏'
        } else if (cellValue === 4) {
          return '转出游戏'
        }
      },
      formatKuanStatus: function (row, column, cellValue) {
        if (cellValue === 1) {
          return 'pending'
        } else if (cellValue === 2) {
          return 'pendinghold'
        } else if (cellValue === 3) {
          return 'review'
        } else if (cellValue === 4) {
          return '成功'
        } else if (cellValue === 5) {
          return '异常'
        }
      },
      formatTransferStatus: function (row, column, cellValue) {
        if (cellValue === 1) {
          return '失败'
        } else if (cellValue === 2) {
          return '成功'
        } else if (cellValue === 3) {
          return '未处理'
        }
      },
      userDetailClick (index, row) {
        // 用户详情点击
        this.currtUser = row.userName
        this.userTabVisible = true
        if (this.userTabName === '1') {
          this.getUserDetail(row.userId)
        } else if (this.userTabName === '2') {
          this.getWithdrawal(row.userId)
        } else if (this.userTabName === '3') {
          this.getDepositList(row.userId)
        } else if (this.userTabName === '4') {
          this.getTransferList(row.userId)
        } else if (this.userTabName === '5') {
          this.getBalanceChange(row.userId)
        }
        console.log(index + ' - ' + row)
      },
      handleSizeChange: function (size) {
        this.pageSize = size
        this.pageIndex = 1
      },
      handleIndexChange: function (index) {
        this.pageIndex = index
        this.getUserList()
      },
      withdrawalHandleSizeChange: function (size) {
        this.withdrawalPageSize = size
        this.withdrawalPageIndex = 1
      },
      withdrawalHandleIndexChange: function (index) {
        this.withdrawalPageIndex = index
        this.getWithdrawal(this.userDetail.userId)
      },
      tabHandleClick (tab, event) {
        // Tab页卡点击
        console.log(tab.label)
        if (tab.label === '账户信息') {
          this.getUserDetail(this.userDetail.userId)
        } else if (tab.label === '出款信息') {
          this.getWithdrawal(this.userDetail.userId)
        } else if (tab.label === '存款信息') {
          this.getDepositList(this.userDetail.userId)
        } else if (tab.label === '转账信息') {
          this.getTransferList(this.userDetail.userId)
        } else if (tab.label === '余额日志信息') {
          this.getBalanceChange(this.userDetail.userId)
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
              let para = {
                userId: this.editUserForm.userId,
                address: this.editUserForm.address,
                phone: this.editUserForm.phone,
                email: this.editUserForm.email,
                phoneStatus: this.editUserForm.phoneStatus,
                emailStatus: this.editUserForm.emailStatus,
                userLevel: this.editUserForm.userLevel,
                depositGroupId: this.editUserForm.depositGroupId,
                status: this.editUserForm.status
              }
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
        // 获取用户列表数据
        let startDate = ''
        let endDate = ''
        if (this.filters.dateRange !== '' && this.filters.dateRange.length === 2) {
          startDate = this.filters.dateRange[0]
          endDate = this.filters.dateRange[1]
        }
        let para = {
          userId: 26,
          pageNumber: this.pageIndex,
          userName: this.filters.name,
          status: this.filters.status,
          startTime: startDate,
          endTime: endDate
        }
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
        // 获取用户详情数据
        let para = {userId: userId}
        this.tabLoading = true
        requestUserDetail(para).then((res) => {
          let {status, data} = res
          console.log(status)
          this.userDetail = data[0]
          this.tabLoading = false
        })
      },
      getWithdrawal (userId) {
        // 获取用户提款数据
        let para = {userId: userId}
        this.tabLoading = true
        withdrawalByUserId(para).then((res) => {
          let {status, data} = res
          console.log(status)
          this.withdrawals = data
          this.tabLoading = false
        })
      },
      getDepositList (userId) {
        // 获取用户存款数据
        let para = {userId: userId}
        this.tabLoading = true
        depositListByUserId(para).then((res) => {
          let {status, data} = res
          console.log(status)
          this.depositList = data
          this.tabLoading = false
        })
      },
      getTransferList (userId) {
        // 获取用户转账数据
        let para = {userId: userId, pageNumber: 1}
        this.tabLoading = true
        transferListByUserId(para).then((res) => {
          let {status, data, currentPageNumber, totalNumber} = res
          console.log(status + ' ' + currentPageNumber + ' ' + totalNumber)
          this.transferList = data
          this.tabLoading = false
        })
      },
      getBalanceChange (userId) {
        // 获取用户转账数据
        let para = {userId: userId, pageNumber: 1}
        this.tabLoading = true
        balanceChangeByUserId(para).then((res) => {
          let {status, data, currentPageNumber, totalNumber} = res
          console.log(status + ' ' + currentPageNumber + ' ' + totalNumber)
          this.balanceChange = data
          this.tabLoading = false
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
