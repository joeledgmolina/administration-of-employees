# Administration of Employees

## To run this app:

## Install
### nvm (Node Version Manager)
[nvm](https://github.com/nvm-sh/nvm)
### run-rs
[run-rs](https://www.npmjs.com/package/run-rs)
` npm install run-rs -g `
### mongo-express
[mongo-express](https://www.npmjs.com/package/mongo-express)
` npm install -g mongo-express `
### Download npm dependencies
At the project root folder run
` npm install `

## Run
### Start mongodb with replica sets
` run-rs `
### Start node app
` npm run dev `

You should be able to see the app running at [http://localhost:3000/graphql](http://localhost:3000/graphql)

## Extras
### To interact with mongodb you can use mongo-express
` mongo-express -U "mongodb://localhost:27017,localhost:27018,localhost:27019/example?replicaSet=rs" `

You should be able to interact with mongodb at [http://localhost:8081/](http://localhost:8081/)


### the folder querys_and_mutations contains a file with examples to test functionality