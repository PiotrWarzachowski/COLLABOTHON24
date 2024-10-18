"""Initial

Revision ID: 77726448f0a2
Revises: 
Create Date: 2024-10-18 23:05:29.673988

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '77726448f0a2'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('currency',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('curr', sa.String(length=100), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('amount', sa.Integer(), nullable=False),
    sa.Column('recipient', sa.String(length=100), nullable=True),
    sa.Column('title', sa.String(length=100), nullable=True),
    sa.Column('sender', sa.String(length=100), nullable=True),
    sa.Column('currency_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['currency_id'], ['currency.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transactions')
    op.drop_table('currency')
    # ### end Alembic commands ###