FROM node:22
WORKDIR /workdir

COPY . .
WORKDIR /workdir/slot-app
RUN npm install
CMD ["npm", "run", "dev"]
EXPOSE 3000