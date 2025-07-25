#!/bin/bash

# Define the ports to check and kill if in use
PORTS=(4200 4201 4202 3000)  # Add all ports used by your applications

# Function to kill process on a specific port
kill_port() {
    local port=$1
    echo "Checking port $port..."
    local pid=$(lsof -ti :$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill -9 $pid
        sleep 1  # Give it a second to terminate
    fi
}

# Get the base directory
BASE_DIR=$(dirname "$0")

# Function to start an application
start_app() {
    local name=$1
    local cmd=$2
    local dir=$3
    local log_file="$BASE_DIR/$name.log"
    
    echo "Starting $name..."
    cd "$dir" || { echo "Failed to cd to $dir"; return 1; }
    nohup $cmd > "$log_file" 2>&1 &
    echo "$name started. Logs: $log_file"
    cd - > /dev/null
    sleep 2
}

# Kill processes on all defined ports
for port in "${PORTS[@]}"; do
    kill_port $port
done

# Start applications
echo "Starting applications..."

# Start remote (port 4201)
start_app "remote1" "ng serve --port 4201" "$BASE_DIR/remote"

# Start remote1 (port 4202)
start_app "remote2" "ng serve --port 4202" "$BASE_DIR/remote1"

# Start React remote (port 3000)
start_app "react-remote" "npm start" "$BASE_DIR/react-remote"

# Start the shell application (port 4200)
start_app "shell" "ng serve --port 4200" "$BASE_DIR/shell"

echo "\nAll applications started in the background!"
echo "Shell: http://localhost:4200"
echo "Remote 1: http://localhost:4201"
echo "Remote 2: http://localhost:4202"
echo "React Remote: http://localhost:3000"
echo "\nView logs in the respective .log files in: $BASE_DIR/"

exit 0
