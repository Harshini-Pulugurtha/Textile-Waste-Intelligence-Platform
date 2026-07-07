from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.database import get_db
from app.dependencies import get_current_user
from app.models import TextileInventory, User

router = APIRouter()


# =====================================
# Dashboard Statistics
# =====================================
@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    total_inventory = db.query(TextileInventory).count()

    total_quantity = (
        db.query(func.sum(TextileInventory.quantity))
        .scalar()
    ) or 0

    fabric_types = (
        db.query(TextileInventory.fabric_type)
        .distinct()
        .count()
    )

    today_entries = (
        db.query(TextileInventory)
        .filter(
            TextileInventory.collection_date == date.today()
        )
        .count()
    )

    recent_inventory = (
        db.query(TextileInventory)
        .order_by(TextileInventory.id.desc())
        .limit(5)
        .all()
    )

    return {
        "total_inventory": total_inventory,
        "total_quantity": total_quantity,
        "fabric_types": fabric_types,
        "today_entries": today_entries,
        "recent_inventory": recent_inventory
    }