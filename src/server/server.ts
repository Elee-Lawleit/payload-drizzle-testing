import express from "express"
import { nextApp, nextHandler } from "./next-utils"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./trpc"
import { inferAsyncReturnType } from "@trpc/server"
import { getPayloadClient } from "../get-payload"
import { Payload } from "payload"

const app = express()

const PORT = Number(process.env.PORT) || 3000

//goes into createExpressMiddlware for trpc
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
})

export type ExpressContext = inferAsyncReturnType<typeof createContext>

const start = async () => {

  const payload: Payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL is ${cms.getAdminURL()}`)
      },
    },
  })

  console.log("Payload object: ", payload)

  app.use((req, res) => nextHandler(req, res)) //use nextHandler to render templates

  //prepare the nextjs app and then start the server
  nextApp.prepare().then(() => {
    payload.logger.info(
      "NextJS app prepared successfully. Now starting server..."
    )

    app.listen(PORT, async () => {
      payload.logger.info(
        `Server started on port ${PORT}. NextJS app url is ${process.env.NEXT_PUBLIC_SERVER_URL}`
      )
    })
  })


  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  )
}

start()
