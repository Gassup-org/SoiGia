FROM node:20-alpine

WORKDIR /repo

COPY packages/tsconfig ./packages/tsconfig
COPY apps/web/package.json ./apps/web/package.json

WORKDIR /repo/apps/web
RUN npm install

WORKDIR /repo
COPY apps/web ./apps/web

EXPOSE 5173

WORKDIR /repo/apps/web
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
