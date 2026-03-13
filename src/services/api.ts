import { request } from '@umijs/max';

// 登录
export async function login(params: { username: string; password: string }) {
  return request('/api/auth/login', {
    method: 'POST',
    data: params,
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  return request('/api/auth/currentUser', {
    method: 'GET',
  });
}

// 获取仪表盘统计数据
export async function getDashboardStats() {
  return request('/api/dashboard/stats', {
    method: 'GET',
  });
}

// 博物馆管理
export async function getMuseumList(params: any) {
  return request('/api/museum/list', {
    method: 'GET',
    params,
  });
}

export async function createMuseum(data: any) {
  return request('/api/museum/create', {
    method: 'POST',
    data,
  });
}

export async function updateMuseum(id: string, data: any) {
  return request(`/api/museum/update/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteMuseum(id: string) {
  return request(`/api/museum/delete/${id}`, {
    method: 'DELETE',
  });
}

// UGC管理
export async function getUGCList(params: any) {
  return request('/api/ugc/list', {
    method: 'GET',
    params,
  });
}

export async function approveUGC(id: string) {
  return request(`/api/ugc/approve/${id}`, {
    method: 'POST',
  });
}

export async function rejectUGC(id: string) {
  return request(`/api/ugc/reject/${id}`, {
    method: 'POST',
  });
}

// 用户管理
export async function getUserList(params: any) {
  return request('/api/user/list', {
    method: 'GET',
    params,
  });
}

export async function createUser(data: any) {
  return request('/api/user/create', {
    method: 'POST',
    data,
  });
}

export async function updateUser(id: string, data: any) {
  return request(`/api/user/update/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteUser(id: string) {
  return request(`/api/user/delete/${id}`, {
    method: 'DELETE',
  });
}
