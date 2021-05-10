const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');

const schema = require('./schema.js');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema,
}));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
