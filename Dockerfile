FROM node:20-alpine3.18
WORKDIR /application
COPY ./ /application
RUN apk add envsubst jq curl
RUN  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
RUN sh /application/scripts/source_config.sh
RUN npm install
RUN npm run build
# RUN npm run test
CMD npm run start