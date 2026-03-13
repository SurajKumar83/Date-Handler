FROM node:20-alpine AS base
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install

COPY angular/package*.json ./angular/
RUN cd angular && npm install

COPY . .

EXPOSE 5000 4200
CMD ["sh", "-c", "cd server && npm run dev"]
