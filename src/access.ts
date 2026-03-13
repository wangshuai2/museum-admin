export default (initialState: { currentUser?: API.CurrentUser } | undefined) => {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.role === 'admin',
    canEditor: currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor'),
    canOperator: currentUser && (currentUser.role === 'admin' || currentUser.role === 'operator'),
  };
};
