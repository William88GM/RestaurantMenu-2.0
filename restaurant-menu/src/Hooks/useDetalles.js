import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function useDetalles({ name, name1, name2 }) {
    const router = useRouter()
    const querys = useSearchParams()
    const p = querys.get("p")

    const [details, setDetails] = useState({ img: "", h4: "", p: "", price: "" })

    function handleDetails({ id }) {
        // Cambia solo la query 'p' sin renderizar de nuevo la página
        router.push(`/${name.replaceAll(" ", "-")}/${name1.replaceAll(" ", "-")}/${name2.replaceAll(" ", "-")}?p=${id}`)
    }
    useEffect(() => {
        if (p && dataEditableRef.current) {
            const target = dataEditableRef.current.options.find((e) => e.id === p)
            if (target) {
                console.log("target", target);
                setDetails({ img: target.image, h4: target.name, p: target.description, price: target.price })
            }
        } else {
            setDetails({ img: "", h4: "", p: "", price: "" })
        }
    }, [p])


    return ({ details, handleDetails, p })
}