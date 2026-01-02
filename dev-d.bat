@echo off
REM Start development environment (detached)
echo Starting development environment in detached mode...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
