import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

// redis
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';


const main = async () => {
  const app = express();
  // connect to DB
  const orm = await MikroORM.init(microConfig);
  // do migration everytime
  await orm.getMigrator().up();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();


  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient, disableTouch: true}),
      cookie: {
        // 10 years last
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        // secure: __prod__
      },
      secret: "heyyo",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // context => to access orm object from inside
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: { origin: "http://localhost:3000", credentials: true},
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

};

main().catch((err) => {
  console.error(err);
})

