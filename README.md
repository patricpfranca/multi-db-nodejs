docker run \
  --name postgres \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=heroes \
  -p 5432:5432 \
  -d \
  postgres

docker ps
docker exec -it postgres /bin/bash

docker run \
  --name adminer \
  -p 8080:8080 \
  --link postgres:postgres \
  -d \
  adminer

docker run \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=root \
  -d \
  mongo:4

docker run \
  --name mongoclient \
  -p 3000:3000 \
  --link mongodb:mongodb \
  -d \
  mongoclient/mongoclient

docker exec -it multi-db-nodejs_mongoclient_1 \
  mongo --host localhost -u root -p root --authenticationDatabase admin \
  --eval "db.getSiblingDB('heroes').createUser({user: 'patric', pwd: 'root', roles: [{role: 'readWrite', db: 'heroes'}]})"