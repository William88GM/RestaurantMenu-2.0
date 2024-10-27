

export default function handleVision(id, dataEditableRef) {

    function propagar(targets, cambio) {
        // console.log("TARGETS: ", targets);
        targets.forEach((el) => {
            // console.log("ELEMENTO: ", el);
            el.visible = cambio
            if (el.options && el.options[0]) {
                propagar(el.options, cambio)
            }
        })
    }

    // console.log("ESTADO ACTUAL: ", dataEditableRef.current.options.find((el) => el.id == id).visible);
    let cambio = !dataEditableRef.current.options.find((el) => el.id == id).visible
    dataEditableRef.current.options.find((el) => el.id == id).visible = !dataEditableRef.current.options.find((el) => el.id == id).visible
    // dataEditableRef.current.options.find((el) => el.id == id).visible = true

    let buscado = dataEditableRef.current.options.find((el) => el.id == id).options
    if (buscado && buscado[0]) {
        // console.log("cambio:", cambio);
        propagar(buscado, cambio)
        console.log("propagar", dataEditableRef.current)
    }






    return [...dataEditableRef.current.options]
}
