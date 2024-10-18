from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, relationship
from datetime import datetime, timezone


class Base(DeclarativeBase):
    pass


metadata = Base.metadata


class Transactions(Base):
    __tablename__ = "Transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    value = Column(Integer, nullable=False)
    recipient = Column(String(100))
    sender = Column(String(100))
    currency_id = Column(Integer, ForeignKey("Currency.id"))
    date = Column(DateTime, default=datetime.now(timezone.utc))


class Currency(Base):
    __tablename__ = "Currency"
    id = Column(Integer, primary_key=True, autoincrement=True)
    currency = Column(String(100))

    transactions = relationship("Transactions", back_populates="currency")