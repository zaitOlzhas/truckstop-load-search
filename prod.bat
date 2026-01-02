@echo off
REM Start production environment (detached)
echo Starting production environment...
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
