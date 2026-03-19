module.exports = {
  apps: [{
    name: 'museum-admin',
    script: 'npm',
    args: 'run dev',
    cwd: '/root/.openclaw/workspace/team/pm-lead/projects/museum-admin',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 12130,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 12130,
    },
    // 日志配置
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // 自动重启
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    // 内存限制
    max_memory_restart: '1G',
    // 监听端口
    listen_timeout: 10000,
    kill_timeout: 5000,
  }],
};