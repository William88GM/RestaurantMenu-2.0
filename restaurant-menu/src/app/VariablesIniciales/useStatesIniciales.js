import { useState } from "react"

export default function useStatesIniciales() {

    const [editionMode, setEditionMode] = useState(false)//modo edicion
    const [ediciones, setEdiciones] = useState([]) //[{name: ""},{},{},] solo titulos de los inputs editables, se asignaran al json parcial
    const [dragActive, setDragActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    return ({ editionMode, setEditionMode, ediciones, setEdiciones, dragActive, setDragActive, loading, setLoading, showPassword, setShowPassword })
}
