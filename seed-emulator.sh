#!/bin/bash

echo "🌱 Seeding Firebase Emulators..."
echo ""

# Wait for emulators to be ready
echo "⏳ Waiting for emulators to start..."
sleep 5

# Run the seed script
cd functions
npm run seed

echo ""
echo "✅ Emulators are ready with seed data!"
echo "🌐 Open http://localhost:5173 to start testing"

