@echo off
echo 🌱 Seeding Firebase Emulators...
echo.

REM Wait for emulators to be ready
echo ⏳ Waiting for emulators to start...
timeout /t 5 /nobreak >nul

REM Run the seed script
cd functions
call npm run seed

echo.
echo ✅ Emulators are ready with seed data!
echo 🌐 Open http://localhost:5173 to start testing

