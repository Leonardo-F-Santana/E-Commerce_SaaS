import uuid
import datetime
import enum
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, TenantAwareBase

class SizeEnum(str, enum.Enum):
    P = "P"
    M = "M"
    G = "G"
    GG = "GG"
    XG = "XG"
    XXG = "XXG"

class Product(TenantAwareBase):
    """
    Camisa de Futebol. Isolada por tenant.
    """
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False) 
    description = Column(String)
    price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    variations = relationship("ProductVariation", back_populates="product", cascade="all, delete-orphan")

class ProductVariation(Base):
    """
    Estoque de cada camisa agrupada por tamanho. Ex: Camisa Real Madrid (M) -> 10 unidades.
    Nota: Não precisa ser TenantAwareBase pois o product_id já está num produto de um tenant.
    """
    __tablename__ = "product_variations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    size = Column(Enum(SizeEnum), nullable=False)
    stock_quantity = Column(Integer, default=0)
    
    product = relationship("Product", back_populates="variations")
