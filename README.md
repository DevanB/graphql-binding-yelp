# GraphQL Binding for GitHub

Embed Yelp's GraphQL API into your server application

## Install

```sh
yarn add graphql-binding-yelp
```

## Example ([Demo @TODO](@TODO))

See [example directory](example) for full example application.

```js
const { Yelp } = require('graphql-binding-yelp');
const { GraphQLServer } = require('graphql-yoga');
const { importSchema } = require('graphql-import');

const favoriteBusinesses = [
  { term: 'Wawa', location: 'Winter Garden, FL' },
  { term: '7-Eleven', location: 'Winter Garden, FL' }
];

const apiKey = '__ENTER_YOUR_YELP_API_KEY__';
const yelp = new Yelp(apiKey);

const typeDefs = importSchema('schemas/app.graphql');
const resolvers = {
  Query: {
    hello: (parent, { name }) => `Hello ${ name || 'world!' }`,
    favoriteBusinesses: (parent, args, context, info) => {
      return Promise.all(
        favoriteBusinesses.map(args =>
          yelp.delegate('query', 'search', args, context, info),
        )
      )
    }
  }
};

const server = new GraphQLServer({ resolvers, typeDefs })
server.start(() => console.log('Server running on http://localhost:4000'))
```

## How to create a Yelp API Key

You’ll need to create a client, join the beta program, and grab the API key from your client settings.
