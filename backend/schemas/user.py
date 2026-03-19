from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "customer"

class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    role: str
    tenant_id: UUID

    class Config:
        orm_mode = True
