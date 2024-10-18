from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, relationship
from datetime import datetime, timezone


class Base(DeclarativeBase):
    pass


metadata = Base.metadata


class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    amount = Column(Integer, nullable=False)
    recipient = Column(String(100))
    title = Column(String(100))
    sender = Column(String(100))
    currency_id = Column(Integer, ForeignKey("currency.id"))
    date = Column(DateTime, default=datetime.now(timezone.utc))


class Currency(Base):
    __tablename__ = "currency"
    id = Column(Integer, primary_key=True, autoincrement=True)
    curr = Column(String(100))

    transactions = relationship("transactions", back_populates="currency")