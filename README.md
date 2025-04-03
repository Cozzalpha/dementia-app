# FoundXNet - AI-Powered Startup Networking Platform

FoundXNet is a full-stack platform that connects startup founders with investors using AI-powered matchmaking. The platform features real-time chat, funding insights, and collaboration tools to facilitate meaningful connections in the startup ecosystem.

## Features

- **AI-Powered Matchmaking**: Intelligent matching between founders and investors based on company data, industry, and funding stage
- **Real-Time Chat**: WebSocket-based messaging system for seamless communication
- **Company Profiles**: Detailed company information and funding history
- **Investor Dashboard**: Advanced search and filtering for finding promising startups
- **Collaboration Tools**: Project listings and joint venture opportunities
- **Funding Insights**: Valuation tracking and funding history visualization

## Tech Stack

### Backend
- Flask (Python web framework)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- Flask-SocketIO (Real-time communication)
- PostgreSQL (Database)
- Redis (WebSocket message queue)
- Scikit-learn (AI/ML components)

### Frontend
- React.js
- Redux (State management)
- Material-UI (UI components)
- Socket.IO Client (Real-time communication)

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- Redis
- OpenAI API key (for enhanced matching)

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

5. Run the development server:
```bash
flask run
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users
- `GET /api/users/connections` - Get user connections

### Companies
- `POST /api/companies/add` - Add new company
- `GET /api/companies/<id>` - Get company details
- `PUT /api/companies/<id>` - Update company details
- `POST /api/companies/<id>/funding` - Add funding round

### Matchmaking
- `GET /api/matchmaking/matches` - Get potential matches
- `POST /api/matchmaking/connect` - Create new match
- `PUT /api/matchmaking/matches/<id>/status` - Update match status

### Chat
- `GET /api/chat/history/<user_id>` - Get chat history
- `POST /api/chat/send` - Send message
- `PUT /api/chat/read/<message_id>` - Mark message as read

## Deployment

The application can be deployed using Docker and Docker Compose:

```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@foundxnet.com or create an issue in the repository. 