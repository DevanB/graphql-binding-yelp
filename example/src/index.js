const { Yelp } = require('graphql-binding-yelp');
const { GraphQLServer } = require('graphql-yoga');
const { importSchema } = require('graphql-import');

const favoriteBusinesses = [
  { term: 'Wawa', city: 'Winter Garden, FL' },
  { name: '7-Eleven', city: 'Winter Garden, FL' }
];

const apiKey = process.env.YELP_API_KEY || '';
const yelp = new Yelp(apiKey);

const typeDefs = importSchema('schemas/app.graphql');
const resolvers = {
  Query: {
    hello: (parent, { name }) => `Hello ${name || 'World!'}`,
    favoriteBusinesses: (parent, args, context, info) => {
      return Promise.all(favoriteBusinesses.map(args => yelp.delegate('query', 'search', args, context, info)));
    }
  }
};

const server = new GraphQLServer({ resolvers, typeDefs });
server.start(() => console.log('Server running on http://localhost:4000'));
