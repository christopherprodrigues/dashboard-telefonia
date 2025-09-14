from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


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
        from_attributes = True  # Permite a conversão de ORM para Pydantic


# Schema para token JWT
class Token(BaseModel):
    access_token: str
    token_type: str


class Call(BaseModel):
    id: str
    source: str
    destination: str
    start_time: datetime
    end_time: datetime
    duration: int
    sip_code: int


class Config:
    from_attributes = True


class KPIs(BaseModel):
    total_calls: int
    answered_calls: int
    asr: float  # Answer Seizure Ratio (%)
    acd: float  # Average Call Duration (seconds)


class CallOverTime(BaseModel):
    time_period: datetime
    call_count: int


class Metrics(BaseModel):
    kpis: KPIs
    calls_over_time: List[CallOverTime]
