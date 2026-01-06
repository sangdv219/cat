
set -e  # dừng script nếu lệnh nào fail

APP_NAME=${APP_NAME:-cat}  
BRANCH=${BRANCH:-staging}
IMAGE=ghcr.io/sangdEv2109/$APP_NAME:latest
HOST_PORT=80
CONTAINER_PORT=3000
HOST_MAIN=https://54.252.231.194

echo "[INFO] Using container port: $CONTAINER_PORT"
echo "[INFO] Using host port: $HOST_PORT"
echo "[INFO] Using branch: $BRANCH"
echo "[INFO] Deploying $APP_NAME with image $IMAGE"

echo "[INFO] Stopping old container if exists..."
sudo docker stop $APP_NAME || true
sudo docker rm $APP_NAME || true

echo "[INFO] Log in to Hub Docker"
echo ${{DOCKER_HUB_TOKEN}} | sudo docker login -u sangdev2109 --password-stdin
sudo docker pull $IMAGE

echo "DB_HOST=$STAGING_DB_HOST" > .env.staging
echo "DB_PORT=$STAGING_DB_PORT" >> .env.staging
echo "DB_USER=$STAGING_DB_USER" >> .env.staging
echo "DB_PASSWORD=$STAGING_DB_PASSWORD" >> .env.staging
echo "DB_DATABASE=$STAGING_DB_DATABASE" >> .env.staging
echo "REDIS_HOST=$STAGING_REDIS_HOST" >> .env.staging
echo "[INFO] Using environment variables from .env.staging"

echo "[INFO] Stopping old container..."
sudo docker stop $APP_NAME || true
sudo docker rm $APP_NAME || true

echo "[INFO] Logging in and Pulling image..."
echo "$DOCKER_HUB_TOKEN" | sudo docker login -u sangdev2109 --password-stdin
sudo docker pull $IMAGE

echo "[INFO] Running container..."
# Lưu ý: Thêm --env-file để container đọc các biến vừa ghi
sudo docker run -d --name $APP_NAME \
  --env-file .env.staging \
  -p $HOST_PORT:$CONTAINER_PORT $IMAGE

echo "[INFO] Deployment completed successfully!"

sudo docker ps -a
sudo docker logs $APP_NAME


  # Healthcheck (optional)
sleep 5
if curl -fs http://localhost:$HOST_PORT >/dev/null; then
  echo "[INFO] ✅ $APP_NAME is up and healthy on port $HOST_PORT"
else
  echo "[ERROR] ❌ $APP_NAME failed to start" >&2
  exit 1
fi

