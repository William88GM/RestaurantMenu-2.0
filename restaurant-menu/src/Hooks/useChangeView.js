import { useEffect, useState } from "react"
import useData from "./useData"
import loadFromLocalStorage from "./getCache"
import saveToLocalStorage from "./setCache"

export default function useChangeView(galleryRef, isProductPage) {

    if (!isProductPage) {
        return ([null, null])
    }

    const [viewerMode, setViewerMode] = useState(null)
    const { data } = useData()

    useEffect(() => {
        if (!data) return
        let key = "viewMode"
        let { exists, isUpToDate, item } = loadFromLocalStorage(key)

        // console.log("EL MODO DE VISTA ESTA ACTUALIZADO??", isUpToDate);
        if (!isUpToDate) {
            saveToLocalStorage(key, data.interface.productsListViewMode, (60 * 24 * 7))
            setViewerMode(data.interface.productsListViewMode)
        } else {
            // console.log("EL MODO CARGADO ES", item.data);
            setViewerMode(item.data)
        }
    }, [data])

    function handleChangeView() {
        console.log("AQUI LLEGA?");
        let key = "viewMode"
        saveToLocalStorage(key, !viewerMode, (60 * 24 * 7))
        setViewerMode(!viewerMode)
    }

    useEffect(() => {
        console.log("viewerMode", viewerMode);
        if (viewerMode === null) return
        if (galleryRef.current) galleryRef.current.scrollTop = 0
    }, [viewerMode])

    return ([viewerMode, handleChangeView])
}
