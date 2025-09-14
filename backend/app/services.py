import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from . import models, schemas

EXTERNAL_API_URL = "http://217.196.61.183:8080/"

async def ingest_calls_from_api(db: AsyncSession):
    """
    Busca chamadas da API externa e salva as novas no banco de dados.
    Operação idempotente: não salva chamadas duplicadas.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(EXTERNAL_API_URL)
        response.raise_for_status() # Lança um erro se a requisição falhar
        
        calls_data = response.json()
        new_calls_count = 0

        for call_item in calls_data:
            # Valida os dados recebidos com o schema Pydantic
            call_schema = schemas.Call(**call_item)
            
            # Verifica se a chamada já existe no banco pelo ID
            result = await db.execute(select(models.Call).filter_by(id=call_schema.id))
            existing_call = result.scalars().first()
            
            if not existing_call:
                new_call = models.Call(**call_schema.model_dump())
                db.add(new_call)
                new_calls_count += 1
        
        await db.commit()
        return {"message": f"Successfully ingested {new_calls_count} new calls."}