import uuid
import datetime
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from .base import Base

class Tenant(Base):
    """
    Modelo do Lojista. Cada Tenant no PostgreSQL representa um E-commerce (ex: FutFanatics).
    """
    __tablename__ = "tenants"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    domain_name = Column(String, unique=True, index=True) # ex: lojadojoao.plataforma.com
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
