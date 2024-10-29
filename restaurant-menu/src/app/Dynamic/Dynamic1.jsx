"use client"
import Header from "@/GlobalComponents/Header/Header";
import Section from '@/GlobalComponents/Section/Section'
import Article from "@/GlobalComponents/Article/Article";
import handleVision from "@/Hooks/handleVision";
import handlePostear from "@/Hooks/handlePostear";
import handleVerificarRepetidos from "@/Hooks/handleVerificarRepetidos";
import handleAddCategory from "@/Hooks/handleAddCategory";
import EditionMode1 from "./EditionMode/EditionMode1";
import NormalMode1 from "./NormalMode/NormalMode1";
import useReferenciasIniciales from "../VariablesIniciales/useReferenciasIniciales";
import useStatesIniciales from "../VariablesIniciales/useStatesIniciales";
import Footer from "@/GlobalComponents/Footer/Footer";
import Menu from "@/GlobalComponents/Menu/Menu";
import useHooksIniciales from "../VariablesIniciales/useHooksIniciales";

export const runtime = 'edge';


export default function Dynamic1() {

    //CONFIGURACIONES MANUALES
    const isHome = true
    const isProductPage = false

    const actualPage = null
    const previousPage = null
    const sucursal = ""

    const seUsanImagenes = false
    const namesUrlCategories = []
    //TERMINAN LAS CONFIGURACIONES MANUALES




    //VARIABLES INICIALES

    //Referencias Iniciales Estandar
    const { dataAllRef, dataEditableRef, galleryRef, cardRef, imagesHaveChanged, guardando, longitudItemsPrevios, scroll } = useReferenciasIniciales()
    //Estados Iniciales Estandar
    const { editionMode, setEditionMode, ediciones, setEdiciones, dragActive, setDragActive, loading, setLoading, showPassword, setShowPassword } = useStatesIniciales()
    //Hooks Iniciales Estandar
    const { data, setData, logged, toEliminate, setToEliminate, showMenu, setShowMenu, handleMenu, handleChangeView, viewerMode } = useHooksIniciales({ isProductPage, scroll, galleryRef, ediciones, longitudItemsPrevios, namesUrlCategories, seUsanImagenes, dataEditableRef, setEdiciones, guardando, dataAllRef })
    //Variables     
    const numPaginaActual = namesUrlCategories.length + 1


    // const getCookie = (name) => {
    //     const cookies = document.cookie.split('; ');
    //     const cookie = cookies.find(row => row.startsWith(`${name}=`));
    //     return cookie ? cookie.split('=')[1] : null;
    // };

    async function handleSave() {
        // console.log("dataRefAlprincipio del guardado", dataAllRef.current);
        guardando.current = true
        try {

            let elements = document.querySelector(".containerSucursales");
            let datos
            if (elements) {

                datos = Array.from(elements.children)


                datos = datos.map((e) => {
                    return {
                        name: e.children[0]?.innerText?.trim().replace(/\r?\n|\r/g, ' ') || '',
                        id: e.id
                    };
                });

            } else {
                console.error("No se encontró el elemento con la clase .containerSucursales");
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
                setEdiciones(dataEditableRef.current.options)



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


                dataAllRef.current.options = copia

                //guarda en data el json actualizado de la ref
                setData(dataAllRef.current)

                //envia el json
                // postear(images)
                // postear({})
                handlePostear({}, setLoading, guardando, imagesHaveChanged, dataAllRef)
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

            <Header
                navigateTo={`/`}
                isHome={isHome}
                handleMenu={handleMenu}
                showMenu={showMenu}
                logged={logged}
                editionMode={editionMode}
            />

            <Section
                isHome={isHome}
                actualPage={actualPage}
                namesUrlCategories={namesUrlCategories}
                previousPage={previousPage}
                editionMode={editionMode}
                galleryRef={galleryRef}
                handleChangeView={handleChangeView}
                viewerMode={viewerMode}
            />

            <Article
                EditionMode={EditionMode1}
                NormalMode={NormalMode1}
                handleVisionItem={handleVisionItem}
                namesUrlCategories={namesUrlCategories}
                dataEditableRef={dataEditableRef}
                imagesHaveChanged={imagesHaveChanged}
                dragActive={dragActive}
                logged={logged}
                data={data}
                ediciones={ediciones}
                setEdiciones={setEdiciones}
                editionModeState={editionMode}
                galleryRef={galleryRef}
                cardRef={cardRef}
                handleChangeView={handleChangeView}
                viewerMode={viewerMode}
            />

            <Footer
                isHome={isHome}
                sucursal={sucursal}
                paginaActual={numPaginaActual}
                logged={logged}
                loading={loading}
                showMenu={showMenu}
                editionMode={editionMode}
                setEditionMode={setEditionMode}
                toEliminate={toEliminate}
                handleMenu={handleMenu}
                handleAddCategory={handleAddCategory}
                dragActive={dragActive}
                setDragActive={setDragActive}
                handleSave={handleSave}
                scroll={scroll}
                dataEditableRef={dataEditableRef}
                setEdiciones={setEdiciones}
            />

            <Menu
                editionMode={editionMode}
                showMenu={showMenu}
                logged={logged}
                setShowMenu={setShowMenu}
                handleMenu={handleMenu}
                setShowPassword={setShowPassword}
                showPassword={showPassword}
            />

        </main>
    );
}

