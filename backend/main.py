import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import products, auth

app = FastAPI(
    title="SaaS E-Commerce Backend",
    description="Motor Multi-tenant Escalável c/ Serviço de Mídia Front-End OTI",
    version="1.0.0"
)

# [DIRETRIZ B2C CIBERNÉTICA] Desbloqueio de Origin Headers cruzados (CORS) 
# Essencial para requisições POST Client-Side (Browser do React para o Python)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir Vercel NextJS/Localhost 
    allow_credentials=True,
    allow_methods=["*"], # Mapeia todos os Preflights (OPTIONS, PATCH, POST)
    allow_headers=["*"],
)

# [DIRETRIZ DE STATIC FILES] Garantir e hospedar File-System publicamente na porta do Servidor. (Para os <img> Html).
os.makedirs("static/products", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Acoplando as rotas
app.include_router(products.router)
app.include_router(auth.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Motor FastAPI rodando com perfeição!"}
