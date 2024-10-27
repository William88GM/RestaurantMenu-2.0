import { useEffect } from "react";

export default function useAutoScroll(scroll, galleryRef, ediciones, longitudItemsPrevios) {


    useEffect(() => {
        if (!scroll || !galleryRef || !ediciones || !longitudItemsPrevios) return
        if (!scroll.current) return
        scroll.current = false
        if (longitudItemsPrevios.current == ediciones.length) {
            return
        }

        if (galleryRef.current && ediciones) { //30 de gap
            galleryRef.current.scrollTop += (galleryRef.current.offsetHeight + 400) * ediciones.length;

        }


    }, [ediciones.length])

}
