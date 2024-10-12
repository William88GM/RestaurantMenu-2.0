import { useContext, useEffect, useState } from "react"
import loadFromLocalStorage from "./getCache";
import saveToLocalStorage from "./setCache";
import { SessionContext } from "@/Context/SessionContext";

export default function useImagesInterface() {
    const [imagesInterface, setImagesInterface] = useState()
    const { logged, setLogged } = useContext(SessionContext)

    useEffect(() => {

        const key = "imagesInterface"

        if (logged) {
            localStorage.clear();//por si acaso
        }

        const time = 60 //en minutos
        let { exists, isUpToDate, item } = loadFromLocalStorage(key)
        // console.log("Existe?...", exists);

        if (!isUpToDate) {
            fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImagesInterface`).then(
                (res) => res.json(),
            ).then(
                (res) => {
                    setImagesInterface(JSON.parse(res.body))
                    saveToLocalStorage(key, JSON.parse(res.body), time)
                }
            ).catch(err => console.error("Error fetching data:", err));
        } else if (item && isUpToDate) {
            setImagesInterface(item.data)
            console.log("usando data cacheada...");
        }
    }, [])


    return { imagesInterface, setImagesInterface }
}
