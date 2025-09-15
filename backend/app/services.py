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
            "start_time": "2025-09-14T15:01:00Z",
            "end_time": "2025-09-14T15:03:30Z",
            "duration": 150,
            "sip_code": 200,
        },
        {
            "id": "2",
            "source": "5541988888888",
            "destination": "554132222222",
            "start_time": "2025-09-14T15:05:00Z",
            "end_time": "2025-09-14T15:06:00Z",
            "duration": 60,
            "sip_code": 487,
        },
        {
            "id": "3",
            "source": "5541977777777",
            "destination": "554134444444",
            "start_time": "2025-09-14T15:10:00Z",
            "end_time": "2025-09-14T15:11:15Z",
            "duration": 75,
            "sip_code": 200,
        },
        {
            "id": "4",
            "source": "5541966666666",
            "destination": "554135555555",
            "start_time": "2025-09-14T16:20:00Z",
            "end_time": "2025-09-14T16:22:05Z",
            "duration": 125,
            "sip_code": 200,
        },
        {
            "id": "5",
            "source": "5541955555555",
            "destination": "554136666666",
            "start_time": "2025-09-14T16:30:00Z",
            "end_time": "2025-09-14T16:30:45Z",
            "duration": 45,
            "sip_code": 503,
        },
        {
            "id": "6",
            "source": "5541944444444",
            "destination": "554137777777",
            "start_time": "2025-09-14T17:02:00Z",
            "end_time": "2025-09-14T17:08:30Z",
            "duration": 390,
            "sip_code": 200,
        },
        {
            "id": "7",
            "source": "5541933333333",
            "destination": "554138888888",
            "start_time": "2025-09-14T17:15:00Z",
            "end_time": "2025-09-14T17:15:20Z",
            "duration": 20,
            "sip_code": 404,
        },
        {
            "id": "8",
            "source": "5541922222222",
            "destination": "554139999999",
            "start_time": "2025-09-14T18:00:00Z",
            "end_time": "2025-09-14T18:05:00Z",
            "duration": 300,
            "sip_code": 200,
        },
        {
            "id": "9",
            "source": "5541911111111",
            "destination": "554131111111",
            "start_time": "2025-09-14T18:01:00Z",
            "end_time": "2025-09-14T18:01:10Z",
            "duration": 10,
            "sip_code": 603,
        },
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
