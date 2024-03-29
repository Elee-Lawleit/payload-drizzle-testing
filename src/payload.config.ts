import { buildConfig } from "payload/config";
import {webpackBundler} from "@payloadcms/bundler-webpack"
import {slateEditor} from "@payloadcms/richtext-slate"
import {postgresAdapter} from "@payloadcms/db-postgres"
import path from "path";
import dotenv from "dotenv"
import { Products } from "./collections/products";
import { Media } from "./collections/media";

dotenv.config({path: path.resolve(__dirname, "../.env")})

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Products, Media],
  routes: {
    admin: "/sell"
  },
  admin: {
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "~ E-Commerce Shop",
      favicon: "./favicon.ico",
      ogImage: "./thumbnail.png"
    }
  },
  rateLimit: {
    max: 2000
  },
  editor: slateEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL
    }
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-tyes.ts")
  }
})