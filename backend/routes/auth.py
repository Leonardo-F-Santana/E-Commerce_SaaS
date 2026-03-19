from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from auth.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Acessos SaaS (RBAC)"])

def get_db():
    pass

import uuid
import models.user
import schemas.user
from auth.security import get_password_hash

MOCK_USERS_DB = [] # Simulação de Banco de Dados RAM

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    [DIRETRIZ DE SEGURANÇA RBAC]
    Validação Orgânica Mockada em RAM (já que SQLAlchemy DB = None Localmente)
    """
    global MOCK_USERS_DB
    # 1. Scanner de Existência do E-mail e Cruzamento BCrypt
    user = next((u for u in MOCK_USERS_DB if u.email == form_data.username), None)
    
    if user and verify_password(form_data.password, user.hashed_password):
        # AUTH REALIZADA COM SUCESSO (Retornando JWT Session Ouro)
        return {
            "access_token": create_access_token(data={"sub": str(user.id), "tenant_id": str(user.tenant_id), "role": user.role.value if hasattr(user.role, 'value') else user.role}),
            "token_type": "bearer",
            "role": user.role.value if hasattr(user.role, 'value') else user.role,
            "tenant_id": str(user.tenant_id)
        }

    # MOCK FALLBACK (Contas Hardcoded)
    if form_data.username == "admin@loja.com" and form_data.password == "123456":
        return { "access_token": create_access_token(data={"sub": "user_123", "tenant_id": "loja_1", "role": "vendor"}), "token_type": "bearer", "role": "vendor", "tenant_id": "loja_1" }
    elif form_data.username == "cliente@email.com" and form_data.password == "123456":
        return { "access_token": create_access_token(data={"sub": "user_999", "tenant_id": "loja_1", "role": "customer"}), "token_type": "bearer", "role": "customer", "tenant_id": "loja_1" }
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="⚠️ E-mail ou senha incorretos.",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_in: schemas.user.UserCreate, db: Session = Depends(get_db)):
    global MOCK_USERS_DB
    # 1. Blindagem de Duplicidade (Unique Violation Block)
    existing_user = next((u for u in MOCK_USERS_DB if u.email == user_in.email), None)
    if existing_user:
        raise HTTPException(status_code=400, detail="Este e-mail já pertence a outra conta.")
        
    # 2. Criação Física Mockada em RAM
    new_user = models.user.User(
        id=uuid.uuid4(),
        email=user_in.email,
        full_name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
        role=models.user.RoleEnum.customer,
        tenant_id=uuid.UUID("00000000-0000-0000-0000-000000000001") # Tenant Raiz para Clientes B2C
    )
    MOCK_USERS_DB.append(new_user)
    return {"message": "Conta de usuário forjada em Memória Volátil."}
        

