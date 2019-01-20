const { Yelp } = require("graphql-binding-yelp");
const { GraphQLServer } = require("graphql-yoga");
const { importSchema } = require("graphql-import");

const favoriteBusinesses = [
  { term: "Wawa", location: "Winter Garden, FL" },
  { term: "7-Eleven", location: "Winter Garden, FL" }
];

const businessIds = [
  { id: "cvs-rogers" },
  { id: "cvs-pharmacy-bella-vista" },
  { id: "walgreens-rogers" }
];

const apiKey = process.env.YELP_API_KEY || "";
const yelp = new Yelp(apiKey);

const typeDefs = importSchema("schemas/app.graphql");
const resolvers = {
  Query: {
    hello: (parent, { name }) => `Hello ${name || "World!"}`,
    favoriteBusinesses: (parent, args, context, info) => {
      return Promise.all(
        favoriteBusinesses.map(args =>
          yelp.delegate("query", "search", args, context, info)
        )
      );
    },
    otherBusinesses: (parent, args, context, info) => {
      return Promise.all(
        businessIds.map(args =>
          yelp.delegate("query", "business", args, context, info)
        )
      );
    }
  },
  ...yelp.remoteResolvers(typeDefs)
};

const server = new GraphQLServer({ resolvers, typeDefs });
server.start(() => console.log("Server running on http://localhost:4000"));
