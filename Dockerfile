FROM node

COPY ./ /application
RUN npm build