from pydantic import BaseModel, Field
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
    variations: List[ProductVariationCreate]

class ProductOut(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    price: float
    is_active: bool
    created_at: datetime
    
    class Config:
        # Permite retornar diretamente objetos do SQLAlchemy
        from_attributes = True
