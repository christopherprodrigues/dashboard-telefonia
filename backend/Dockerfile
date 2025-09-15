# Use a imagem oficial do Python
FROM python:3.11-slim

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo de dependências e instale-as
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie todo o código da aplicação para o container
COPY . .

# Comando para rodar a aplicação (será sobrescrito pelo docker-compose, mas é uma boa prática)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]