#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to check if a service is running
is_service_running() {
    if pgrep -f "$1" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to start a service if not running
start_service() {
    local service_name=$1
    local service_dir="$2"
    local start_script="$3"
    
    echo -n "Checking ${service_name}... "
    if is_service_running "$service_name"; then
        echo -e "${YELLOW}Already running${NC}"
    else
        echo -n "Starting... "
        cd "${ROOT_DIR}/${service_dir}" && chmod +x "$start_script" && "./$start_script" > "${service_name}.log" 2>&1 &
        sleep 2
        if is_service_running "$service_name"; then
            echo -e "${GREEN}Started${NC}"
        else
            echo -e "${RED}Failed to start${NC} (check ${service_dir}/${service_name}.log for details)"
            return 1
        fi
    fi
    return 0
}

# Start PostgreSQL
start_service "postgres" "" "pg_ctl -D /usr/local/var/postgres start"

# Start Redis
start_service "redis-server" "" "redis-server /usr/local/etc/redis.conf"

# Change to project root directory
cd "$ROOT_DIR"

# Start client-service
start_service "client-service" "client-service" "start.sh"

# Start check-service
start_service "check-service" "check-service" "start.sh"

# Start agent-fitness-py
start_service "uvicorn" "agent-fitness-py" "start.sh"

# Start grpc-gateway
start_service "grpc-gateway" "grpc-gateway" "start-server.sh"

# Start fitnessAppUi
start_service "react-scripts" "fitnessAppUi" "start.sh"

echo -e "\n${GREEN}All services have been started.${NC}"
echo "Check individual service logs in their respective directories if needed."
