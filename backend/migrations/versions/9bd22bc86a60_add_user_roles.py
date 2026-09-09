"""add user roles

Revision ID: 9bd22bc86a60
Revises: e96c62ff1f2c
Create Date: 2026-09-07 23:32:49.783033

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9bd22bc86a60"
down_revision: Union[str, Sequence[str], None] = "e96c62ff1f2c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.String(length=50),
            nullable=False,
            server_default="patient",
        ),
    )
    op.create_index(
        "ix_users_role",
        "users",
        ["role"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_users_role", table_name="users")
    op.drop_column("users", "role")