import { SessionContext } from '@/Context/SessionContext';
import axios from 'axios';
import React, { useContext, useEffect } from 'react'



export default function useAutoLogin() {
    const { logged, setLogged } = useContext(SessionContext)


    const yaSeIntentoAntesYNoLoggeo = globalThis.localStorage?.getItem("yaSeIntentoAntesYNoLoggeo")
    async function quieroUsarAwait() {
        try {

            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/login/autoLogin`, {})
            // console.log("holaaaaaaaa", response);
            if (response.status === 200) {
                setLogged(true)
                localStorage.clear();
            }
        } catch (err) {
            console.log(err);
            console.log("Fallo al auto loggear");
            localStorage.setItem("yaSeIntentoAntesYNoLoggeo", true)
        }
    }
    useEffect(() => {
        if (yaSeIntentoAntesYNoLoggeo) return
        quieroUsarAwait()
    }, [])
}
