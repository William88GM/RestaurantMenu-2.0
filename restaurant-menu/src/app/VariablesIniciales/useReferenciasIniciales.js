import { useRef } from "react";

export default function useReferenciasIniciales() {

    const dataAllRef = useRef(null) //json completo donde se guardara el json parcial y luego se enviara al backend, ademas de usarlo para actualizar el estado data
    const dataEditableRef = useRef(null);//tendra solo una parte del json con el que se trabajara en esta pagina
    const galleryRef = useRef(null)
    const cardRef = useRef(null)
    const imagesHaveChanged = useRef(false)
    const guardando = useRef(null)
    const longitudItemsPrevios = useRef(null)
    const scroll = useRef(false)


    return ({ dataAllRef, dataEditableRef, galleryRef, cardRef, imagesHaveChanged, guardando, longitudItemsPrevios, scroll })
}
