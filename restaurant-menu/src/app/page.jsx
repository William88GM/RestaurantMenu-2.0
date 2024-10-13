import { cookies } from "next/headers";
import DynamicHome from "./DynamicHome";
import StaticHome from "./StaticHome";
import axios from "axios";

export default async function Home() {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  let response
  if (token) {
    try {
      response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/login/autoLogin?token=${token}`)

    } catch (err) {
      console.log("Hubo error");
    }
    if (response && response.status === 200) {
      return (
        <DynamicHome />
      )
    }
  }
  return (
    <StaticHome />
  )

}