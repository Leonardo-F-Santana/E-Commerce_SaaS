import os
import shutil
from uuid import uuid4
from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from typing import List

from models.product import Product, ProductVariation, ProductImageModel
from schemas.product import ProductCreate, ProductOut, ProductPromoUpdate
from auth.dependencies import get_current_tenant_id

# Dependência mock para banco de dados via SQLAlchemy
def get_db():
    pass

router = APIRouter(
    prefix="/products",
    tags=["Produtos"]
)

@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_product_image(
    files: List[UploadFile] = File(...),
    tenant_id: UUID = Depends(get_current_tenant_id)
):
    """
    [DIRETRIZ DE UPLOAD LOCAL SEGURO MULTI-ARQUIVOS]
    Recebe um Array de arquivos Multipart. Grava os binários em `/static/products/`.
    """
    allowed_extensions = ["image/jpeg", "image/png", "image/webp"]
    uploaded_urls = []
    
    for file in files:
        if file.content_type not in allowed_extensions:
            continue # Ignora arquivos hackeados e salva os corretos.
            
        file_ext = file.filename.split(".")[-1]
        safe_filename = f"{tenant_id}_{uuid4().hex}.{file_ext}"
        file_path = f"static/products/{safe_filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        uploaded_urls.append(f"http://localhost:8000/static/products/{safe_filename}")
        
    if not uploaded_urls:
         raise HTTPException(status_code=400, detail="Nenhuma imagem válida (JPEG, PNG, WEBP) foi anexada.")

    return {"message": "Upload de Galeria efetuado no HD local", "urls": uploaded_urls}

@router.patch("/{product_id}/promo", response_model=ProductOut)
def apply_promotion(
    product_id: UUID,
    promo_data: ProductPromoUpdate,
    tenant_id: UUID = Depends(get_current_tenant_id),
    db: Session = Depends(get_db)
):
    """
    [DIRETRIZ DE PROMOÇÃO BLINDADA (Anti-IDOR)]
    Tenta encontrar um produto ONDE (ID == Param) AND (Tenant == Logged_In).
    Falha 404 intencionalmente evitando Vazamentos e Cross-Tenant updates.
    """
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.tenant_id == tenant_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Produto inexistente ou IDOR block (Acesso negado).")
        
    product.promo_price = promo_data.promo_price
    db.commit()
    db.refresh(product)
    return product

from typing import List

@router.get("/", response_model=List[ProductOut])
def list_all_products(db: Session = Depends(get_db)):
    """
    [DIRETRIZ DE SINCRONIZAÇÃO B2C VIVA]
    Devolve a listagem aberta puxando ativamente a Galeria Múltipla.
    """
    products = db.query(Product).options(joinedload(Product.images)).filter(Product.is_active == True).all()
            
    return products

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
        promo_price=product_in.promo_price
    )
    
    db.add(new_product)
    db.flush() # Sincroniza (mas n commita) para obtermos o 'new_product.id'
    
    # 2. Injeta a Galeria Plena de Fotos
    for url in product_in.image_urls:
         img_record = ProductImageModel(product_id=new_product.id, url=url)
         db.add(img_record)
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
