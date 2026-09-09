from fastapi import Depends, HTTPException, status

from app.dependencies.auth import get_current_user
from app.models.user import User


def require_active_user(
    user: User = Depends(get_current_user),
) -> User:
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


def require_role(*allowed_roles: str):
    def role_checker(
        user: User = Depends(get_current_user),
    ) -> User:
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return user

    return role_checker


def require_admin(
    user: User = Depends(require_role("admin")),
) -> User:
    return user


def require_physician(
    user: User = Depends(require_role("physician")),
) -> User:
    return user


def require_patient(
    user: User = Depends(require_role("patient")),
) -> User:
    return user