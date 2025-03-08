# 第一阶段：依赖安装与构建
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安装所有依赖项（包括开发依赖）
RUN npm ci

# 复制应用源代码并进行构建
COPY . .
RUN npm run build

# 第二阶段：生产环境
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

# 复制仅需要的生产依赖包文件
COPY package*.json ./
RUN npm ci --only=production

# 从 builder 阶段复制编译后的代码
COPY --from=builder /usr/src/app/dist ./dist

# 设置非 root 用户运行应用以提高安全性
USER node

# 暴露应用程序监听的端口
EXPOSE 3001

# 启动命令
CMD ["node", "dist/main.js"]