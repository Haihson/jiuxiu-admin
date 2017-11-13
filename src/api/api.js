import axios from 'axios'

let base = '/apis'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
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
