@echo off
REM Start development environment
echo Starting development environment...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
