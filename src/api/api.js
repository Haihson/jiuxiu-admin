import axios from 'axios'

let base = '/apis'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'

// 登录
export const requestLogin = params => { return axios.post(`${base}/loginSubmit`, params).then(res => res.data) }

// 用户列表
export const requestUserList = params => { return axios.post(`${base}/userListByCondition`, params).then(res => res.data) }

// 用户详情
export const requestUserDetail = params => { return axios.post(`${base}/userInfoByUserId`, params).then(res => res.data) }

// 编辑用户信息
export const editUserInfo = params => { return axios.post(`${base}/updateUserInfoByUserId`, params).then(res => res.data) }

// 用户出款信息
export const withdrawalByUserId = params => { return axios.post(`${base}/withdrawalByUserId`, params).then(res => res.data) }

// 用户存款信息
export const depositListByUserId = params => { return axios.post(`${base}/depositListByUserId`, params).then(res => res.data) }

// 用户转账信息
export const transferListByUserId = params => { return axios.post(`${base}/transferListByUserId`, params).then(res => res.data) }

// 用户余额变动信息
export const balanceChangeByUserId = params => { return axios.post(`${base}/balanceChangeByUserId`, params).then(res => res.data) }

// 存款管理
export const depositOrders = params => { return axios.post(`${base}/depositOrdersByCondition`, params).then(res => res.data) }

// 优惠券管理
export const promotionList = params => { return axios.post(`${base}/promotionList`, params).then(res => res.data) }

// 支付通道
export const depositChannelPermissionGroupList = params => { return axios.post(`${base}/depositPermissionList`, params).then(res => res.data) }
