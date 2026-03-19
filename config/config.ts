import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    baseURL: 'https://api.museumapp.cn',
  },
  proxy: {
    '/api': {
      target: 'https://api.museumapp.cn',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
  layout: {
    title: '文博通后台管理',
    locale: false,
  },
  routes: [
    {
      path: '/login',
      layout: false,
      component: './Login',
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      name: '数据看板',
      path: '/dashboard',
      component: './Dashboard',
      icon: 'DashboardOutlined',
    },
    {
      name: '博物馆管理',
      path: '/museum',
      icon: 'BankOutlined',
      routes: [
        {
          name: '博物馆列表',
          path: '/museum/list',
          component: './Museum/List',
        },
        {
          name: '省市管理',
          path: '/museum/city',
          component: './Museum/City',
        },
      ],
    },
    {
      name: '内容管理',
      path: '/content',
      icon: 'FileTextOutlined',
      routes: [
        {
          name: 'UGC审核',
          path: '/content/ugc',
          component: './Content/UGC',
        },
        {
          name: '评论管理',
          path: '/content/comment',
          component: './Content/Comment',
        },
      ],
    },
    {
      name: '用户管理',
      path: '/user',
      icon: 'UserOutlined',
      routes: [
        {
          name: '用户列表',
          path: '/user/list',
          component: './User/List',
        },
        {
          name: '管理员',
          path: '/user/admin',
          component: './User/Admin',
        },
      ],
    },
    {
      name: '系统设置',
      path: '/settings',
      icon: 'SettingOutlined',
      component: './Settings',
    },
  ],
  npmClient: 'npm',
});