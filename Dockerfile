FROM node as build
WORKDIR /application
COPY ./ /application
RUN npm install
RUN npm run build