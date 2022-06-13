FROM node:14-slim

WORKDIR /app
# ADD package.json package-lock.json /app/
# ENV NPM_CONFIG_LOGLEVEL info
# RUN npm install --unsafe-perm

ADD . /app/
RUN npm install
RUN npm run build

EXPOSE 8080

# Run the image as a non-root user
# RUN adduser --disabled-login --gecos '' appuser
# USER appuser

# ENV NODE_ENV production

# CMD npm start
CMD ["npm", "start"]
