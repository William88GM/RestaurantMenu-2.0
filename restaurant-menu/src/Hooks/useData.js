import { Context } from '@/Context/Context'
import React, { useContext, useEffect } from 'react'
import saveToLocalStorage from './setCache'
import loadFromLocalStorage from './getCache'
import { SessionContext } from '@/Context/SessionContext'




export default function useData() {
    const { data, setData } = useContext(Context)

    const { logged, setLogged } = useContext(SessionContext)

    async function refresh() {
        const time = 5
        const key = "dataGrande"
        try {

            let respuesta = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`)

            respuesta = await respuesta.json()

            setData(JSON.parse(respuesta.body))
            saveToLocalStorage(key, JSON.parse(res.body), time)
        } catch (err) {
            console.log(err);
        }

        // fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`).then(
        //     (res) => res.json(),
        // ).then(
        //     (res) => {
        //         }
        //     ).catch(err => console.error("Error fetching data:", err));

    }

    useEffect(() => {

        const key = "dataGrande"

        if (logged) {
            localStorage.clear();//por si acaso
        }

        const time = 5 //en minutos
        let { exists, isUpToDate, item } = loadFromLocalStorage(key)
        // console.log("Existe?...", exists);
        if (!data) {
            if (!isUpToDate) {


                fetch(`${process.env.NEXT_PUBLIC_URL}/api/data`).then(
                    (res) => res.json(),
                ).then(
                    (res) => {
                        setData(JSON.parse(res.body))
                        saveToLocalStorage(key, JSON.parse(res.body), time)
                        // console.log("data del fetch", JSON.parse(res.body)); //too bem
                    }
                ).catch(err => console.error("Error fetching data:", err));
            } else if (item && isUpToDate) {
                setData(item.data)
                console.log("usando data cacheada...");
            }
        }
        // if (data) console.log("data del if del fetch", data);

        if (typeof structuredClone !== "function") {
            globalThis.structuredClone = function (value) {
                return JSON.parse(JSON.stringify(value));
            };
        }
    }, [data])


    return ({ data, setData, refresh })
}
