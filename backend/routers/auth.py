from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, security, schemas
from db.database import get_db_session

router = APIRouter(
    prefix = "/auth",
    tags = ["Authentication"]
)

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db_session)
):
    """Endpoint para autenticação e obtenção de token JWT."""
    user = await crud.get_user_by_email(db, form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers = {"WWW-Authenticate": "Bearer"},
        )
        
    access_token = security.create_access_token(
        data = {"sub": user.email}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}