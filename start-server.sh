#!/bin/bash

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the gRPC gateway
# Using start:dev as per user's preference
echo "Starting gRPC Gateway..."
npm run start:dev
