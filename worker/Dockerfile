FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
# Draait eenmalig en stopt. Plan het dagelijks in Coolify (Scheduled Tasks).
CMD ["npm", "run", "ingest"]
