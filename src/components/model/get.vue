<template>
  <el-tabs type="card" @tab-click="tabSwitch">
    <el-tab-pane label="数据">
      <el-container>
        <el-card class="box-card">
          <!--卡片头部-->
          <div slot="header" class="clearfix">
            <el-row :gutter="20">
              <el-col :span="6">
                <span>卡片名称</span>
              </el-col>
              <!--搜索部分-->
              <el-col :span="12">
                <search></search>
              </el-col>
              <el-col :span="6">
                <div style="text-align: right">
                  <el-button @click="refresh" icon="el-icon-refresh" size="mini" type="primary">刷新</el-button>
                  <el-button @click="addModal" icon="el-icon-plus" size="mini" type="primary">新添</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <!--卡片内容-->
          <!--表格数据-->
          <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%">
            <el-table-column
              fixed
              prop="id"
              label="ID"
              width="50"
              fixed="left"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="Ename"
              align="center">
            </el-table-column>
            <el-table-column
              prop="chinese"
              label="中文名"
              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="更新时间"
              align="center">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="relation(scope.row)" type="primary">关联</el-button>
                <el-button size="mini" @click="putModal(scope.row)" type="primary" icon="el-icon-edit"></el-button>
                <el-button @click="delModal(scope.row)" size="mini" icon="el-icon-delete" type="danger"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div class="page">
            <el-pagination
              v-if="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[20, 30, 50, 100]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total">
            </el-pagination>
          </div>
        </el-card>
      </el-container>
    </el-tab-pane>
    <!--回收站-->
    <el-tab-pane label="回收站">
      <recycle></recycle>
    </el-tab-pane>
    <!--弹框-->
    <el-dialog
      :title="componentTitle"
      :visible.sync="modal"
      width="50%"
      :before-close="modalClose"
      center>
      <!--动态组件-->
      <component v-bind:is="componentName"></component>
    </el-dialog>
  </el-tabs>
</template>

<script>
  import recycle from './recycle' // 回收站
  import add from './add' // 新添
  import put from './put' // 修改
  import remove from './del' // 删除
  import search from './search' // 搜索
  export default {
    name: 'get',
    data () {
      return {
        ID: null, // 数据父级ID
        dialogVisible: false, // 弹框
        componentName: 'add', // 动态组件名字
        componentTitle: '', // 动态组件标题
        page: {
          currentPage: 1, // 当前页码
          pageSize: 20, // 当前页显示条数
          total: 0 // 数据总数
        },
        tableData: [] // 数据
      }
    },
    components: {
      recycle, // 回收站组件
      add, // 新添组件
      put, // 修改组件
      remove, // 删除组件
      search // 搜索组件
    },
    computed: {
      // 数据父级id
      getID: function () {
        let ID = this.$route.query.ID
        if (!ID) {
          ID = null
        }
        return ID
      },
      // 弹框
      modal: function () {
        return this.$store.state.modal
      },
      // 分页组件
      pagination: function () {
        return this.$store.state.pagination
      },
      // 表格数据
      getData: function () {
        return this.$store.state.getData
      }
    },
    watch: {
      // 监听表格数据与搜索数据
      getData: function (n, o) {
        this.tableData = n
      },
      getID: function (n, o) {
        this.ID = n
      }
    },
    mounted () {
      this.ID = this.getID // 获取父级ID
      this.get(this.page.currentPage - 1, this.page.pageSize)
    },
    methods: {
      // 获取数据
      get (n, l) {
        let condition = {
          n: n,
          l: l,
          deleted: 0
        }
        if (this.ID !== null) {
          condition.parent_id = this.ID
        }
        this.$http.post('/api/device/struct/get', condition).then((response) => {
          if (response.status === 200) {
            this.page.total = response.data.t // 数据总数
            this.$store.commit('getData', response.data.d) // 保存数据到vuex
            this.$store.commit('pagination', true) // 显示分页组件
          }
        })
      },
      // 刷新
      refresh () {
        this.get((this.page.currentPage - 1) * this.page.pageSize, this.page.pageSize)
        this.$store.commit('pagination', true)
      },
      // 关联
      relation (row) {
        this.$router.push({name: '', path: '', query: {ID: row.id}})
      },
      /*弹框组件*/
      // 新添
      addModal () {
        this.$store.commit('modal', true)
        this.componentName = 'add'
        this.componentTitle = '新添'
      },
      // 修改
      putModal (row) {
        this.$store.commit('putData', row)
        this.$store.commit('modal', true)
        this.componentName = 'put'
        this.componentTitle = '编辑'
      },
      // 删除
      delModal (row) {
        this.$store.commit('delData', row)
        this.$store.commit('modal', true)
        this.componentName = 'remove'
        this.componentTitle = '删除'
      },
      // 关闭弹框回调
      modalClose (done) {
        this.$store.commit('modal', false) // 关闭弹框
        this.refresh() // 刷新页面
        done()
      },
      // 切换tab时调用
      tabSwitch (e) {
        if (e.label === '数据') {
          this.$store.commit('dataType', 0) // 数据：0与回收站：1
        } else {
          this.$store.commit('dataType', 1) // 数据：0与回收站：1
        }
      },
      // 改变表格每页显示条数
      handleSizeChange(val) {
        this.page.pageSize = val
        this.get(this.page.currentPage - 1, val)
      },
      // 改变当前页数
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.get((val - 1) * this.page.pageSize, this.page.pageSize)
      }
    }
  }
</script>

<style>
  @import "../../assets/css/get.css";
</style>
