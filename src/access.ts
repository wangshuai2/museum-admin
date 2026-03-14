export default (initialState: { currentUser?: API.CurrentUser } | undefined) => {
  const { currentUser } = initialState ?? {};

  // 定义权限控制
  const canAdmin = currentUser && currentUser.role === 'admin';
  const canEditor = currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  const canOperator = currentUser && (currentUser.role === 'admin' || currentUser.role === 'operator');
  const canView = !!currentUser; // 任何登录用户都可以查看

  return {
    canAdmin,
    canEditor,
    canOperator,
    canView,
    // 路由级别的权限控制
    canAccessMuseum: canAdmin || canEditor || canOperator,
    canAccessContent: canAdmin || canEditor,
    canAccessUser: canAdmin,
    canAccessSettings: canAdmin,
  };
};
