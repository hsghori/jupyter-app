import re

from app import db
from app.api.blueprint import api_blueprint
from app.jupyter.jupyterhub import JupyterException, JupyterHubClient
from app.models import File, Folder
from flask import request
from flask_login import current_user
from flask_login.utils import login_required

camel_case_pattern = re.compile(r"(?<!^)(?=[A-Z])")


@api_blueprint.route("/folder", methods=["POST"])
def create_folder():
    name = request.json["name"]
    folder_id = request.json["parentFolderId"]
    parent_folder = Folder.query.get(folder_id)
    if parent_folder is None:
        return {"error": f"Parent folder {folder_id} does not exist exists"}, 400
    if Folder.query.filter(Folder.parent_folder == parent_folder, Folder.name == name).count() > 0:
        return {"error": f"Folder {name} already exists"}, 400
    folder = Folder(name, parent_folder=parent_folder)
    try:
        jupyterhub_client = JupyterHubClient()
        jupyterhub_client.create_folder()
    except JupyterException as e:
        return {"error": str(e)}, 400

    db.session.add(folder)
    db.session.commit()

    return folder.to_json()


@api_blueprint.route("/file", methods=["POST"])
def create_file():
    name = request.json["name"]
    folder_id = request.json["parentFolderId"]
    folder = Folder.query.get(folder_id)
    if folder is None:
        return {"error": f"Parent folder {folder_id} does not exist exists"}, 400
    if File.query.filter(File.folder == folder, File.name == name).count() > 0:
        return {"error": f"File {name} already exists"}, 400
    file = File(name, folder)
    db.session.add(file)
    db.session.commit()

    return file.to_json()


@api_blueprint.route("/folder/<folder_id>", methods=["GET"])
def get_folder(folder_id):
    folder = Folder.query.get(folder_id)
    if folder is None:
        return {"error": "Not found"}, 404

    return folder.to_json()


@api_blueprint.route("/contents/<folder_id>", methods=["GET"])
def get_contents(folder_id):
    folder = Folder.query.get(folder_id)

    return {"contents": [c.to_json() for c in folder.contents]}


@api_blueprint.route("/file/<file_id>", methods=["GET"])
@login_required
def open_file(file_id):
    file = File.query.get(file_id)
    if file is None:
        return {"error": "Not found"}, 404

    jupyterhub_client = JupyterHubClient()
    try:
        notebook_url = jupyterhub_client.get_notebook(current_user, file)
    except JupyterException as e:
        return {"error": str(e)}, 400
    return {"id": file.id, "name": file.name, "notebookUrl": notebook_url}


@api_blueprint.route("/file/<file_id>", methods=["POST"])
@login_required
def save_file(file_id):
    file = File.query.get(file_id)
    if file is None:
        return {"error": "Not found"}, 404

    jupyterhub_client = JupyterHubClient()
    try:
        notebook_url = jupyterhub_client.save_notebook(current_user, file)
    except JupyterException as e:
        return {"error": str(e)}, 400
    return {"id": file.id, "name": file.name, "notebookUrl": notebook_url}
