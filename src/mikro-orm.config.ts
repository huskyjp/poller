import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import {MikroORM} from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d.[tj]s$/,
  },
  dbName: 'poller',
  entities: [Post],
  // user: 'poller',
  password: '12120506',
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];  // to convert as exact type - Parameters type return array