import { useState } from "react";

export default function useHandleMenu() {
    const [showMenu, setShowMenu] = useState(false)

    function handleMenu() {
        setShowMenu(!showMenu)
        // console.log("hola");
    }
    return [showMenu, setShowMenu, handleMenu]
}