FROM node:20-alpine3.18
WORKDIR /application
COPY ./ /application
RUN apk add envsubst jq curl doctl
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin
RUN npm install
# RUN npm run test
ENTRYPOINT [ "/application/scripts/deploy.sh" ]