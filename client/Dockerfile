FROM node:15.4.0-alpine

EXPOSE 3000
EXPOSE 8000

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
RUN npm install react-scripts@3.4.1 -g
COPY . /app/
