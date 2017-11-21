<template>
  <section>
    <div v-loading="listLoading">
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.activityName" placeholder="活动名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.activityType" placeholder="优惠类别">
              <el-option
                v-for="item in activityTypeOptions"
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getCouponList">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="couponList" highlight-current-row style="width: 100%;">
        <el-table-column prop="activityName" label="名称" width="120" align="center"></el-table-column>
        <el-table-column prop="content" label="详情" width="80" align="center"></el-table-column>
        <el-table-column prop="applyCondition" label="使用限制" width="130" align="center"></el-table-column>
        <el-table-column prop="introduction" label="介绍" width="140" align="center"></el-table-column>
        <el-table-column prop="activityType" label="类型" align="center"
                         :formatter="formatActivityType"></el-table-column>
        <el-table-column prop="actStartTime" label="开始时间" align="center" width="150"></el-table-column>
        <el-table-column prop="actEndTime" label="结束时间" align="center" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作" width="90" align="center">
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

    <!--修改用户界面-->
    <el-dialog title="编辑优惠" :visible="editCouponFormVisible" :close-on-click-modal="false"
               @close="editCouponFormVisible=false" top="5vh">
      <el-form :model="editCouponForm" label-width="100px" :rules="editCouponFormRules" ref="editUserForm">
        <el-form-item label="名称" prop="activityName">
          <el-input v-model="editCouponForm.activityName"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="editCouponForm.content"></el-input>
        </el-form-item>
        <el-form-item label="使用条件" prop="applyCondition">
          <el-input v-model="editCouponForm.applyCondition"></el-input>
        </el-form-item>
        <el-form-item label="规则详情" prop="ruleDetails">
          <el-input v-model="editCouponForm.ruleDetails"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduction">
          <el-input v-model="editCouponForm.introduction"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editCouponForm.status">
            <el-radio class="radio" :label="1">未激活</el-radio>
            <el-radio class="radio" :label="2">激活</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editCouponFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editCouponSubmit">保存</el-button>
      </div>
    </el-dialog>

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
          activityName: '',
          activityType: ''
        },
        activityTypeOptions: [{
          type: '',
          label: '全部'
        }, {
          type: '1',
          label: '存款优惠'
        }, {
          type: '2',
          label: '反水优惠'
        }],
        couponList: [],
        listLoading: false,
        sourceTotal: 100,
        pageIndex: 1,
        pageSize: 10,
        editCouponFormVisible: false,
        editCouponForm: {
          activityName: '',
          ruleDetails: '',
          status: '',
          img: '',
          content: '',
          applyCondition: '',
          introduction: '',
          startTime: '',
          endTime: ''
        },
        editCouponFormRules: {
          activityName: [
            {required: true, message: '请输入优惠名称', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      formatActivityType: function (row, column, cellValue) {
        if (cellValue === 1) {
          return '存款优惠'
        } else if (cellValue === 2) {
          return '反水优惠'
        }
      },
      formatStatus: function (row, column, cellValue) {
        if (cellValue === 1) {
          return '未激活'
        } else if (cellValue === 2) {
          return '激活'
        }
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
        this.getCouponList()
      },
      getCouponList () {
        // 获取优惠券列表数据
        let para = {
          userId: this.currtLoginUser.userId,
          pageNumber: this.pageIndex,
          activityName: this.filters.activityName,
          activityType: this.filters.activityType
        }
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
        this.editCouponFormVisible = true
      },
      editCouponSubmit: function () {
        console.log('修改优惠')
      }
    },
    mounted () {
      this.getCouponList()
    }
  }
</script>

<style scoped>


</style>
