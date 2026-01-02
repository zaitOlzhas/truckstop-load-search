@echo off
REM Clean up containers, volumes, and images
echo Cleaning up containers, volumes, and images...
docker-compose down -v --rmi all
