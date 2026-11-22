"""Application factory and shared middleware. Run from the repository root."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from naimiris_api import __version__
from naimiris_api.config import Settings
from naimiris_api.routes.health import router as health_router
from naimiris_api.schemas import ErrorResponse

logger = logging.getLogger("naimiris_api")


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings if settings is not None else Settings()

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        logging.basicConfig(level=settings.log_level)
        logger.info("NaiMiris API started; ML and chatbot services are not implemented")
        yield
        logger.info("NaiMiris API stopped")

    app = FastAPI(
        title="NaiMiris AI API",
        version=__version__,
        description="Phase 1 foundation. Health is HTTP liveness only; no model or chatbot is connected.",
        lifespan=lifespan,
        responses={
            404: {"model": ErrorResponse},
            500: {"model": ErrorResponse},
        },
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET"],
        allow_headers=["Accept", "Content-Type"],
    )

    @app.exception_handler(HTTPException)
    async def http_error(_request: Request, exc: HTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": f"http_{exc.status_code}", "message": str(exc.detail)}},
            headers=exc.headers,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error(_request: Request, exc: RequestValidationError) -> JSONResponse:
        # Do not echo submitted values, secrets, or validation contexts.
        details = [{"field": list(error["loc"]), "type": error["type"]} for error in exc.errors()]
        return JSONResponse(
            status_code=422,
            content={"error": {"code": "validation_error", "message": "Request validation failed", "details": details}},
        )

    @app.exception_handler(Exception)
    async def unexpected_error(_request: Request, _exc: Exception) -> JSONResponse:
        # Avoid exception text: integrations could include credentials or user data.
        logger.error("Unhandled API exception (%s)", type(_exc).__name__)
        return JSONResponse(
            status_code=500,
            content={"error": {"code": "internal_error", "message": "An internal server error occurred"}},
        )

    app.include_router(health_router)
    return app


app = create_app()
