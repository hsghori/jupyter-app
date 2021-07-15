FROM ubuntu:18.04

RUN apt-get update -y && \
    apt-get install software-properties-common -y && \
    add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update -y && \
    apt-get install libpq-dev python3.8 python3-pip -y

COPY ./requirements.txt /app/requirements.txt

RUN pip3 install --upgrade pip
RUN pip3 install -r app/requirements.txt

COPY . /app
EXPOSE 5000
EXPOSE 8080
ENV FLASK_ENV=development
ENV FLASK_APP=app.base_app
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
