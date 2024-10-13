import { cookies } from "next/headers";
import axios from "axios";
import Dynamic1 from "./Dynamic1";
import Static1 from "./Static1";

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
                <Dynamic1 />
            )
        }
    }
    return (
        <Static1 params={params} />
    )

}
