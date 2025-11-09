from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.entry import EntryRead, EntryCreate, EntryUpdate
from app.models.entry import DailyEntry
from app.db.database import get_session
from app.core.auth import get_current_user
from typing import Dict, List

router = APIRouter(
    prefix="/entry",
    tags=["entry"]
)

#currently this creates an entry, but it's just a string
@router.post("/create", response_model=EntryRead)
def create_entry(entry: EntryCreate, session = Depends(get_session), current_user: Dict = Depends(get_current_user)) -> DailyEntry:
    clerk_user_id = current_user["sub"]
    db_entry = DailyEntry(entry=entry.entry, clerk_user_id=clerk_user_id)
    session.add(db_entry)
    session.commit()
    session.refresh(db_entry)
    return db_entry

#this gets all entries for the current user
@router.get("/all", response_model=List[EntryRead])
def get_all_entries(current_user: Dict = Depends(get_current_user), session = Depends(get_session)) -> List[DailyEntry]:
    clerk_user_id = current_user["sub"]
    db_entry = session.query(DailyEntry).filter(DailyEntry.clerk_user_id == clerk_user_id).all()

    if not db_entry:
        raise HTTPException(status_code=404, detail="No entries found")
    return db_entry

#this gets an individual entry by id
@router.get("/{id}", response_model=EntryRead)
def get_entry(id: int, current_user: Dict = Depends(get_current_user), session = Depends(get_session)) -> DailyEntry:
    clerk_user_id = current_user["sub"]
    db_entry = session.query(DailyEntry).filter(DailyEntry.id == id, DailyEntry.clerk_user_id == clerk_user_id).first()

    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return db_entry

#this deletes an entry by id (this might not be necessary, but it's here for testing purposes)
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(id: int, current_user: Dict = Depends(get_current_user), session = Depends(get_session)):
    clerk_user_id = current_user["sub"]
    db_entry = session.query(DailyEntry).filter(DailyEntry.id == id, DailyEntry.clerk_user_id == clerk_user_id).first()

    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    session.delete(db_entry)
    session.commit()
    return None

#this updates an entry by id
@router.put("/{id}", response_model=EntryRead)
def update_entry(id: int, entry_update: EntryUpdate, current_user: Dict = Depends(get_current_user), session = Depends(get_session)) -> DailyEntry:
    clerk_user_id = current_user["sub"]
    db_entry = session.query(DailyEntry).filter(DailyEntry.id == id, DailyEntry.clerk_user_id == clerk_user_id).first()

    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    if entry_update.entry is not None:
        db_entry.entry = entry_update.entry
    
    session.commit()
    session.refresh(db_entry)
    return db_entry