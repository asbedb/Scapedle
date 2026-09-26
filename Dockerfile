FROM node:current-alpine3.23

RUN apk add --no-cache bash git ca-certificates curl util-linux tzdata
RUN npm install -g pnpm@11.1.2
RUN mkdir -p /work /state /pnpm-store && chown node:node /work /state /pnpm-store
COPY --chmod=755 scripts/deploy.sh /usr/local/bin/deploy

USER node
WORKDIR /work
ENV TZ=Australia/Sydney \
	CI=true

ENTRYPOINT ["deploy"]
CMD ["daily"]
