import uuid
import datetime
import enum
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from .base import TenantAwareBase

class RoleEnum(str, enum.Enum):
    superadmin = "superadmin"
    vendor = "vendor"
    customer = "customer"

class User(TenantAwareBase):
    """
    Modelo de Usuário. Ao herdar TenantAwareBase, garantimos que um Cliente (Customer) 
    logado numa loja X jamais veja dados da loja Y.
    """
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.customer)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
