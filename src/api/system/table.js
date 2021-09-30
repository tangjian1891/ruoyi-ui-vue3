import request from '@/utils/request'

// 查询表功能列表
export function listTable(query) {
  return request({
    url: '/system/table/list',
    method: 'get',
    params: query
  })
}

// 查询表功能详细
export function getTable(id) {
  return request({
    url: '/system/table/' + id,
    method: 'get'
  })
}

// 新增表功能
export function addTable(data) {
  return request({
    url: '/system/table',
    method: 'post',
    data: data
  })
}

// 修改表功能
export function updateTable(data) {
  return request({
    url: '/system/table',
    method: 'put',
    data: data
  })
}

// 删除表功能
export function delTable(id) {
  return request({
    url: '/system/table/' + id,
    method: 'delete'
  })
}
