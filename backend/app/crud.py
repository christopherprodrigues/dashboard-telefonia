from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Numeric
from typing import List

from . import models, schemas, security


async def get_user_by_email(db: AsyncSession, email: str) -> models.User | None:
    """Busca um usuário pelo email."""
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalars().first()


async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    """Cria um novo usuário no db com senha hasheada."""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def get_kpis(db: AsyncSession) -> dict:
    """Calcula os KPIs a partir dos dados no banco."""

    # Conta o total de chamadas e o total de chamadas atendidas (sip_code = 200)
    query = select(
        func.count(models.Call.id),
        func.count(models.Call.id).filter(models.Call.sip_code == 200),
    )
    total_calls, answered_calls = (await db.execute(query)).one()

    # Calcula a duração média apenas das chamadas atendidas
    query_acd = select(func.avg(models.Call.duration)).filter(
        models.Call.sip_code == 200
    )
    acd_result = (await db.execute(query_acd)).scalar_one_or_none()
    acd = acd_result if acd_result is not None else 0.0

    # Calcula ASR (evita divisão por zero)
    asr = (answered_calls / total_calls * 100.0) if total_calls > 0 else 0.0

    return {
        "total_calls": total_calls,
        "answered_calls": answered_calls,
        "asr": round(asr, 2),
        "acd": round(acd, 2),
    }


async def get_calls_over_time(db: AsyncSession) -> List[dict]:
    """Agrupa as chamadas por hora."""
    query = (
        select(
            func.date_trunc("hour", models.Call.start_time).label("time_period"),
            func.count(models.Call.id).label("call_count"),
        )
        .group_by("time_period")
        .order_by("time_period")
    )

    result = await db.execute(query)
    return [
        {"time_period": row.time_period, "call_count": row.call_count} for row in result
    ]
