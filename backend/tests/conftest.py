import pytest
from fastapi.testclient import TestClient

from naimiris_api.config import Settings
from naimiris_api.main import create_app


@pytest.fixture
def client():
    app = create_app(Settings(_env_file=None))
    with TestClient(app) as test_client:
        yield test_client
