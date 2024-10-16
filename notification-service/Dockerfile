FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY eslint.config.mjs ./
COPY src ./src
COPY scripts ./scripts
RUN npm i
RUN npm run build

EXPOSE 4001
CMD [ "npm", "run", "prod:start" ]
