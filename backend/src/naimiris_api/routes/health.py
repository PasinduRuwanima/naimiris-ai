from fastapi import APIRouter

from naimiris_api import __version__
from naimiris_api.schemas import HealthResponse

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthResponse, summary="HTTP service liveness")
def health() -> HealthResponse:
    """Confirm HTTP service liveness; this does not indicate ML or RAG readiness."""
    return HealthResponse(version=__version__)
