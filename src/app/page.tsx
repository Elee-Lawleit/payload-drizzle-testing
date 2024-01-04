import { getPayloadClient } from "@/get-payload"
import { Payload } from "payload"

export default async function Home() {
  const payload: Payload = await getPayloadClient()
  
  let users
  try{
    //@ts-ignore
    users = await payload.find({
      collection: "users",
    })
  }catch(error){
    console.log("Error fetching users: ", error)
  }

  console.log("Users: ", users)

  return <div>Home page</div>
}
