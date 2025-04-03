#!/bin/bash

# Start backend service
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run &

# Start frontend service
cd ../frontend
npm install
npm start 