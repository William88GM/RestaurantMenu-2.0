"use client"

import React, { useState } from "react";

export const Context = React.createContext({}); //Creo el contexto

export function ContextProvider({ children }) {
    //Toma los hijos de lo que encierra el componente

    const [data, setData] = useState();

    return (
        <Context.Provider value={{ data, setData }}>{children}</Context.Provider>
    );
}
