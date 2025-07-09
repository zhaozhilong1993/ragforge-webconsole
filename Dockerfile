# 多阶段构建 - 生产环境Dockerfile
FROM node:18 AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境镜像
FROM nginx:alpine

# 安装必要的工具
RUN apk add --no-cache bash curl

# 复制构建产物到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置模板
COPY nginx.conf /etc/nginx/nginx.conf.template

# 复制启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 设置环境变量默认值
ENV RAGFORGE_BACKEND_API_URL=http://ragforge:9380
ENV NODE_ENV=production

# 暴露端口
EXPOSE 80

# 使用启动脚本
ENTRYPOINT ["/docker-entrypoint.sh"] 