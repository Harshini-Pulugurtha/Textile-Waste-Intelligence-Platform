from fastapi import APIRouter
from app.database import SessionLocal
from app.models import TextileAnalysis
from fastapi import HTTPException

router = APIRouter(prefix="/analysis", tags=["Analysis History"])


@router.get("/history")
def get_analysis_history():

    db = SessionLocal()

    try:

        analyses = (
            db.query(TextileAnalysis)
            .order_by(TextileAnalysis.created_at.desc())
            .all()
        )

        return analyses


    finally:
        db.close()
@router.delete("/history/{analysis_id}")
def delete_analysis(analysis_id: int):

    db = SessionLocal()

    try:

        analysis = (
            db.query(TextileAnalysis)
            .filter(TextileAnalysis.id == analysis_id)
            .first()
        )

        if analysis is None:
            raise HTTPException(
                status_code=404,
                detail="Analysis not found"
            )

        db.delete(analysis)
        db.commit()

        return {
            "message": "Analysis deleted successfully"
        }

    finally:
        db.close()