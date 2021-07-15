from flask import Flask
from flask_login import LoginManager

from . import db
from .api.blueprint import api_blueprint
from .config import DATABASE_URL, SECRET_KEY


def create_app():
    flask_app = Flask(__name__)
    flask_app.secret_key = SECRET_KEY
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    flask_app.app_context().push()
    flask_app.register_blueprint(api_blueprint)
    db.init_app(flask_app)
    login_manager = LoginManager()
    login_manager.init_app(flask_app)
    db.create_all()

    from .models.user import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return flask_app
