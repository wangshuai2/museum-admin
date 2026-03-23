import type { RequestConfig } from "@umijs/max";
import { history } from "@umijs/max";

// 运行时配置
export const request: RequestConfig = {
  timeout: 10000,
  baseURL: "https://api.museumapp.cn",
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [
    (config: any) => {
      // 从 localStorage 获取 token
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      return response;
    },
    (error: any) => {
      if (error.response?.status === 401) {
        // 未授权，跳转到登录页
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        history.push("/login");
      }
      return Promise.reject(error);
    },
  ],
};

// 获取初始状态
export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: any;
}> {
  // 如果不是登录页，尝试获取用户信息
  if (history.location.pathname !== "/login") {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/login");
      return {};
    }

    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        return {
          currentUser: JSON.parse(userInfo),
          settings: {},
        };
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      history.push("/login");
    }
  }

  return {};
}

// 布局配置
export const layout = () => {
  return {
    logo: "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
    menu: {
      locale: false,
    },
    // 禁用移动端布局，使用桌面端布局
    layout: "mix",
    // 固定头部
    fixedHeader: true,
    // 固定侧边栏
    fixSiderbar: true,
    // 不限制内容宽度
    contentWidth: "Fluid",
    // 响应式断点
    breakpoint: false,
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      history.push("/login");
    },
  };
};
