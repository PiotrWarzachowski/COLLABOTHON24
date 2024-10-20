"""Add table with tags

Revision ID: 985d18be17b4
Revises: 77726448f0a2
Create Date: 2024-10-19 10:07:08.826741

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '985d18be17b4'
down_revision: Union[str, None] = '77726448f0a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transactions_with_tag',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('amount', sa.Integer(), nullable=False),
    sa.Column('recipient', sa.String(length=100), nullable=True),
    sa.Column('title', sa.String(length=100), nullable=True),
    sa.Column('sender', sa.String(length=100), nullable=True),
    sa.Column('tag', sa.String(length=100), nullable=True),
    sa.Column('currency_id', sa.Integer(), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['currency_id'], ['currency.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transactions_with_tag')
    # ### end Alembic commands ###
