import pytest
from pydantic import ValidationError

from naimiris_api.config import Settings


def test_settings_read_explicit_environment(monkeypatch):
    monkeypatch.setenv("NAIMIRIS_CORS_ORIGINS", '["https://farm.example"]')
    monkeypatch.setenv("NAIMIRIS_LOG_LEVEL", "WARNING")
    settings = Settings(_env_file=None)
    assert settings.cors_origins == ["https://farm.example"]
    assert settings.log_level == "WARNING"


@pytest.mark.parametrize("origin", ["*", "https://*.example", "file:///tmp", "https://example.com/path", "https://user:secret@example.com", "https://example.com/", "https://example.com:bad", "https://example.com?x=1"])
def test_unsafe_or_non_origin_cors_entries_are_rejected(origin):
    with pytest.raises(ValidationError):
        Settings(cors_origins=[origin], _env_file=None)
