from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.database import get_db_session
from app.security import get_current_user

router = APIRouter(
    tags=["Metrics"], dependencies=[Depends(get_current_user)]
)


@router.get("/", response_model=schemas.Metrics, summary="Get dashboard metrics")
async def get_metrics(db: AsyncSession = Depends(get_db_session)):
    """
    Retorna os KPIs e os dados para o gráfico de série temporal.
    Requer autenticação.
    """
    kpis_data = await crud.get_kpis(db)
    calls_over_time_data = await crud.get_calls_over_time(db)

    return {"kpis": kpis_data, "calls_over_time": calls_over_time_data}
