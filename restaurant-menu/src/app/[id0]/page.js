import { cookies } from "next/headers";
import axios from "axios";
import Dynamic0 from "./Dynamic0";
import Static0 from "./Static0";

export default async function Home({ params }) {

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
                <Dynamic0 params={params} />
            )
        }
    }
    return (
        <Static0 params={params} />
    )

}
