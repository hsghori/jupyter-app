from app import db
from app.jupyter.jupyterhub import JupyterException, JupyterHubClient
from app.models.folder import Folder
from app.models.user import User
from flask import Response, request, session
from flask_login import current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from .blueprint import api_blueprint


@api_blueprint.route("/signup", methods=["POST"])
def signup():
    username = request.json["username"]
    password = request.json["password"]
    if User.query.filter(User.username == username).count() > 0:
        return Response({"error": "User exists"}, status=400)
    root_folder = Folder.query.get(1)
    if root_folder is None:
        root_folder = Folder("work")
        db.session.add(root_folder)
    user = User(username=username, password=generate_password_hash(password, method="sha256"))
    jupyterhub_client = JupyterHubClient()
    try:
        jupyterhub_client.create_user(user)
        token = jupyterhub_client.create_user_token(user)
        user.jupyterhub_token = token
    except JupyterException as e:
        return {"error": str(e)}, 400
    db.session.add(user)
    db.session.commit()

    return {"id": user.id}


@api_blueprint.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter(User.username == username).one_or_none()
    if not user or not check_password_hash(user.password, password):
        return {"error": "Invalid credentials"}, 400

    jupyterhub_client = JupyterHubClient()
    server_started = jupyterhub_client.start_server(user)
    root_folder = Folder.query.get(1)
    assert root_folder is not None
    try:
        root_folder_exists = jupyterhub_client.folder_exists(user, root_folder)
    except JupyterException as e:
        return {"error": str(e)}, 400

    if not root_folder_exists:
        jupyterhub_client.create_folder(user, root_folder)

    login_user(user, remember=True)

    return {"sessionId": session["_id"], "serverStarted": server_started}


@api_blueprint.route("/logout", methods=["POST"])
def logout():
    jupyterhub_client = JupyterHubClient()
    response = {}
    if current_user.is_authenticated:
        try:
            jupyterhub_client.end_server(current_user)
        except JupyterException as e:
            response = {"error": str(e)}

    logout_user()
    return response
