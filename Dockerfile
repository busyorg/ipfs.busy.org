FROM node:8.2.0

ENV PORT 80
ENV NODE_ENV production

RUN apt-get update
RUN apt-get install -y graphicsmagick
RUN npm install -g yarn

WORKDIR /usr/src/app

ADD package.json yarn.lock /usr/src/app/

RUN yarn install --non-interactive --frozen-lockfile

COPY . /usr/src/app

EXPOSE 80
CMD ["yarn", "run", "deploy"]
