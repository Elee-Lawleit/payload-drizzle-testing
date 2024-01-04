import dotenv from "dotenv"
import path from "path"
import payload from "payload"
import { InitOptions } from "payload/config"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

let cached = (global as any).payload

console.log("Cached payload object: ", payload)

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  }
}

//a partial (or some options) from the payload init options
interface Args {
  initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async ({ initOptions }: Args = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing")
  }

  if (cached.client) {
    return cached.client
  }

  //if there isn't already a request to get the client
  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    })
  }

  try {
    cached.client = await cached.promise
    console.log("Resolved cached object: ", cached)
    console.log("Resolved client: ", cached.client)
  } catch (error) {
    console.log("Payload error: ", error)
    cached.promise = null
  }

  //return the client after all the checks
  return cached.client

}

