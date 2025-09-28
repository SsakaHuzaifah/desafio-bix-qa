FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package.json ./backend/
RUN cd backend && npm install --omit=dev

FROM node:20-alpine AS app
WORKDIR /app
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
EXPOSE 3000
CMD ["node", "backend/server.js"]
