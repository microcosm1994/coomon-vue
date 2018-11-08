import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
  state: {
    User: {}, // 用户信息
    getData: {}, // 搜索数据
    putData: {}, // 修改数据
    delData: {}, // 删除数据
    recycleData: {}, // 回收站数据
    modal: false, // 弹框
    recycleModal: false, // 回收站弹框
    pagination: true, // 分页
    recyclePagination: true, // 回收站分页
    dataType: 0 // 数据：0与回收站：1
  },
  mutations: {
    /* 用户 */
    User (state, obj) {
      state.User = obj
    },
    /* 表格数据 */
    getData (state, obj) {
      state.getData = obj
    },
    /* 修改数据 */
    putData (state, obj) {
      state.putData = obj
    },
    /* 删除数据 */
    delData (state, obj) {
      state.delData = obj
    },
    /* 回收站数据 */
    recycleData (state, obj) {
      state.recycleData = obj
    },
    /* 弹框 */
    modal (state, boolean) {
      state.modal = boolean
    },
    /* 回收站弹框 */
    recycleModal (state, boolean) {
      state.recycleModal = boolean
    },
    /* 分页 */
    pagination (state, boolean) {
      state.pagination = boolean
    },
    /* 回收站分页 */
    recyclePagination (state, boolean) {
      state.recyclePagination = boolean
    },
    /* 数据：0与回收站：1 */
    dataType (state, number) {
      state.dataType = number - 0
    }
  }
})
