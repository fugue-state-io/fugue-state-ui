FROM node:20-alpine3.18
WORKDIR /application
COPY ./ /application
RUN apk add envsubst jq curl doctl
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin
RUN --mount=type=secret,id=doctl,target=/root/.config/doctl/config.yaml --mount=type=secret,id=kube,target=/root/.kube/config \
    sh /application/scripts/source_config.sh
RUN npm install
RUN npm run build
# RUN npm run test
CMD npm run start