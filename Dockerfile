FROM node:20-alpine3.18
WORKDIR /application
COPY ./ /application
RUN apk add envsubst
RUN sh /application/scripts/source_config.sh
RUN npm install
RUN npm run build
# RUN npm run test
CMD npm run start