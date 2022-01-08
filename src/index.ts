import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import Express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { redis } from "./redis";

import { MeResolver } from "./modules/user/Me";
import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";

const main = async () => {
  await createConnection();
  const app = Express();
  const RedisStore = connectRedis(session);

  app.set("trust proxy", true);

  app.use(
    session({
      store: new RedisStore({ client: redis }),
      name: "qid",
      secret: "secretkey",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      },
    })
  );

  app.use(
    cors({
      credentials: true,
      origin: [
        // "https://studio.apollographql.com",
        "http://localhost:4000/graphql",
      ],
    })
  );

  const schema = await buildSchema({
    resolvers: [MeResolver, RegisterResolver, LoginResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
