<template>
  <section>
    <div v-loading="listLoading">
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="couponList" highlight-current-row style="width: 100%;">
        <el-table-column prop="activityId" label="序号" width="50"></el-table-column>
        <el-table-column prop="activityName" label="名称" width="120"></el-table-column>
        <el-table-column prop="content" label="详情" width="80"></el-table-column>
        <el-table-column prop="applyCondition" label="使用限制" width="130"></el-table-column>
        <el-table-column prop="introduction" label="介绍" width="140"></el-table-column>
        <el-table-column prop="activityType" label="类型"></el-table-column>
        <el-table-column prop="actStartTime" label="开始时间"></el-table-column>
        <el-table-column prop="actEndTime" label="结束时间"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button type="info" @click="editConponInfo(scope.$index, scope.row)" size="small">编辑</el-button>
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

  </section>
</template>

<script>
  import { promotionList } from '@/api/api'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
    components: {ElForm},
    name: 'couponList',
    data () {
      return {
        filters: {
          name: ''
        },
        couponList: [],
        listLoading: false,
        sourceTotal: 100,
        pageIndex: 1,
        pageSize: 10
      }
    },
    methods: {
      formatStatus: function (row, column) {
        if (row.status === 1) {
          return '开始'
        } else if (row.status === 2) {
          return '暂停'
        }
      },
      handleSizeChange: function (size) {
        this.pageSize = size
        this.pageIndex = 1
      },
      handleIndexChange: function (index) {
        this.pageIndex = index
        this.getCouponList()
      },
      getCouponList () {
        // 获取优惠券列表数据
        let para = {userId: 26, pageNumber: this.pageIndex}
        this.listLoading = true
        promotionList(para).then((res) => {
          let {status, data, currentPageNumber, totalNumber} = res
          console.log(status)
          this.pageIndex = currentPageNumber
          this.sourceTotal = totalNumber
          this.couponList = data
          this.listLoading = false
        })
      },
      editConponInfo: function (index, row) {
        console.log(index + ' - ' + row)
      }
    },
    mounted () {
      this.getCouponList()
    }
  }
</script>

<style scoped>


</style>
