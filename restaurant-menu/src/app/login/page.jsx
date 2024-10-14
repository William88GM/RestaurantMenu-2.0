"use client"
import { useContext, useEffect } from "react";
import DynamicHome from "../DynamicHome";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/Context/SessionContext";

export default function page({ }) {
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
