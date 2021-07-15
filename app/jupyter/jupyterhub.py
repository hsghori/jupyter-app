from time import sleep

import requests
from app.config import JUPYTERHUB_SECRET
from app.models.file import File
from app.models.folder import Folder
from app.models.user import User


class JupyterException(Exception):
    pass


class JupyterHubClient:
    URL = "http://jupyterhub:8000/hub/api"
    NOTEBOOK_URL = "http://jupyterhub:8000/"

    def __init__(self):
        self.headers = {
            "Authorization": f"Token {JUPYTERHUB_SECRET}",
            "Content-Type": "application/json",
        }

    def _get_notebook_server_header(self, user):
        return {
            "Authorization": f"Token {user.jupyterhub_token}",
            "Content-Type": "application/json",
        }

    def create_user(self, user: User):
        if self.user_exists(user):
            return
        rv = requests.post(f"{self.URL}/users/{user.username}", headers=self.headers)
        if rv.status_code != 201:
            raise JupyterException(rv.json())

    def user_exists(self, user: User):
        rv = requests.get(f"{self.URL}/users/{user.username}", headers=self.headers)
        if rv.status_code == 404:
            return False
        elif rv.status_code == 200:
            return True
        else:
            raise JupyterException(rv.json())

    def create_user_token(self, user: User):
        rv = requests.post(f"{self.URL}/users/{user.username}/tokens", headers=self.headers)
        if rv.status_code not in {200, 201}:
            raise JupyterException(rv)
        token = rv.json()["token"]
        return token

    def start_server(self, user: User):
        counter = 0
        while counter < 100:
            rv = requests.post(
                f"{self.URL}/users/{user.username}/server",
                headers=self._get_notebook_server_header(user),
            )
            if rv.status_code == 201:
                return True
            elif rv.status_code >= 300:
                return False
            sleep(0.1)
            counter += 1
        return False

    def end_server(self, user: User):
        rv = requests.delete(
            f"{self.URL}/users/{user.username}/server",
            headers=self._get_notebook_server_header(user),
        )
        if rv.status_code >= 300:
            raise JupyterException(rv.json())

    def folder_exists(self, user: User, folder: Folder):
        rv = requests.get(
            f"{self.NOTEBOOK_URL}/user/{user.username}/api/contents/{folder.get_path()}",
            headers=self._get_notebook_server_header(user),
        )
        if rv.status_code == 200:
            return True
        elif rv.status_code == 404:
            return False
        raise JupyterException(rv.json())

    def create_folder(self, user: User, folder: Folder):
        rv = requests.put(
            f"{self.NOTEBOOK_URL}/user/{user.username}/api/contents/{folder.get_path()}",
            data={
                "name": folder.name,
                "path": folder.get_path(),
                "type": "directory",
            },
            headers=self._get_notebook_server_header(user),
        )
        if rv.status_code >= 300:
            raise JupyterException(rv.json())

    def get_noteboo(self, user: User, file: File, get_contents=False):
        rv = requests.get(
            f"{self.NOTEBOOK_URL}/user/{user.username}/api/contents/{file.get_path()}?contents={1 if get_contents else 0}",
            headers=self._get_notebook_server_header(user),
        )
        if rv.status_code == 200:
            return rv.json()
        elif rv.status_code == 404:
            return None
        raise JupyterException(rv.json())

    def save_notebook(self, user: User, file: File):
        notebook = self.get_noteboo(user, file, get_contents=True)
        if notebook is None:
            raise JupyterException({"error": "Cannot save a notebook that doesn't exist"})

        file.contents = notebook["contents"]

    def get_notebook(self, user: User, file: File):
        notebook = self.get_noteboo(user, file)
        request_args = {
            "name": f"{file.name}.ipynb",
            "path": file.get_path(),
            "type": "notebook",
        }
        if notebook is not None:
            request_args.update({"content": file.contents, "format": "json"})
        rv = requests.put(
            f"{self.NOTEBOOK_URL}/user/{user.username}/api/contents/{file.get_path()}",
            json=request_args,
            headers=self._get_notebook_server_header(user),
        )
        if rv.status_code >= 300:
            ex = {"req": "create notebook"}
            ex.update(rv.json())
            raise JupyterException(ex)

        return f"http://localhost:8000/user/{user.username}/notebooks/{file.get_path()}?token={user.jupyterhub_token}"
