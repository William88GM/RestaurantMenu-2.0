"use client"
import Header from '@/GlobalComponents/Header/Header'
import Section from '@/GlobalComponents/Section/Section'
import Article from '@/GlobalComponents/Article/Article'
import handleVision from '@/Hooks/handleVision'
import handlePostear from '@/Hooks/handlePostear'
import handleVerificarRepetidos from '@/Hooks/handleVerificarRepetidos'
import handleAddCategory from '@/Hooks/handleAddCategory'
import EditionMode3 from './EditionMode/EditionMode3'
import NormalMode3 from './NormalMode/NormalMode3'
import useReferenciasIniciales from '@/app/VariablesIniciales/useReferenciasIniciales'
import useStatesIniciales from '@/app/VariablesIniciales/useStatesIniciales'
import useHooksIniciales from '@/app/VariablesIniciales/useHooksIniciales'
import Footer from "@/GlobalComponents/Footer/Footer";
import Menu from '@/GlobalComponents/Menu/Menu'

export const runtime = 'edge';


export default function Dynamic3({ params }) {

    //CONFIGURACIONES MANUALES
    const isHome = false

    const name = decodeURIComponent(params.idPage2.replaceAll("-", " "))
    const name1 = decodeURIComponent(params.idPage3.replaceAll("-", " ")) //pagina actual
    const actualPage = name1
    const previousPage = name

    const seUsanImagenes = true
    const namesUrlCategories = [name, name1]
    //TERMINAN LAS CONFIGURACIONES MANUALES




    //VARIABLES INICIALES

    //Referencias Iniciales Estandar
    const { dataAllRef, dataEditableRef, galleryRef, cardRef, imagesHaveChanged, guardando, longitudItemsPrevios, scroll } = useReferenciasIniciales()
    //Estados Iniciales Estandar
    const { editionMode, setEditionMode, ediciones, setEdiciones, dragActive, setDragActive, loading, setLoading, showPassword, setShowPassword } = useStatesIniciales()
    //Hooks Iniciales Estandar
    const { data, setData, logged, toEliminate, setToEliminate, showMenu, setShowMenu, handleMenu } = useHooksIniciales({ scroll, galleryRef, ediciones, longitudItemsPrevios, namesUrlCategories, seUsanImagenes, dataEditableRef, setEdiciones, guardando, dataAllRef })
    //Variables     
    const numPaginaActual = namesUrlCategories.length + 1



    async function handleSave() {
        guardando.current = true
        try {

            let elements = document.querySelector(".container");
            let datos
            if (elements) {

                datos = Array.from(elements.children)


                datos = datos.map((e) => {
                    return {
                        name: e.children[0]?.innerText?.trim().replace(/\r?\n|\r/g, ' ') || '',
                        image: e.children[1]?.src || '',
                        id: e.id
                    };
                });

            } else {
                console.error("No se encontró el elemento con la clase .container");
            }

            if (handleVerificarRepetidos(datos)) {
                alert("No pueden haber titulos repetidos")
                return setEditionMode(true)
            } else {
                setEditionMode(false)



                setToEliminate(null)
                //Guarda los titulos editados en el state en la ref que es copia de una parte de Data

                for (const i in dataEditableRef.current.options) {

                    dataEditableRef.current.options[i].name = datos.find((e) => e.id === dataEditableRef.current.options[i].id).name
                    dataEditableRef.current.options[i].image = datos.find((e) => e.id === dataEditableRef.current.options[i].id).image
                }
                // console.log("dataRef de guardar", dataEditableRef.current.options);
                setEdiciones(dataEditableRef.current.options)//actualiza el texto con lo del placeholder



                const images = {
                    idSection: dataEditableRef.current.id,
                    imagesBase64: dataEditableRef.current.options.map((e) => {
                        if (e.image && e.image.startsWith("http")) {
                            return { idElement: e.id, src: "" }
                        } else {
                            return { idElement: e.id, src: e.image }
                        }
                    })
                }


                let copia = structuredClone(dataEditableRef.current.options);
                copia = copia.map((e) => {
                    return { ...e, image: "" }
                })


                dataAllRef.current.options.find((e) => e.name === name).options.find((e) => e.name === name1).options = copia
                // console.log("copia luego de filtrarle las img", copia);

                //guarda en data el json actualizado de la ref
                setData(dataAllRef.current)
                //envia el json
                // postear(images)
                handlePostear(images, setLoading, guardando, imagesHaveChanged, dataAllRef)
            }
        } catch (error) {
            console.log(error);
        }
    }


    function handleVisionItem(id) {
        const res = handleVision(id, dataEditableRef)
        setEdiciones(res)
    }

    //-----------------------------------------TERMINA LO ESTANDAR---------------------------------------



    return (
        <main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Flor.webp)` }}>

            <Header navigateTo={`/${params.idPage2}`} isHome={isHome} handleMenu={handleMenu} logged={logged} editionMode={editionMode} showMenu={showMenu} />

            <Section isHome={isHome} namesUrlCategories={namesUrlCategories} previousPage={previousPage} actualPage={actualPage} editionMode={editionMode} viewerMode={null} handleChangeView={null} />

            <Article handleVisionItem={handleVisionItem} namesUrlCategories={namesUrlCategories} dataEditableRef={dataEditableRef} imagesHaveChanged={imagesHaveChanged} dragActive={dragActive} logged={logged} data={data} ediciones={ediciones} EditionMode={EditionMode3} setEdiciones={setEdiciones} NormalMode={NormalMode3} editionModeState={editionMode} galleryRef={galleryRef} cardRef={cardRef} />

            <Footer isHome={isHome} name={name} paginaActual={numPaginaActual} logged={logged} loading={loading} showMenu={showMenu} editionMode={editionMode} setEditionMode={setEditionMode} toEliminate={toEliminate} handleMenu={handleMenu} handleAddCategory={handleAddCategory} dragActive={dragActive} setDragActive={setDragActive} handleSave={handleSave} scroll={scroll} dataEditableRef={dataEditableRef} setEdiciones={setEdiciones} />

            <Menu editionMode={editionMode} showMenu={showMenu} logged={logged} setShowMenu={setShowMenu} handleMenu={handleMenu} setShowPassword={setShowPassword} showPassword={showPassword} />


        </main>

    );

}

