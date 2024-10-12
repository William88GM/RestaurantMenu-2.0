"use client"

import React, { useState } from "react";

export const SessionContext = React.createContext({}); //Creo el contexto

export function SessionContextProvider({ children }) {
    //Toma los hijos de lo que encierra el componente

    const [logged, setLogged] = useState(false);

    return (
        <SessionContext.Provider value={{ logged, setLogged }}>{children}</SessionContext.Provider>
    );
}
