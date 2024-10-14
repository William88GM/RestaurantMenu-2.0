"use client"
import { useContext, useEffect } from "react";
import DynamicHome from "../DynamicHome";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/Context/SessionContext";
export const runtime = 'edge';

//force dynamic
// export const dynamic = "force-dynamic";

export default function Page() {
    const router = useRouter()
    const { logged, setLogged } = useContext(SessionContext)

    useEffect(() => {
        if (logged) {
            router.push("/")
        }
    }, [logged])

    return (
        <DynamicHome loggin={true} />
    )
}
