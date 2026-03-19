import { request } from '@umijs/max';

// ==================== 通用类型定义 ====================

export interface ApiResult<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface PageResult<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== 管理员类型定义 ====================

export interface AdminItem {
  id: string;
  username: string;
  nickname: string;
  phone?: string;
  email?: string;
  status: number;
  role: 'super' | 'editor' | 'operator';
  permissions: string[];
  createTime: string;
  updateTime?: string;
}

export interface CreateAdminParams {
  username: string;
  password: string;
  nickname: string;
  phone?: string;
  email?: string;
  role: 'super' | 'editor' | 'operator';
  status?: number;
}

export interface UpdateAdminParams {
  nickname?: string;
  phone?: string;
  email?: string;
  role?: 'super' | 'editor' | 'operator';
  status?: number;
}

export interface ResetPasswordParams {
  newPassword: string;
}

// ==================== 用户类型定义 ====================

export interface UserItem {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  phone?: string;
  email?: string;
  status: number;
  role: 'admin' | 'user';
  createTime: string;
}

export interface CreateUserParams {
  username: string;
  password: string;
  nickname?: string;
  phone?: string;
  email?: string;
  role?: 'admin' | 'user';
  status?: number;
}

export interface UpdateUserParams {
  nickname?: string;
  phone?: string;
  email?: string;
  role?: 'admin' | 'user';
  status?: number;
}

// ==================== 博物馆类型定义 ====================

export interface MuseumItem {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  images?: string[];
  status: number;
  createTime: string;
}

export interface CreateMuseumParams {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  images?: string[];
  status?: number;
}

// ==================== UGC类型定义 ====================

export interface UGCItem {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createTime: string;
}

// ==================== 统一错误处理 ====================

class ApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: any): never => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || `请求失败 (${status})`;
    throw new ApiError(message, status, data);
  }
  if (error.request) {
    throw new ApiError('网络错误，请检查网络连接');
  }
  throw new ApiError(error.message || '未知错误');
};

const requestWrapper = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    const result = await promise;
    return result;
  } catch (error) {
    return handleApiError(error);
  }
};

// ==================== 认证相关 API ====================

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: API.CurrentUser;
}

export async function login(params: LoginParams): Promise<ApiResult<LoginResult>> {
  return requestWrapper(
    request('/auth/login', {
      method: 'POST',
      data: params,
    })
  );
}

export async function getCurrentUser(): Promise<ApiResult<API.CurrentUser>> {
  return requestWrapper(
    request('/auth/currentUser', {
      method: 'GET',
    })
  );
}

// ==================== 仪表盘 API ====================

export interface DashboardStats {
  totalUsers: number;
  totalMuseums: number;
  totalUGC: number;
  pendingUGC: number;
}

export async function getDashboardStats(): Promise<ApiResult<DashboardStats>> {
  return requestWrapper(
    request('/dashboard/stats', {
      method: 'GET',
    })
  );
}

// ==================== 管理员管理 API ====================

export async function getAdminList(params: PageParams): Promise<ApiResult<PageResult<AdminItem>>> {
  return requestWrapper(
    request('/admin/list', {
      method: 'GET',
      params,
    })
  );
}

export async function createAdmin(data: CreateAdminParams): Promise<ApiResult<AdminItem>> {
  return requestWrapper(
    request('/admin/create', {
      method: 'POST',
      data,
    })
  );
}

export async function updateAdmin(id: string, data: UpdateAdminParams): Promise<ApiResult<AdminItem>> {
  return requestWrapper(
    request(`/api/admin/update/${id}`, {
      method: 'PUT',
      data,
    })
  );
}

export async function deleteAdmin(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/admin/delete/${id}`, {
      method: 'DELETE',
    })
  );
}

export async function resetAdminPassword(id: string, data: ResetPasswordParams): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/admin/reset-password/${id}`, {
      method: 'POST',
      data,
    })
  );
}

// ==================== 用户管理 API ====================

export async function getUserList(params: PageParams): Promise<ApiResult<PageResult<UserItem>>> {
  return requestWrapper(
    request('/user/list', {
      method: 'GET',
      params,
    })
  );
}

export async function createUser(data: CreateUserParams): Promise<ApiResult<UserItem>> {
  return requestWrapper(
    request('/user/create', {
      method: 'POST',
      data,
    })
  );
}

export async function updateUser(id: string, data: UpdateUserParams): Promise<ApiResult<UserItem>> {
  return requestWrapper(
    request(`/api/user/update/${id}`, {
      method: 'PUT',
      data,
    })
  );
}

export async function deleteUser(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/user/delete/${id}`, {
      method: 'DELETE',
    })
  );
}

// ==================== 博物馆管理 API ====================

export async function getMuseumList(params: PageParams): Promise<ApiResult<PageResult<MuseumItem>>> {
  return requestWrapper(
    request('/museum/list', {
      method: 'GET',
      params,
    })
  );
}

export async function createMuseum(data: CreateMuseumParams): Promise<ApiResult<MuseumItem>> {
  return requestWrapper(
    request('/museum/create', {
      method: 'POST',
      data,
    })
  );
}

export async function updateMuseum(id: string, data: Partial<CreateMuseumParams>): Promise<ApiResult<MuseumItem>> {
  return requestWrapper(
    request(`/api/museum/update/${id}`, {
      method: 'PUT',
      data,
    })
  );
}

export async function deleteMuseum(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/museum/delete/${id}`, {
      method: 'DELETE',
    })
  );
}

// ==================== UGC管理 API ====================

export async function getUGCList(params: PageParams): Promise<ApiResult<PageResult<UGCItem>>> {
  return requestWrapper(
    request('/ugc/list', {
      method: 'GET',
      params,
    })
  );
}

export async function approveUGC(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/ugc/approve/${id}`, {
      method: 'POST',
    })
  );
}

export async function rejectUGC(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/ugc/reject/${id}`, {
      method: 'POST',
    })
  );
}
