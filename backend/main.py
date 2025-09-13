# This file has been moved to app/main.py
# For development, run: uvicorn app.main:app --reload
# Or use the provided script: ./start-dev.sh

import sys
import os

# Add the current directory to the path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)