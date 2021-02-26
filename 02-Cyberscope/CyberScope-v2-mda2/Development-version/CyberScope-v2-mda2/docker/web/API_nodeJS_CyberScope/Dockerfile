FROM node:latest
ADD  package*.json /app/

WORKDIR /app

ADD . .

#RUN npm rebuild bcrypt --update-binary

RUN npm install


EXPOSE 4000
#EXPOSE 27017


CMD node index.js