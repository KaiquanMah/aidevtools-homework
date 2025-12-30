import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
import models  # Ensure all models are registered with Base.metadata

# Use a consistent test database file
TEST_DATABASE_URL = "sqlite:///./test_all.db"

engine_test = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Create all tables once for the entire session
    Base.metadata.create_all(bind=engine_test)
    yield
    # Cleanup after session
    Base.metadata.drop_all(bind=engine_test)
    if os.path.exists("./test_all.db"):
        try:
            os.remove("./test_all.db")
        except:
            pass

@pytest.fixture(autouse=True)
def override_db_dependency(monkeypatch):
    from main import app
    
    def _override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
            
    app.dependency_overrides[get_db] = _override_get_db

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
