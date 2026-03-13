declare namespace API {
  interface CurrentUser {
    id: string;
    username: string;
    nickname: string;
    avatar?: string;
    email?: string;
    phone?: string;
    role: string;
    permissions: string[];
  }

  interface LoginResult {
    success: boolean;
    message?: string;
    data: {
      token: string;
      userInfo: CurrentUser;
    };
  }

  interface Result<T = any> {
    success: boolean;
    message?: string;
    data: T;
  }

  interface PageResult<T = any> {
    success: boolean;
    message?: string;
    data: {
      list: T[];
      total: number;
      page: number;
      pageSize: number;
    };
  }
}
