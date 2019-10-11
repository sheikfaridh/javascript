const express = require('express');
const express_graphql = require('express-graphql');
const {buildSchema} = require('graphql');

//GraphQL Schema
const schema = buildSchema(`
      type Query{
          message: String
      }
`);

//Root resolver
const rootValue = {
    message:()=>'Hello world'
};

//Create an express server and a graphql endpoint
const app = express();
app.use('/graphql',express_graphql({
  schema,
  rootValue,
  graphiql:true
}))

const {PORT = 3000} = process.env;
app.listen(PORT,()=>console.log(`The Server is running on the port ${PORT}`));
