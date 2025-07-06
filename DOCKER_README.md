# Docker 部署指南

本项目提供了完整的Docker化部署方案，支持开发和生产环境。

## 文件说明

- `Dockerfile` - 生产环境多阶段构建
- `Dockerfile.dev` - 开发环境构建
- `docker-compose.yml` - 容器编排配置
- `nginx.conf` - Nginx配置文件
- `.dockerignore` - Docker构建忽略文件

## 快速开始

### 生产环境部署

1. **构建并启动生产环境**：
```bash
docker-compose up -d
```

2. **访问应用**：
打开浏览器访问 `http://localhost:3000`

### 开发环境部署

1. **启动开发环境**：
```bash
docker-compose --profile dev up -d
```

2. **访问开发服务器**：
打开浏览器访问 `http://localhost:9222`

## 手动构建

### 生产环境

```bash
# 构建镜像
docker build -t ragflow-web:latest .

# 运行容器
docker run -d -p 3000:3000 --name ragflow-web ragflow-web:latest
```

### 开发环境

```bash
# 构建开发镜像
docker build -f Dockerfile.dev -t ragflow-web:dev .

# 运行开发容器
docker run -d -p 9222:9222 -v $(pwd):/app --name ragflow-web-dev ragflow-web:dev
```

## 环境变量

可以通过环境变量配置应用：

```bash
# 设置环境变量
export NODE_ENV=production
export API_BASE_URL=http://your-api-server.com

# 使用docker-compose启动
docker-compose up -d
```

## 健康检查

应用提供了健康检查端点：

```bash
# 检查应用状态
curl http://localhost:3000/health
```

## 日志查看

```bash
# 查看容器日志
docker-compose logs -f web

# 查看nginx日志
docker exec ragflow-web tail -f /var/log/nginx/access.log
```

## 故障排除

### 常见问题

1. **端口冲突**：
   - 确保3000端口未被占用
   - 或修改docker-compose.yml中的端口映射

2. **构建失败**：
   - 检查Node.js版本（需要18+）
   - 清理Docker缓存：`docker system prune -a`

3. **API连接问题**：
   - 检查nginx.conf中的API代理配置
   - 确保后端服务可访问

### 调试命令

```bash
# 进入容器
docker exec -it ragflow-web sh

# 查看nginx配置
docker exec ragflow-web nginx -t

# 重启nginx
docker exec ragflow-web nginx -s reload
```

## 性能优化

1. **多阶段构建**：减少最终镜像大小
2. **Gzip压缩**：减少传输大小
3. **静态资源缓存**：提高加载速度
4. **安全头**：增强安全性

## 安全考虑

- 使用非root用户运行
- 添加安全响应头
- 限制文件访问权限
- 定期更新基础镜像 