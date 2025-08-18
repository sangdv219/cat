#!/bin/bash
set -e

# APP_NAME=cat
IMAGE=ghcr.io/sangdv219/cat:$BRANCH

echo "Using SHA: $BRANCH"
echo "[INFO] Deploying $APP_NAME with image $IMAGE"

# Stop old container
docker stop $APP_NAME || true
docker rm $APP_NAME || true

# Pull latest image
docker pull $IMAGE

# Run new container
docker run -d --name $APP_NAME \
  -p 3000:3000 \
  --env-file /home/ubuntu/.env \
  $IMAGE
s 