from app import db
from flask_login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    jupyterhub_token = db.Column(db.String(100), nullable=False)

    def __init__(self, username, password):
        super().__init__()
        self.username = username
        self.password = password
