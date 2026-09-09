"""add physician to consent

Revision ID: 1f2324250fd3
Revises: f8eb59352664
Create Date: 2026-09-09 18:56:06.009923
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "1f2324250fd3"
down_revision: Union[str, Sequence[str], None] = "f8eb59352664"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "consents",
        sa.Column(
            "physician_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_index(
        op.f("ix_consents_physician_id"),
        "consents",
        ["physician_id"],
        unique=False,
    )

    op.create_foreign_key(
        "fk_consents_physician_id_physicians",
        "consents",
        "physicians",
        ["physician_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_consents_physician_id_physicians",
        "consents",
        type_="foreignkey",
    )

    op.drop_index(
        op.f("ix_consents_physician_id"),
        table_name="consents",
    )

    op.drop_column(
        "consents",
        "physician_id",
    )