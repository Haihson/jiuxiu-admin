<template>
  <section>
    <div class="userlist-part" v-loading="listLoading">
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.queryStr" placeholder="姓名、订单号、流水号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.depositType" placeholder="存款通道">
              <el-option
                v-for="item in options"
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.depositStatus" placeholder="状态">
              <el-option
                v-for="item in depositStatusOptions"
                :key="item.type"
                :label="item.label"
                :value="item.type">
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
            <el-button type="primary" @click="getDepositOrders">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="depositList" highlight-current-row style="width: 100%;">
        <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
        <el-table-column prop="serialNumber" label="流水号" align="center"></el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="120"></el-table-column>
        <el-table-column prop="depositChannelType" label="存款通道" align="center" :formatter="formatChannelType"></el-table-column>
        <el-table-column prop="requestDepositAmount" label="金额" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatTime"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" :formatter="formatDepositStatus"></el-table-column>
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

  </section>
</template>

<script>
  import { depositOrders } from '@/api/api'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
    components: {ElForm},
    name: 'depositList',
    data () {
      return {
        filters: {
          queryStr: '',
          depositType: '',
          depositStatus: '',
          dateRange: ''
        },
        options: [{
          type: '',
          label: '全部'
        }, {
          type: '1',
          label: '在线'
        }, {
          type: '2',
          label: '离线'
        }],
        depositStatusOptions: [{
          type: '',
          label: '全部'
        }, {
          type: '1',
          label: 'pending'
        }, {
          type: '2',
          label: 'pendingHold'
        }, {
          type: '3',
          label: 'review'
        }, {
          type: '4',
          label: '成功'
        }, {
          type: '5',
          label: '异常'
        }],
        currtLoginUser: {},
        depositList: [],
        listLoading: false,
        sourceTotal: 100,
        pageIndex: 1,
        pageSize: 10
      }
    },
    methods: {
      formatChannelType: function (row, column, cellValue) {
        if (cellValue === 1) {
          return '在线存款'
        } else if (cellValue === 2) {
          return '离线存款'
        }
      },
      formatDepositStatus: function (row, column, cellValue) {
        return this.depositStatusOptions[cellValue].label
      },
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
      handleSizeChange: function (size) {
        this.pageSize = size
        this.pageIndex = 1
      },
      handleIndexChange: function (index) {
        this.pageIndex = index
        this.getDepositOrders()
      },
      getDepositOrders () {
        // 获取存款列表数据
        let startDate = ''
        let endDate = ''
        if (this.filters.dateRange !== '' && this.filters.dateRange.length === 2) {
          startDate = this.filters.dateRange[0]
          endDate = this.filters.dateRange[1]
        }
        let para = {
          userId: this.currtLoginUser.userId,
          pageNumber: this.pageIndex,
          queryStr: this.filters.queryStr,
          depositChannelType: this.filters.depositType,
          status: this.filters.depositStatus,
          startTime: startDate,
          endTime: endDate,
          remainder: this.currtLoginUser.remainder
        }
        this.listLoading = true
        depositOrders(para).then((res) => {
          let {status, data, currentPageNumber, totalNumber} = res
          console.log(status)
          this.pageIndex = currentPageNumber
          this.sourceTotal = totalNumber
          this.depositList = data
          this.listLoading = false
        })
      }
    },
    mounted () {
      let user = JSON.parse(window.sessionStorage.getItem('user'))
      this.currtLoginUser = user
      this.getDepositOrders()
    }
  }
</script>

<style scoped>

</style>
