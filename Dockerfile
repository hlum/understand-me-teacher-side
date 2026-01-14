FROM node:20-alpine
WORKDIR /app

ENV NODE_OPTIONS="--dns-result-order=ipv4first"

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# install a lightweight web server
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
