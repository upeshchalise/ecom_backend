FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build 


FROM node:20-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev  

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/swaggerApi.json ./swaggerApi.json

COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

EXPOSE 4000

CMD [ "npm", "run", "start" ]

