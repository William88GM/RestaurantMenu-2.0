import { cookies } from "next/headers";
import axios from "axios";
import Dynamic2 from "./Dynamic2";
import Static2 from "./Static2";

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
                <Dynamic2 params={params} />
            )
        }
    }
    return (
        <Dynamic2 params={params} />
        // <Static2 params={params} />
    )

}
