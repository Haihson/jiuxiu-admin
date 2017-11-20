<template>
  <section>
    <div class="userlist-part" v-loading="listLoading">
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.orderNo" placeholder="订单号"></el-input>
          </el-form-item>
          <el-form-item>
          <el-input v-model="filters.serialNumber" placeholder="流水号"></el-input>
        </el-form-item>
          <el-form-item>
            <el-input v-model="filters.userName" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.depositType" placeholder="请选择">
              <el-option
                v-for="item in options"
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
        <el-table-column prop="userId" label="序号" width="50"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="200"></el-table-column>
        <el-table-column prop="serialNumber" label="流水号" width="180"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="depositType" label="通道" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="offlineBankName" label="银行"></el-table-column>
        <el-table-column prop="bankCode" label="简称"></el-table-column>
        <el-table-column prop="offlinearea" label="地区"></el-table-column>
        <el-table-column prop="offlineProvince" label="省"></el-table-column>
        <el-table-column prop="offlineAccountname" label="账户名"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="requestDepositAmount" label="金额"></el-table-column>
        <el-table-column prop="actualAmount" label="实际金额"></el-table-column>
        <el-table-column prop="bankFee" label="bankFee"></el-table-column>
        <el-table-column prop="accountName" label="accountName"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
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
          userName: '',
          orderNo: '',
          serialNumber: '',
          depositType: '',
          dateRange: ''
        },
        options: [{
          type: '',
          label: '全部'
        }, {
          type: '0',
          label: '在线'
        }, {
          type: '1',
          label: '离线'
        }],
        depositList: [],
        listLoading: false,
        sourceTotal: 100,
        pageIndex: 1,
        pageSize: 10
      }
    },
    methods: {
      formatStatus: function (row, column) {
        if (row.status === 0) {
          return '在线'
        } else if (row.status === 2) {
          return '离线'
        }
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
          userId: 26,
          pageNumber: this.pageIndex,
          userName: this.filters.userName,
          orderNo: this.filters.orderNo,
          serialNumber: this.filters.serialNumber,
          depositChannelType: this.filters.depositType,
          startTime: startDate,
          endTime: endDate
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
      this.getDepositOrders()
    }
  }
</script>

<style scoped>


</style>
