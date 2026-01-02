@echo off
REM Build all Docker images
echo Building Docker images...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
