from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Schema de usuário
class UserBase(BaseModel):   
    email: EmailStr

# Schema para criação de usuário
class UserCreate(UserBase):
    password: str

# Retornos da API (sem senha)
class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True # Permite a conversão de ORM para Pydantic
        
# Schema para token JWT
class Token(BaseModel):
    access_token: str
    token_type: str