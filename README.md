docker build -t blog-new-api:latest .

docker run -p 3000:3000 blog-new-api:latest


github action 自动编译并推送镜像