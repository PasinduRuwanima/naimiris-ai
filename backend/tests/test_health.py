from fastapi import FastAPI
from fastapi.testclient import TestClient

from naimiris_api import __version__
from naimiris_api.config import Settings
from naimiris_api.main import create_app


def test_health_contract(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "NaiMiris AI API", "version": __version__}


def test_openapi_documents_health(client):
    response = client.get("/openapi.json")
    assert response.status_code == 200
    paths = response.json()["paths"]
    assert set(paths) == {"/api/health"}


def test_unknown_route_uses_error_envelope(client):
    response = client.get("/api/missing")
    assert response.status_code == 404
    assert response.json() == {"error": {"code": "http_404", "message": "Not Found"}}


def test_post_is_not_an_available_health_operation(client):
    response = client.post("/api/health")
    assert response.status_code == 405
    assert response.json()["error"]["code"] == "http_405"


def test_local_origin_is_allowed(client):
    response = client.get("/api/health", headers={"Origin": "http://localhost:5173"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "access-control-allow-credentials" not in response.headers


def test_unlisted_origin_is_not_allowed(client):
    response = client.get("/api/health", headers={"Origin": "https://untrusted.example"})
    assert "access-control-allow-origin" not in response.headers


def test_preflight_rejects_unlisted_origin(client):
    response = client.options("/api/health", headers={"Origin": "https://untrusted.example", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers


def test_validation_errors_do_not_echo_submitted_values():
    app: FastAPI = create_app(Settings(_env_file=None))

    @app.get("/test-validation")
    def test_route(amount: int):
        return {"amount": amount}

    with TestClient(app) as client:
        response = client.get("/test-validation", params={"amount": "private-user-input"})
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
    assert "private-user-input" not in response.text


def test_unexpected_error_does_not_expose_exception():
    app = create_app(Settings(_env_file=None))

    @app.get("/test-error")
    def broken_route():
        raise RuntimeError("private-user-input")

    with TestClient(app, raise_server_exceptions=False) as client:
        response = client.get("/test-error")
    assert response.status_code == 500
    assert response.json() == {"error": {"code": "internal_error", "message": "An internal server error occurred"}}
    assert "private-user-input" not in response.text
