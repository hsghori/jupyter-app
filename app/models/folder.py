from app import db
from sqlalchemy import ForeignKey, Index, UniqueConstraint


class Folder(db.Model):
    __tablename__ = "folder"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    parent_folder_id = db.Column(db.Integer, ForeignKey("folder.id", ondelete="CASCADE"), nullable=True)
    parent_folder = db.relationship(
        "Folder", back_populates="child_folders", remote_side=[id], foreign_keys=[parent_folder_id]
    )
    child_folders = db.relationship(
        "Folder",
        back_populates="parent_folder",
        foreign_keys="Folder.parent_folder_id",
        cascade="all, delete",
    )
    files = db.relationship("File", back_populates="folder", cascade="all, delete")

    __table_args__ = (
        Index("folder_parent_folder_id_idx", "parent_folder_id"),
        UniqueConstraint("parent_folder_id", "name", name="folder_parent_folder_id_name_key"),
    )

    def __init__(self, name, parent_folder=None):
        super().__init__()
        self.name = name
        self.parent_folder = parent_folder

    @property
    def contents(self):
        return self.child_folders + self.files

    def get_path(self):
        curr = self
        path = [curr]
        while curr.parent_folder is not None:
            curr = curr.parent_folder
            path.append(curr)
        return "/".join([f.name for f in path][::-1])

    def to_json(self):
        return {"id": self.id, "name": self.name, "empty": len(self.contents) == 0, "type": "folder"}
