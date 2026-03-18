from sqlalchemy.orm import declarative_base, declared_attr
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

# Base central de todos os modelos
Base = declarative_base()

class TenantAwareBase(Base):
    """
    Classe Abstrata para garantir isolamento Multi-tenant.
    Qualquer modelo que estender essa classe pertencerá obrigatoriamente a um Lojista (Tenant_ID).
    Isso impede vazamento de dados entre os e-commerces rodando no SaaS.
    """
    __abstract__ = True
    
    @declared_attr
    def tenant_id(cls):
        return Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
