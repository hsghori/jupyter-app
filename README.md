# Jupyter App

A simple "file management" style app to experiment with serving jupyter notebooks from within a web application.

You will need to create two environment files to run this locally:

**.secrets.env**
```
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=db_name

SECRET_KEY=flask-secret-key
JUPYTERHUB_SECRET=jupyterhub-secret-key
```

**.env**

```
COMPOSE_PROJECT_NAME=example_name
```

(yes maybe this could've been checked in and you might not need it)


## Commands

- `make build`: Builds the docker containers
- `make up`: Starts the docker containers
- `make logs [service=service]`: Attaches to the logger - you can provide the optional `service` param to connect
  to a specific service
- `make stop`: Stops the docker containers
- `make down`: Tears down the docker containers - this will delete all of your data.
- `make shell`: Opens shell on the flask server

## Notes, known bugs, and quirks:

- This is not at all a finished product - lots does not work yet :) and there's a lot i haven't tested.
- You should log out before running `make down`. The auth management isn't great so the cookies aren't cleared when
  you run `make down`.
- I haven't tested creating subdirectories on jupyter (creating local subdirectories works but I'm not sure if the
  integration with the jupyter api is right)
- Log in takes a few seconds and there's no progress spinner. The jupyter server is started on login and that takes
  a bit of time


## Resources

- [Medium article](https://medium.com/@t.forey/embedding-a-jupyter-notebook-65d79ad8e111)
- [JupyterHub REST API](https://petstore3.swagger.io/?url=https://raw.githubusercontent.com/jupyterhub/jupyterhub/HEAD/docs/rest-api.yml#%21/default)
- [Jupyter server REST API](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/jupyter_server/master/jupyter_server/services/api/api.yaml#/)
- [Jupyter server github](https://github.com/jupyter-server/jupyter_server)
