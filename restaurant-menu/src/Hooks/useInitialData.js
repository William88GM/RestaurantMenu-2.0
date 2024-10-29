import { useEffect } from "react";
import handleGetImagesArticle from "./handleGetImagesArticle";
import handleTargetCategory from "./handleTargetCategory";

export default function useInitialData({ namesUrlCategories, data, dataEditableRef, setEdiciones, guardando, logged, seUsanImagenes, longitudItemsPrevios, dataAllRef }) {

    let backTo = "/"

    for (const index in namesUrlCategories) {
        if (index != namesUrlCategories.length - 1 && namesUrlCategories.length > 1) {
            backTo = backTo.concat(`${namesUrlCategories[index].replaceAll(" ", "-")}/`)
        }
    }


    useEffect(() => {
        if (guardando.current) return
        if (data && data.options) {

            const targetSubcategory = handleTargetCategory(data, namesUrlCategories);


            // Clonar los datos y la subcategoría encontrada
            if (targetSubcategory) {
                dataAllRef.current = structuredClone(data);
                dataEditableRef.current = structuredClone(targetSubcategory); // Copia el objeto de la categoría actual
            }

            //Navegar a la categoria previa a la actual
            if (!dataEditableRef.current || dataEditableRef.current.visible == false) {
                return window.location.replace(backTo)
            }

            seUsanImagenes ?
                handleGetImagesArticle({ setEdiciones, dataEditableRef, logged })
                : setEdiciones(dataEditableRef.current.options)

            longitudItemsPrevios.current = dataEditableRef.current.options.length//Evitar scroll la primera vez


        }
        // console.log("Data al principio", data);
    }, [data])
}
