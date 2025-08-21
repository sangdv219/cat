#!/usr/bin/env bash
#!/bin/bash
set -e  # dừng script nếu lệnh nào fail

APP_NAME=${APP_NAME:-cat}  
BRANCH=${BRANCH:-develop}
IMAGE=ghcr.io/sangdv219/$APP_NAME:$BRANCH
HOST_PORT=80
CONTAINER_PORT=3000

echo "[INFO] Using container port: $CONTAINER_PORT"
echo "[INFO] Using host port: $HOST_PORT"
echo "[INFO] Using branch: $BRANCH"
echo "[INFO] Deploying $APP_NAME with image $IMAGE"

echo "[INFO] Stopping old container if exists..."
sudo docker stop $APP_NAME || true
sudo docker rm $APP_NAME || true

echo "[INFO] Log in to GHCR"

echo "[INFO] Pulling latest image..."
sudo docker pull $IMAGE

echo "[INFO] Running container..."
sudo docker run -d --name $APP_NAME -p $HOST_PORT:$CONTAINER_PORT $IMAGE

echo "[INFO] Deployment completed successfully!"
sudo docker ps -a
sudo docker logs --tail 20 $APP_NAME


  # Healthcheck (optional)
sleep 5
if curl -fs http://54.252.231.194 >/dev/null; then
  echo "[INFO] ✅ http://54.252.231.194 is up and healthy on port $APP_NAME"
else
  echo "[ERROR] ❌ http://54.252.231.194 failed to start" >&2
  exit 1
fi

echo "[INFO] $APP_NAME deployed on port $PORT"
