@echo off

:: Start backend service
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

:: Create database if it doesn't exist
psql -U postgres -c "CREATE DATABASE foundxnet;" 2>nul

:: Run migrations and start the server
flask db upgrade
start cmd /k "flask run"

:: Start frontend service
cd ../frontend
npm install
npm start 