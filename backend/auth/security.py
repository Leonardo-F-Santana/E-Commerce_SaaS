from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import logging

logger = logging.getLogger("uvicorn.error")

# ATENÇÃO: Carregar do .env em produção
SECRET_KEY = "SUACHAVESECRETASUPERSEGURAPRODUCAO"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 dia

# Configuração Padrão do BCrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica a senha."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hasheamento Bcrypt seguro com Patching contra o Limite de 72 Bytes C-Module"""
    try:
        # Converte para bytes UTF-8 para fatiamento absoluto de buffer
        password_bytes = password.encode('utf-8')[:72]
        
        # Descodifica ignorando pedaços zumbis para a lib processar sem CRASH
        safe_password_string = password_bytes.decode('utf-8', 'ignore')
        return pwd_context.hash(safe_password_string)
    except Exception as e:
        logger.error(f"[SECURITY SHIELD - BCRYPT CRASH]: Tentativa de Hash Falhou com a biblioteca passlib: {e}")
        # A exceção é barrada para evitar Freeze e devolvida em escopo manejável
        raise ValueError("O Motor de Criptografia colapsou ao processar os caracteres informados.")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Criação do Token JWT. O dicionário 'data' passará informações vitais,
    em especial o 'tenant_id' que servirá como chave-mestra do isolamento
    garantido pela classe TenantAwareBase do banco.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
