import { request } from "@umijs/max";

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
  role: "super" | "editor" | "operator";
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
  role: "super" | "editor" | "operator";
  status?: number;
}

export interface UpdateAdminParams {
  nickname?: string;
  phone?: string;
  email?: string;
  role?: "super" | "editor" | "operator";
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
  role: "admin" | "user";
  createTime: string;
}

export interface CreateUserParams {
  username: string;
  password: string;
  nickname?: string;
  phone?: string;
  email?: string;
  role?: "admin" | "user";
  status?: number;
}

export interface UpdateUserParams {
  nickname?: string;
  phone?: string;
  email?: string;
  role?: "admin" | "user";
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
  status: "pending" | "approved" | "rejected";
  createTime: string;
}

// ==================== 评论类型定义 ====================

export interface CommentItem {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  targetType: "museum" | "ugc" | "exhibition";
  targetId: string;
  targetName: string;
  status: number; // 0: 待审核, 1: 正常, 2: 已屏蔽
  likes: number;
  createTime: string;
}

export interface CommentListParams extends PageParams {
  content?: string;
  authorName?: string;
  targetType?: string;
  targetName?: string;
  status?: number;
}

export interface AuditCommentParams {
  status: number;
  reason?: string;
}

// ==================== 系统设置类型定义 ====================

export interface BasicSettings {
  siteName: string;
  siteLogo?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  icp?: string;
  copyright?: string;
}

export interface SecuritySettings {
  loginCaptcha: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  passwordMinLength: number;
  passwordRequireSpecial: boolean;
  twoFactorEnabled: boolean;
}

export interface ApiSettings {
  apiBaseUrl: string;
  apiTimeout: number;
  apiRetryCount: number;
  uploadMaxSize: number;
  allowedFileTypes: string[];
}

export interface LogItem {
  id: string;
  type: "login" | "operation" | "error" | "system";
  module: string;
  action: string;
  operator?: string;
  ip?: string;
  detail?: string;
  createTime: string;
}

export interface SystemInfo {
  version: string;
  buildTime: string;
  nodeVersion: string;
  os: string;
  cpu: string;
  memory: string;
  diskUsage: string;
  uptime: string;
}

// ==================== 统一错误处理 ====================

class ApiError extends Error {
  constructor(message: string, public code?: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

const handleApiError = (error: any): never => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || `请求失败 (${status})`;
    throw new ApiError(message, status, data);
  }
  if (error.request) {
    throw new ApiError("网络错误，请检查网络连接");
  }
  throw new ApiError(error.message || "未知错误");
};

const requestWrapper = async <T>(
  promise: Promise<T>
): Promise<ApiResult<T>> => {
  try {
    const result: any = await promise;
    // 如果后端返回的是标准格式 {success, data, message}
    if (result && typeof result === "object" && "success" in result) {
      return result as ApiResult<T>;
    }
    // 如果后端直接返回数据，包装成标准格式
    return {
      success: true,
      data: result as T,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// ==================== 认证相关 API ====================

export interface LoginParams {
  phone: string;
  password: string;
}

export interface LoginResult {
  token: string;
  userInfo: API.CurrentUser;
}

export async function login(
  params: LoginParams
): Promise<ApiResult<LoginResult>> {
  return requestWrapper(
    request("/auth/login", {
      method: "POST",
      data: params,
    })
  );
}

export async function getCurrentUser(): Promise<ApiResult<API.CurrentUser>> {
  return requestWrapper(
    request("/auth/currentUser", {
      method: "GET",
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
    request("/dashboard/stats", {
      method: "GET",
    })
  );
}

// ==================== 管理员管理 API ====================

export async function getAdminList(
  params: PageParams
): Promise<ApiResult<PageResult<AdminItem>>> {
  return requestWrapper(
    request("/admin/list", {
      method: "GET",
      params,
    })
  );
}

export async function createAdmin(
  data: CreateAdminParams
): Promise<ApiResult<AdminItem>> {
  return requestWrapper(
    request("/admin/create", {
      method: "POST",
      data,
    })
  );
}

export async function updateAdmin(
  id: string,
  data: UpdateAdminParams
): Promise<ApiResult<AdminItem>> {
  return requestWrapper(
    request(`/api/admin/update/${id}`, {
      method: "PUT",
      data,
    })
  );
}

export async function deleteAdmin(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/admin/delete/${id}`, {
      method: "DELETE",
    })
  );
}

export async function resetAdminPassword(
  id: string,
  data: ResetPasswordParams
): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/admin/reset-password/${id}`, {
      method: "POST",
      data,
    })
  );
}

// ==================== 用户管理 API ====================

export async function getUserList(
  params: PageParams
): Promise<ApiResult<PageResult<UserItem>>> {
  return requestWrapper(
    request("/user/list", {
      method: "GET",
      params,
    })
  );
}

export async function createUser(
  data: CreateUserParams
): Promise<ApiResult<UserItem>> {
  return requestWrapper(
    request("/user/create", {
      method: "POST",
      data,
    })
  );
}

export async function updateUser(
  id: string,
  data: UpdateUserParams
): Promise<ApiResult<UserItem>> {
  return requestWrapper(
    request(`/api/user/update/${id}`, {
      method: "PUT",
      data,
    })
  );
}

export async function deleteUser(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/user/delete/${id}`, {
      method: "DELETE",
    })
  );
}

// ==================== 博物馆管理 API ====================

export async function getMuseumList(
  params: PageParams
): Promise<ApiResult<PageResult<MuseumItem>>> {
  return requestWrapper(
    request("/museum/list", {
      method: "GET",
      params,
    })
  );
}

export async function createMuseum(
  data: CreateMuseumParams
): Promise<ApiResult<MuseumItem>> {
  return requestWrapper(
    request("/museum/create", {
      method: "POST",
      data,
    })
  );
}

export async function updateMuseum(
  id: string,
  data: Partial<CreateMuseumParams>
): Promise<ApiResult<MuseumItem>> {
  return requestWrapper(
    request(`/api/museum/update/${id}`, {
      method: "PUT",
      data,
    })
  );
}

export async function deleteMuseum(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/museum/delete/${id}`, {
      method: "DELETE",
    })
  );
}

// ==================== UGC管理 API ====================

export async function getUGCList(
  params: PageParams
): Promise<ApiResult<PageResult<UGCItem>>> {
  return requestWrapper(
    request("/ugc/list", {
      method: "GET",
      params,
    })
  );
}

export async function approveUGC(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/ugc/approve/${id}`, {
      method: "POST",
    })
  );
}

export async function rejectUGC(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/ugc/reject/${id}`, {
      method: "POST",
    })
  );
}

