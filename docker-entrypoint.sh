#!/bin/bash

# RAGForge Web 控制台启动脚本

set -e

# 设置默认值
export RAGFORGE_BACKEND_API_URL=${RAGFORGE_BACKEND_API_URL:-http://ragforge:9380}

echo "=== RAGForge Web 控制台启动 ==="
echo "环境变量:"
echo "  RAGFORGE_BACKEND_API_URL: ${RAGFORGE_BACKEND_API_URL}"
echo "  NODE_ENV: ${NODE_ENV:-production}"

# 处理nginx配置
echo "处理 nginx 配置..."

# 使用sed替换环境变量
sed "s|__RAGFORGE_BACKEND_API_URL__|${RAGFORGE_BACKEND_API_URL}|g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "nginx 配置已更新"
echo "后端API地址: ${RAGFORGE_BACKEND_API_URL}"

# 检查nginx配置
echo "检查 nginx 配置..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx 配置检查通过"
else
    echo "❌ nginx 配置检查失败"
    exit 1
fi

# 启动nginx
echo "启动 nginx..."
exec nginx -g "daemon off;" 