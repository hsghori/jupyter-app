from app import db
from sqlalchemy import ForeignKey, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB


class File(db.Model):
    __tablename__ = "file"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    folder_id = db.Column(db.Integer, ForeignKey("folder.id", ondelete="CASCADE"))
    folder = db.relationship("Folder", back_populates="files", foreign_keys=[folder_id])
    contents = db.Column(JSONB, nullable=True)

    __table_args__ = (
        Index("file_folder_id_idx", "folder_id"),
        UniqueConstraint("folder_id", "name", name="file_folder_id_name_key"),
    )

    def __init__(self, name, folder, contents=None):
        super().__init__()
        self.name = name
        self.folder = folder
        self.contents = contents

    def to_json(self):
        return {"id": self.id, "name": self.name, "type": "file"}

    def get_path(self):
        return f"{self.folder.get_path()}/{self.name}.ipynb"