// ==================== 评论管理 API ====================

export async function getCommentList(
  params: CommentListParams
): Promise<ApiResult<PageResult<CommentItem>>> {
  return requestWrapper(
    request("/comment/list", {
      method: "GET",
      params,
    })
  );
}

export async function getCommentDetail(
  id: string
): Promise<ApiResult<CommentItem>> {
  return requestWrapper(
    request(`/comment/detail/${id}`, {
      method: "GET",
    })
  );
}

export async function auditComment(
  id: string,
  data: AuditCommentParams
): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/comment/audit/${id}`, {
      method: "POST",
      data,
    })
  );
}

export async function deleteComment(id: string): Promise<ApiResult<void>> {
  return requestWrapper(
    request(`/api/comment/delete/${id}`, {
      method: "DELETE",
    })
  );
}

export async function batchDeleteComments(
  ids: string[]
): Promise<ApiResult<void>> {
  return requestWrapper(
    request("/api/comment/batch-delete", {
      method: "POST",
      data: { ids },
    })
  );
}

export async function batchAuditComments(
  ids: string[],
  status: number
): Promise<ApiResult<void>> {
  return requestWrapper(
    request("/api/comment/batch-audit", {
      method: "POST",
      data: { ids, status },
    })
  );
}

// ==================== 系统设置 API ====================

export async function getBasicSettings(): Promise<ApiResult<BasicSettings>> {
  return requestWrapper(
    request("/settings/basic", {
      method: "GET",
    })
  );
}

export async function saveBasicSettings(
  data: BasicSettings
): Promise<ApiResult<void>> {
  return requestWrapper(
    request("/api/settings/basic", {
      method: "POST",
      data,
    })
  );
}

export async function getSecuritySettings(): Promise<
  ApiResult<SecuritySettings>
> {
  return requestWrapper(
    request("/settings/security", {
      method: "GET",
    })
  );
}

export async function saveSecuritySettings(
  data: SecuritySettings
): Promise<ApiResult<void>> {
  return requestWrapper(
    request("/api/settings/security", {
      method: "POST",
      data,
    })
  );
}

export async function getApiSettings(): Promise<ApiResult<ApiSettings>> {
  return requestWrapper(
    request("/settings/api", {
      method: "GET",
    })
  );
}

export async function saveApiSettings(
  data: ApiSettings
): Promise<ApiResult<void>> {
  return requestWrapper(
    request("/api/settings/api", {
      method: "POST",
      data,
    })
  );
}

export async function getSystemLogs(
  params: PageParams & { type?: string; module?: string }
): Promise<ApiResult<PageResult<LogItem>>> {
  return requestWrapper(
    request("/settings/logs", {
      method: "GET",
      params,
    })
  );
}

export async function getSystemInfo(): Promise<ApiResult<SystemInfo>> {
  return requestWrapper(
    request("/settings/system-info", {
      method: "GET",
    })
  );
}

export async function clearSystemCache(): Promise<ApiResult<void>> {
  return requestWrapper(
    request("/api/settings/clear-cache", {
      method: "POST",
    })
  );
}

// ==================== 用户批量操作 API ====================

export interface BatchOperationParams {
  ids: string[];
  action: "delete" | "enable" | "disable";
}

export async function batchOperateUsers(
  data: BatchOperationParams
): Promise<ApiResult<void>> {
  return requestWrapper(
    request("/api/user/batch-operate", {
      method: "POST",
      data,
    })
  );
}

export async function getUserDetail(id: string): Promise<ApiResult<UserItem>> {
  return requestWrapper(
    request(`/user/detail/${id}`, {
      method: "GET",
    })
  );
}
