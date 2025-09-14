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
            "id": "1",
            "source": "5541999999999",
            "destination": "554133333333",
            "start_time": "2025-09-14T18:00:00Z",
            "end_time": "2025-09-14T18:02:30Z",
            "duration": 150,
            "sip_code": 200,
        },
        {
            "id": "2",
            "source": "5541988888888",
            "destination": "554132222222",
            "start_time": "2025-09-14T18:05:00Z",
            "end_time": "2025-09-14T18:06:00Z",
            "duration": 60,
            "sip_code": 487,
        },
        {
            "id": "3",
            "source": "5541977777777",
            "destination": "554134444444",
            "start_time": "2025-09-14T18:10:00Z",
            "end_time": "2025-09-14T18:11:15Z",
            "duration": 75,
            "sip_code": 200,
        },
    ]
    calls_data = mock_data
    # --- FIM DO BLOCO DE DADOS MOCK ---

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
