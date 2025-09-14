from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from . import models, schemas, security

async def get_user_by_email(db: AsyncSession, email: str) -> models.User | None:
    """Busca um usuário pelo email."""
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    """Cria um novo usuário no db com senha hasheada."""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email = user.email,
        hashed_pasword = hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user