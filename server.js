var express = require('express');
var graphqlHTTP = require('express-graphql');
// var { buildSchema } = require('graphql');
var graphql = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type RandomDie {
//     numSides: Int!
//     rollOnce: Int!
//     roll(numRolls: Int!): [Int]
//   }

//   input MessageInput {
//     content: String
//     author: String
//   }

//   type Message {
//     id: ID!
//     content: String
//     author: String
//   }

//   type User {
//     id: String
//     name: String
//   }

//   type Mutation {
//     createMessage(input: MessageInput): Message
//     updateMessage(id: ID!, input: MessageInput): Message
//   }

//   type Query {
//     quoteOfTheDay: String
//     random: Float!
//     rollThreeDice: [Int]
//     rollDice(numDice: Int!, numSides: Int): [Int]
//     getDie(numSides: Int): RandomDie
//     getMessage(id: ID!): Message
//     ip: String
//     user(id: String): User
//   }
// `);

// // This class implements the RandomDie GraphQL type
// class RandomDie {
//   constructor(numSides) {
//     this.numSides = numSides;
//   }

//   rollOnce() {
//     return 1 + Math.floor(Math.random() * this.numSides);
//   }

//   roll({numRolls}) {
//     var output = [];
//     for (var i = 0; i < numRolls; i++) {
//       output.push(this.rollOnce());
//     }
//     return output;
//   }
// }

// // If Message had any complex fields, we'd put them on this object.
// class Message {
//   constructor(id, {content, author}) {
//     this.id = id;
//     this.content = content;
//     this.author = author;
//   }
// }

// // Create databases
// var fakeMessageDatabase = {};

// var fakeUserDatabase = {
//   'a': {
//     id: 'a',
//     name: 'alice',
//   },
//   'b': {
//     id: 'b',
//     name: 'bob',
//   },
// };

// // Express middleware
// function loggingMiddleware(req, res, next) {
//   console.log('ip:', req.ip);
//   next();
// }

// // The root provides a resolver function for each API endpoint
// var root = {
//   quoteOfTheDay: () => {
//     return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
//   },
//   random: () => {
//     return Math.random();
//   },
//   rollThreeDice: () => {
//     return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
//   },
//   rollDice: ({numDice, numSides}) => {
//     var output = [];
//     for (var i = 0; i < numDice; i++) {
//       output.push(1 + Math.floor(Math.random() * (numSides || 6)));
//     }
//     return output;
//   },
//   getDie: ({numSides}) => {
//     return new RandomDie(numSides || 6);
//   },
//   getMessage: function ({id}) {
//     if (!fakeDatabase[id]) {
//       throw new Error('no message exists with id ' + id);
//     }
//     return new Message(id, fakeDatabase[id]);
//   },
//   createMessage: function ({input}) {
//     // Create a random id for our "database".
//     var id = require('crypto').randomBytes(10).toString('hex');

//     fakeMessageDatabase[id] = input;
//     return new Message(id, input);
//   },
//   updateMessage: function ({id, input}) {
//     if (!fakeMessageDatabase[id]) {
//       throw new Error('no message exists with id ' + id);
//     }
//     // This replaces all old data, but some apps might want partial update.
//     fakeMessageDatabase[id] = input;
//     return new Message(id, input);
//   },
//   ip: (args, request) => {
//     return request.ip;
//   },
//   user: ({id}) => {
//     return fakeUserDatabase[id];
//   }
// };

// var app = express();
// app.use(loggingMiddleware);
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');

// Maps id to User object
var fakeDatabase = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
};

// Define the User type
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
});

// Define the Query type
var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: function (_, {id}) {
        return fakeDatabase[id];
      }
    }
  }
});

var schema = new graphql.GraphQLSchema({query: queryType});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

// Use the following to test the application:

// {
//   quoteOfTheDay,
//   random,
//   rollThreeDice,
//   rollDice(numDice: 4, numSides: 	100),
//   getDie(numSides: 3) {
//     rollOnce
//     roll(numRolls: 3)
//   },
//   ip,
//   user(id: "a") {
//     name
//   }
// }

// mutation {
//   createMessage(input: {
//     author: "andy",
//     content: "hope is a good thing",
//   }) {
//     id
//   }
// }

// {
//   getMessage(id: "0cb2749dadd20a7749de") {
//     author,
//     content
//   }
// }