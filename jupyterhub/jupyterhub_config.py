import os

from dockerspawner import DockerSpawner


class EnvDockerSpawner(DockerSpawner):
    def get_env(self):
        env = super().get_env()
        user_options_env = self.user_options.get("env", {})
        env.update(user_options_env)
        return env


c.LocalAuthenticator.create_system_users = True
c.JupyterHub.spawner_class = EnvDockerSpawner
c.DockerSpawner.image = os.environ["DOCKER_JUPYTER_IMAGE"]
c.DockerSpawner.network_name = os.environ["DOCKER_NETWORK_NAME"]
c.DockerSpawner.debug = True
c.Spawner.args = [
    "--NotebookApp.tornado_settings={}".format(
        {
            "headers": {
                "Content-Security-Policy": "frame-ancestors 'self' http://localhost:3000 http://localhost; report-uri /api/security/csp-report"
            }
        }
    )
]
c.DockerSpawner.args = [
    "--NotebookApp.tornado_settings={}".format(
        {
            "headers": {
                "Content-Security-Policy": "frame-ancestors 'self' http://localhost:3000 http://localhost; report-uri /api/security/csp-report"
            }
        }
    )
]
c.JupyterHub.hub_ip = os.environ["HUB_IP"]
c.JupyterHub.services = [{"name": "my-app", "api_token": os.environ["JUPYTERHUB_SECRET"], "admin": True}]
c.JupyterHub.tornado_settings = {
    "headers": {
        "Content-Security-Policy": "frame-ancestors 'self' http://localhost:3000 http://localhost; report-uri /api/security/csp-report"
    }
}
