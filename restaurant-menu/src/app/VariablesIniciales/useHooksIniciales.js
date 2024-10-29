import { SessionContext } from "@/Context/SessionContext"
import useHandleMenu from "@/Hooks/handleMenu"
import useAutoLogin from "@/Hooks/useAutoLogin"
import useAutoScroll from "@/Hooks/useAutoScroll"
import useData from "@/Hooks/useData"
import useEliminate from "@/Hooks/useEliminate"
import useImagesInterface from "@/Hooks/useImagesInterface"
import useInitialData from "@/Hooks/useInitialData"
import { useContext } from "react"

export default function useHooksIniciales({ scroll, galleryRef, ediciones, longitudItemsPrevios, namesUrlCategories, seUsanImagenes, dataEditableRef, setEdiciones, guardando, dataAllRef }) {

    const { data, setData } = useData() //json completo en estado
    const { logged } = useContext(SessionContext)
    const { toEliminate, setToEliminate } = useEliminate()
    const [showMenu, setShowMenu, handleMenu] = useHandleMenu()
    useAutoScroll(scroll, galleryRef, ediciones, longitudItemsPrevios)
    useImagesInterface()
    useAutoLogin()
    useInitialData({ namesUrlCategories, seUsanImagenes, data, dataEditableRef, setEdiciones, guardando, logged, longitudItemsPrevios, dataAllRef })

    return ({ data, setData, logged, toEliminate, setToEliminate, showMenu, setShowMenu, handleMenu })
}
