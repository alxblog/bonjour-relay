FROM node:20-alpine

WORKDIR /app
COPY . .

# Update apk packages to reduce vulnerabilities
RUN apk update && apk upgrade && npm install

EXPOSE 8080
CMD ["node", "index.js"]
