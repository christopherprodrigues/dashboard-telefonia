import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from . import models, schemas

EXTERNAL_API_URL = "http://217.196.61.183:8080/"


async def ingest_calls_from_api(db: AsyncSession):
    """
    Busca chamadas da API externa (atualmente MOCKADO) e salva as novas no banco de dados.
    """
    # --- NOVO BLOCO DE DADOS MOCK ---
    mock_data = [
        {
            "id": f"{i}",
            "source": f"55419{8000+i:04d}{1000+i:04d}",
            "destination": f"55413{200+i:02d}{3000+i:04d}",
            "start_time": f"2025-09-14T{10 + (i * 5 // 60):02d}:{(i * 5 % 60):02d}:00Z",
            "end_time": f"2025-09-14T{10 + (i * 5 // 60):02d}:{(i * 5 % 60):02d}:{(30 + i) % 60:02d}Z",
            "duration": 30 + i,
            "sip_code": 200 if i % 3 != 0 else 487,
        }
        for i in range(1, 25)
    ] + [
        {
            "id": f"{i}",
            "source": f"55219{7000+i:04d}{2000+i:04d}",
            "destination": f"55212{500+i:02d}{6000+i:04d}",
            "start_time": f"2025-09-14T{14 + (i * 5 // 60):02d}:{(i * 5 % 60):02d}:00Z",
            "end_time": f"2025-09-14T{14 + (i * 5 // 60):02d}:{(i * 5 % 60):02d}:{(45 + i) % 60:02d}Z",
            "duration": 45 + i,
            "sip_code": 200 if i % 2 == 0 else 603,
        }
        for i in range(25, 51)
    ]
    calls_data = mock_data

    # --- BLOCO DE CHAMADA HTTP (TEMPORARIAMENTE DESATIVADO) ---
    # async with httpx.AsyncClient() as client:
    #     try:
    #         response = await client.get(EXTERNAL_API_URL, timeout=10.0)
    #         response.raise_for_status()
    #         calls_data = response.json()
    #     except (httpx.RequestError, httpx.HTTPStatusError) as e:
    #         # Em um app real, logaríamos o erro aqui
    #         print(f"Error fetching external API: {e}")
    #         return {"message": "Failed to fetch data from external API."}
    # --- FIM DO BLOCO DESATIVADO ---

    new_calls_count = 0
    for call_item in calls_data:
        call_schema = schemas.Call(**call_item)

        result = await db.execute(select(models.Call).filter_by(id=call_schema.id))
        existing_call = result.scalars().first()

        if not existing_call:
            new_call = models.Call(**call_schema.model_dump())
            db.add(new_call)
            new_calls_count += 1

    await db.commit()
    return {
        "message": f"Successfully ingested {new_calls_count} new calls from MOCK data."
    }
