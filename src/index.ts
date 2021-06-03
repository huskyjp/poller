import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { Post } from "./entities/Post";
import { UserResolver } from "./resolvers/user";


const main = async () => {
  const app = express();
  // connect to DB
  const orm = await MikroORM.init(microConfig);
  // do migration everytime
  await orm.getMigrator().up();
  // const post = orm.em.create(Post, {title: 'my first post from'});
  // await orm.em.persistAndFlush(post);
  // await orm.em.nativeInsert(Post, {title: 'my first post 2'});

  const posts = await orm.em.find(Post, {});
  console.log(posts);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // context => to access orm object from inside
    context: () => ({ em: orm.em })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

};

main().catch((err) => {
  console.error(err);
})

