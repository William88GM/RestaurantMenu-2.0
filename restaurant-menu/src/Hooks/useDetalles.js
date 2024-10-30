import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function useDetalles(namesUrlCategories, dataEditableRef) {
    const router = useRouter()
    const querys = useSearchParams()
    const p = querys.get("p")

    const [details, setDetails] = useState({ img: "", h4: "", p: "", price: "" })

    function handleDetails({ id }) {
        // Cambia solo la query 'p' sin renderizar de nuevo la página
        let path = ""
        for (const index in namesUrlCategories) {
            if (namesUrlCategories.length > 0) {
                path = path.concat(`/${namesUrlCategories[index].replaceAll(" ", "-")}`)
            }
        }
        router.push(`${path}?p=${id}`)
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
