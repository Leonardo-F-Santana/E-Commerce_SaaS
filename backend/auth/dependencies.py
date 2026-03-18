from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from uuid import UUID
from .security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_tenant_id(token: str = Depends(oauth2_scheme)) -> UUID:
    """
    Dependência do FastAPI que intercepta Requisições, decodifica o JWT
    e extrai o tenant_id. Se falhar, retorna erro 401.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais de tenant inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        tenant_id_str = payload.get("tenant_id")
        if tenant_id_str is None:
            raise credentials_exception
        
        # Converte para Obj UUID do Python
        return UUID(tenant_id_str)
    except (JWTError, ValueError):
        raise credentials_exception

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> UUID:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais de usuário inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        return UUID(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception
