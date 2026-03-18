from fastapi import FastAPI
from routes import products

app = FastAPI(
    title="SaaS E-Commerce Backend",
    description="API Mestre para controle Multi-tenant de Lojas de Futebol",
    version="1.0.0"
)

# Acoplando as rotas
app.include_router(products.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Motor FastAPI rodando com perfeição!"}
