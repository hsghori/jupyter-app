FROM jupyter/scipy-notebook:hub-1.4.1

USER root

RUN apt-get update -y && \
    apt-get install libpq-dev -y

USER $NB_UID

COPY ./custom.js ./.jupyter/custom/
COPY ./requirements.txt ./requirements.txt

RUN conda install --file ./requirements.txt
