#!/bin/bash

# RAGForge Web 环境变量测试脚本

echo "=== RAGForge Web 环境变量测试 ==="

# 测试不同的环境变量配置
test_configs=(
    "默认配置 (Docker Compose)"
    "本地开发环境"
    "远程 API 服务器"
    "自定义端口"
)

configs=(
    "RAGFORGE_BACKEND_API_URL=http://ragforge:9380"
    "RAGFORGE_BACKEND_API_URL=http://localhost:9380"
    "RAGFORGE_BACKEND_API_URL=https://api.ragforge.com"
    "RAGFORGE_BACKEND_API_URL=http://localhost:8080"
)

for i in "${!test_configs[@]}"; do
    echo ""
    echo "测试 ${test_configs[$i]}:"
    echo "环境变量: ${configs[$i]}"
    
    # 构建测试命令
    export ${configs[$i]}
    export NODE_ENV=production
    
    echo "当前配置:"
    echo "  RAGFORGE_BACKEND_API_URL: ${RAGFORGE_BACKEND_API_URL}"
    echo "  NODE_ENV: ${NODE_ENV}"
    
    # 测试 nginx 配置生成
    if [ -f "nginx.conf" ]; then
        echo "✅ nginx.conf 文件存在"
        
        # 检查配置中的代理设置
        if grep -q "proxy_pass.*\$backend_api" nginx.conf; then
            echo "✅ nginx 配置支持环境变量"
        else
            echo "❌ nginx 配置不支持环境变量"
        fi
    else
        echo "❌ nginx.conf 文件不存在"
    fi
    
    # 测试 Dockerfile
    if [ -f "Dockerfile" ]; then
        echo "✅ Dockerfile 存在"
        
        if grep -q "ENV RAGFORGE_BACKEND_API_URL" Dockerfile; then
            echo "✅ Dockerfile 包含环境变量配置"
        else
            echo "❌ Dockerfile 缺少环境变量配置"
        fi
        
        if grep -q "docker-entrypoint.sh" Dockerfile; then
            echo "✅ Dockerfile 包含启动脚本"
        else
            echo "❌ Dockerfile 缺少启动脚本"
        fi
    else
        echo "❌ Dockerfile 不存在"
    fi
    
    # 测试启动脚本
    if [ -f "docker-entrypoint.sh" ]; then
        echo "✅ docker-entrypoint.sh 存在"
        
        if grep -q "envsubst" docker-entrypoint.sh; then
            echo "✅ 启动脚本支持环境变量替换"
        else
            echo "❌ 启动脚本不支持环境变量替换"
        fi
    else
        echo "❌ docker-entrypoint.sh 不存在"
    fi
done

echo ""
echo "=== 测试完成 ==="
echo ""
echo "使用说明:"
echo "1. 生产环境: RAGFORGE_BACKEND_API_URL=http://ragforge:9380"
echo "2. 开发环境: RAGFORGE_BACKEND_API_URL=http://localhost:9380"
echo "3. 远程环境: RAGFORGE_BACKEND_API_URL=https://api.example.com"
echo ""
echo "启动命令示例:"
echo "docker run -e RAGFORGE_BACKEND_API_URL=http://api-server:9380 ragforge-web:latest" 