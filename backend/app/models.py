from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from datetime import datetime


from .database import Base


# ===========================
# User Table
# ===========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    # Nullable because Google users don't have a local password
    password = Column(
        String,
        nullable=True
    )

    # Roles:
    # recycling_operator
    # sustainability_manager
    # manufacturer
    # admin
    role = Column(
    String,
    nullable=True
)

    organization = Column(
        String,
        nullable=True
    )

    # local / google
    auth_provider = Column(
        String,
        nullable=False,
        default="local"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ===========================
# Textile Inventory Table
# ===========================
class TextileInventory(Base):
    __tablename__ = "textile_inventory"

    id = Column(Integer, primary_key=True, index=True)

    waste_batch_id = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    fabric_type = Column(String, nullable=False)

    source = Column(String, nullable=False)

    quantity = Column(Float, nullable=False)

    color = Column(String)

    condition = Column(String)

    collection_date = Column(Date)

    created_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class TextileAnalysis(Base):
    __tablename__ = "textile_analysis"

    id = Column(Integer, primary_key=True, index=True)

    image_name = Column(String, nullable=False)
    # AI Analysis
    color = Column(String)

    texture = Column(String)

    pattern = Column(String)

    condition = Column(String)

    damage = Column(String)

    contamination = Column(String)

    material = Column(String)

    quality = Column(String)

    # Waste Intelligence
    waste_category = Column(String)

    recyclability = Column(String)

    recommendation = Column(String)

    textile_score = Column(Integer)

    grade = Column(String)



    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )