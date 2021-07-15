FROM jupyterhub/jupyterhub:1.4.1

# Copy the JupyterHub configuration in the container
COPY jupyterhub_config.py /srv/jupyterhub/
COPY jupyter_notebook_config.py /etc/jupyter/
COPY custom.js /etc/jupyter/custom/

# Install dependencies (for advanced authentication and spawning)
RUN pip install \
    dockerspawner==0.10.0 \
    oauthenticator==0.8.0
