import os

user = os.environ['POSTGRES_USER']
password = os.environ['POSTGRES_PASSWORD']
host = os.environ['POSTGRES_HOST']
database = os.environ['POSTGRES_DB']
port = os.environ['POSTGRES_PORT']

DATABASE_URL = f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}'
SECRET_KEY = os.environ['SECRET_KEY']
JUPYTERHUB_SECRET = os.environ["JUPYTERHUB_SECRET"]
