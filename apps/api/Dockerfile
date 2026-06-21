FROM node:20-alpine

WORKDIR /repo

COPY packages/tsconfig ./packages/tsconfig
COPY apps/api/package.json ./apps/api/package.json

WORKDIR /repo/apps/api
RUN npm install

WORKDIR /repo
COPY apps/api ./apps/api

EXPOSE 3000

WORKDIR /repo/apps/api
CMD ["npm", "run", "dev"]
