#!/bin/bash
# 文博通后台管理 - PM2 部署脚本

set -e

echo "🚀 开始部署 museum-admin..."
echo "================================"

# 进入项目目录
cd /root/.openclaw/workspace/team/pm-lead/projects/museum-admin

echo "📥 拉取最新代码..."
git pull origin main

echo "📦 安装依赖..."
npm install

echo "🔄 重启 PM2 服务..."
pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production

echo "💾 保存 PM2 配置..."
pm2 save

echo ""
echo "✅ 部署完成!"
echo "============"
echo "服务地址: http://localhost:12130"
pm2 status museum-admin