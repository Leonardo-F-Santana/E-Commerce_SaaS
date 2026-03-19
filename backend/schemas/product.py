from pydantic import BaseModel, Field, validator
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class ProductVariationCreate(BaseModel):
    size: str = Field(..., example="GG")
    stock_quantity: int = Field(0, ge=0)

class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255, example="Camisa Flamengo Home")
    description: Optional[str] = Field(None, example="Camisa 100% Algodão")
    price: float = Field(..., gt=0.0)
    promo_price: Optional[float] = Field(None, gt=0.0)
    image_urls: List[str] = Field(default_factory=list, example=["http://localhost:8000/static..."])
    variations: List[ProductVariationCreate]

class ProductPromoUpdate(BaseModel):
    promo_price: float = Field(..., gt=0.0)

class ProductOut(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    price: float
    promo_price: Optional[float] = None
    images: List[str] = Field(default_factory=list)
    is_active: bool
    created_at: datetime
    
    # Extrai ativamente apenas os URLS absolutos do SQLAlchemy Relationship (ProductImageModel)
    @validator("images", pre=True, always=True)
    def extract_image_urls(cls, v):
        if not v: return []
        # Se for um objeto do Banco de Dados com atributo url, puxa.
        if hasattr(v[0], "url"): return [img.url for img in v]
        return v
    
    class Config:
        # Permite retornar diretamente objetos do SQLAlchemy
        from_attributes = True
