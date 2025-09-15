from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app import services, schemas, models
from app.database import get_db_session
from app.security import get_current_user

router = APIRouter(
    prefix="/calls",
    tags=["Calls"],
    dependencies=[Depends(get_current_user)],
)


@router.post("/ingest", summary="Ingest calls from external API")
async def ingest_calls(db: AsyncSession = Depends(get_db_session)):
    return await services.ingest_calls_from_api(db)

@router.get("/", response_model=List[schemas.Call], summary="List all ingested calls")
async def list_calls(db: AsyncSession = Depends(get_db_session)):
    result = await db.execute(select(models.Call))
    calls = result.scalars().all()
    return calls
