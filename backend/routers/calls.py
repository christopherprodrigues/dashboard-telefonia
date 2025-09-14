from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app import services, schemas, models
from app.database import get_db_session
# Vamos criar a função get_current_user em breve
# from app.security import get_current_user

router = APIRouter(
    prefix="/calls",
    tags=["Calls"]
    # dependencies=[Depends(get_current_user)] # Vamos adicionar a proteção depois
)

@router.post("/ingest", summary="Ingest calls from external API")
async def ingest_calls(db: AsyncSession = Depends(get_db_session)):
    """
    Dispara o processo de ingestão de dados da API externa.
    """
    return await services.ingest_calls_from_api(db)

# Este endpoint será criado no próximo passo
# @router.get("/", response_model=List[schemas.Call], summary="List all ingested calls")
# async def list_calls(db: AsyncSession = Depends(get_db_session)):
#     """
#     Lista todas as chamadas que foram ingeridas e estão no banco de dados.
#     """
#     pass