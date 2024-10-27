import { useState } from "react"

export default function useEliminate() {


    const [toEliminate, setToEliminate] = useState(null)

    function handleBannerEliminate(e) {
        console.log("A eliminar:", e.target.id);
        if (toEliminate === null) {

            setToEliminate(e.target.id)//5
        } else {
            setToEliminate(null)
        }
    }

    function handleEliminate(dataEditableRef) {

        dataEditableRef.current.options = dataEditableRef.current.options.filter((e) => e.id !== toEliminate)

        setToEliminate(null)

        return dataEditableRef
    }




    return { toEliminate, setToEliminate, handleBannerEliminate, handleEliminate }

}
