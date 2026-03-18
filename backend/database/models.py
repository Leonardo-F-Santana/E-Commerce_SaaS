import uuid
import enum
import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, Float, DateTime, Boolean, Enum
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class RoleEnum(str, enum.Enum):
    MASTER_ADMIN = "MASTER_ADMIN" # Dono do SaaS
    TENANT_ADMIN = "TENANT_ADMIN" # Lojista
    CUSTOMER = "CUSTOMER"         # Cliente Final

class SizeEnum(str, enum.Enum):
    P = "P"
    M = "M"
    G = "G"
    GG = "GG"
    XG = "XG"
    XXG = "XXG"

class TenantModel(Base):
    """
    Modelo do Lojista. Cada Tenant(Lojista) gerencia sua própria loja,
    produtos, usuários(clientes), pedidos, etc.
    """
    __tablename__ = "tenants"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False) 
    subdomain = Column(String, unique=True, index=True) 
    custom_domain = Column(String, unique=True, index=True, nullable=True) 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    users = relationship("UserModel", back_populates="tenant")
    products = relationship("ProductModel", back_populates="tenant")
    orders = relationship("OrderModel", back_populates="tenant")

class TenantAwareBase(Base):
    """
    Classe Abstrata Base para garantir isolamento Multi-tenant.
    Qualquer modelo que estenda essa classe pertencerá a um Lojista (Tenant) específico.
    """
    __abstract__ = True
    # Tudo que herdar daqui terá a coluna tenant_id e relação com o Tenant!
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)

class UserModel(TenantAwareBase):
    """
    Modelo de Usuário. Um cliente de uma loja tem um tenant_id atrelado.
    Os admins dos lojistas também estão vinculados aqui via role='TENANT_ADMIN'.
    """
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.CUSTOMER)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    tenant = relationship("TenantModel", back_populates="users")
    orders = relationship("OrderModel", back_populates="user")
    cart = relationship("CartModel", back_populates="user", uselist=False)

    # Constraint para garantir que o email do cliente seja único *apenas* dentro da sua respectiva loja (tenant)
    # __table_args__ = (UniqueConstraint('email', 'tenant_id', name='uq_user_email_per_tenant'),)

class ProductModel(TenantAwareBase):
    """
    Produto (Camisa de Futebol).
    """
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False) # Ex: Camisa Real Madrid Home 23/24
    description = Column(String)
    base_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    tenant = relationship("TenantModel", back_populates="products")
    variations = relationship("ProductVariationModel", back_populates="product", cascade="all, delete-orphan")

class ProductVariationModel(Base):
    """
    Variações da Camisa (ex: Tamanho M, Tamanho G, etc.) que carregam o estoque e SKU.
    """
    __tablename__ = "product_variations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    size = Column(Enum(SizeEnum), nullable=False)
    stock_quantity = Column(Integer, default=0)
    sku = Column(String, unique=True, index=True)
    
    product = relationship("ProductModel", back_populates="variations")

class OrderModel(TenantAwareBase):
    """
    Modelo de Pedido.
    """
    __tablename__ = "orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="PENDING") # PENDING, PAID, SHIPPED, DELIVERED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    tenant = relationship("TenantModel", back_populates="orders")
    user = relationship("UserModel", back_populates="orders")
    items = relationship("OrderItemModel", back_populates="order", cascade="all, delete-orphan")

class OrderItemModel(Base):
    __tablename__ = "order_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    variation_id = Column(UUID(as_uuid=True), ForeignKey("product_variations.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_time = Column(Float, nullable=False)

    order = relationship("OrderModel", back_populates="items")
    variation = relationship("ProductVariationModel")

class CartModel(TenantAwareBase):
    __tablename__ = "carts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=True) # Anônimo (None) ou Logado
    session_id = Column(String, index=True, nullable=True) # Para carrinhos sem login
    
    user = relationship("UserModel", back_populates="cart")
    items = relationship("CartItemModel", back_populates="cart", cascade="all, delete-orphan")

class CartItemModel(Base):
    __tablename__ = "cart_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_id = Column(UUID(as_uuid=True), ForeignKey("carts.id"), nullable=False)
    variation_id = Column(UUID(as_uuid=True), ForeignKey("product_variations.id"), nullable=False)
    quantity = Column(Integer, default=1)
    
    cart = relationship("CartModel", back_populates="items")
