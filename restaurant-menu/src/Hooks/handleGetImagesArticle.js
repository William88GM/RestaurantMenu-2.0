import loadFromLocalStorage from "./getCache"
import saveToLocalStorage from "./setCache"

export default function handleGetImagesArticle({ setEdiciones, dataEditableRef, logged }) {

    //COMIENZA CARGA DE IMAGENES
    //Escencialmente lo que se hace es modificar el ediciones agregando las imagenes de la DB
    const key = dataEditableRef.current.id
    const time = 5 //en minutos
    let { exists, isUpToDate, item } = loadFromLocalStorage(key)
    if (dataEditableRef.current) {
        if (!isUpToDate) {

            if (!logged) {//Si esta logged que no se muestre nada hasta que hayann cargado hasta las imagenes, no solo el texto, asi al guardar las imagenes no hay riesgo de que se guarde la imagen del loading
                setEdiciones(dataEditableRef.current.options)
            }

            fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/getImages`, {
                method: "POST",
                body: JSON.stringify({ idSection: dataEditableRef.current.id }), // data can be `string` or {object}!
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(
                (res) => res.json(),
            ).then(
                (res) => {

                    const resFormatted = JSON.parse(res.body)

                    dataEditableRef.current.options = dataEditableRef.current.options.map((e, i) => {
                        // return { ...e, image: resFormatted.imagesBase64[i]?.src ?? "" }
                        return { ...e, image: resFormatted.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
                    })

                    setEdiciones(dataEditableRef.current.options)
                    saveToLocalStorage(key, resFormatted, time)

                }
            ).catch((err) => console.log(err))
        } else if (item && isUpToDate) {

            dataEditableRef.current.options = dataEditableRef.current.options.map((e, i) => {
                return { ...e, image: item.data.imagesBase64.find((el) => el.idElement === e.id)?.src ?? "" }
            })

            setEdiciones(dataEditableRef.current.options)

        }
    }
    //FIN CARGA DE IMAGENES
}
