# Oli-Branch Backend

Agentic Financial Control System for Small Businesses

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/oli-branch/backend.git
cd backend

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn src.main:app --reload