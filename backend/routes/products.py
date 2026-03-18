from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from models.product import Product, ProductVariation
from schemas.product import ProductCreate, ProductOut
from auth.dependencies import get_current_tenant_id

# Dependência mock para banco de dados via SQLAlchemy
def get_db():
    pass

router = APIRouter(
    prefix="/products",
    tags=["Produtos"]
)

@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    # ========================================================================
    # PROTEÇÃO MULTI-TENANT DE ALTO NÍVEL:
    # O tenant_id jamais vem do payload JSON (hackeável). 
    # Ele é decodificado a força do Token JWT de quem fez a requisição.
    # ========================================================================
    tenant_id: UUID = Depends(get_current_tenant_id) 
):
    """
    Endpoint para o Lojista cadastrar uma nova camisa.
    """
    
    # 1. Cria a camisa base (associando ao tenant correto para não vazar p/ a loja B)
    new_product = Product(
        tenant_id=tenant_id,
        name=product_in.name,
        description=product_in.description,
        price=product_in.price,
    )
    
    db.add(new_product)
    db.flush() # Sincroniza (mas n commita) para obtermos o 'new_product.id'
    
    # 2. Insere a rampa de estoque (Variações: Ex: P=10, M=15)
    for variation in product_in.variations:
        new_variation = ProductVariation(
            product_id=new_product.id,
            size=variation.size,
            stock_quantity=variation.stock_quantity
        )
        db.add(new_variation)
        
    db.commit()
    db.refresh(new_product) # Atualiza objeto com os dados finais do banco
    
    return new_product
