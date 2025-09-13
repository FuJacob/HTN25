# HTN25 Backend

FastAPI backend server for the HTN25 project.

## Setup

1. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the development server:

```bash
# Option 1: Use the startup script
./start-dev.sh

# Option 2: Run directly with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Option 3: Run the main.py file
python main.py
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application factory
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py      # Configuration settings
│   ├── models/
│   │   └── __init__.py      # Database models
│   └── routers/
│       ├── __init__.py
│       └── users.py         # User API routes
├── tests/
│   └── __init__.py          # Test files
├── venv/                    # Virtual environment
├── .env                     # Environment variables
├── .env.example            # Environment variables template
├── main.py                 # Entry point (redirects to app.main)
├── requirements.txt        # Python dependencies
└── start-dev.sh           # Development server script
```

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/{user_id}` - Get user by ID
- `POST /api/users` - Create new user
- `DELETE /api/users/{user_id}` - Delete user

## Development

The server runs with auto-reload enabled during development. The API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

See `.env.example` for available configuration options.
