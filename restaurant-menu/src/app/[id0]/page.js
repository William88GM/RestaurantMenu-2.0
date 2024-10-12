"use client"
import useData from '@/Hooks/useData'
import { closestCenter, DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ListItem from './ListItem'
import { SessionContext } from '@/Context/SessionContext'
import useAutoLogin from '@/Hooks/useAutoLogin'
import useImagesInterface from '@/Hooks/useImagesInterface'
import MenuLogin from '../Components/Menu/MenuLogin'
import MenuLogged from '../Components/Menu/MenuLogged'

export const runtime = 'edge';

export default function Page({ params }) {
    // const name = decodeURIComponent(params.id0) //pagina actual
    const name = decodeURIComponent(params.id0.replaceAll("-", " ")) //pagina actual
    const pathname = usePathname()
    const router = useRouter()

    const { logged, setLogged } = useContext(SessionContext)
    useAutoLogin()
    const imagesHaveChanged = useRef(false)
    const [showMenu, setShowMenu] = useState(false)
    const { data, setData } = useData() //json completo en estado
    const dataEditableRef0 = useRef(null);//tendra solo una parte del json con el que se trabajara en esta pagina
    const [ediciones, setEdiciones] = useState([]) //[{name: ""},{},{},] solo titulos de los inputs editables, se asignaran al json parcial
    const dataAllRef0 = useRef(null) //json completo donde se guardara el json parcial y luego se enviara al backend, ademas de usarlo para actualizar el estado data
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );
    const galleryRef = useRef(null)
    const cardRef = useRef(null)
    const longitudItemsPrevios = useRef(null)
    const guardando = useRef(null)
    const { imagesInterface } = useImagesInterface()
    const [editionMode, setEditionMode] = useState(false)//modo edicion
    const [toEliminate, setToEliminate] = useState(null)//Se guarda el indice del que se quiere eliminar y muestra el banner

    const scroll = useRef(false)

    useEffect(() => {
        if (guardando.current) return
        if (data && data.options) {
            let targetCategory;

            // Buscar la categoría
            for (const category of data.options) {
                if (category.name === name) {
                    targetCategory = category;
                    break; // Sale del bucle tan pronto como encuentra la categoría
                }
            }

            // Clonar los datos y la categoría encontrada
            if (targetCategory) {
                dataAllRef0.current = structuredClone(data); // Clona los datos originales
                dataEditableRef0.current = structuredClone(targetCategory); // Copia el objeto de la categoría actual
            }






            if (!dataEditableRef0.current || dataEditableRef0.current.visible == false) {
                return window.location.replace(`/`)
            }
            //fetch de img si la seccion las necesita
            longitudItemsPrevios.current = dataEditableRef0.current.options.length //Evitar scroll la primera vez
            setEdiciones(dataEditableRef0.current.options)
        }
    }, [data])






    function handleBannerEliminate(e) {
        if (toEliminate === null) {

            setToEliminate(e.target.id)//5
        } else {
            setToEliminate(null)
        }
    }


    function handleEliminate() {
        dataEditableRef0.current.options = dataEditableRef0.current.options.filter((e) => e.id !== toEliminate)


        setToEliminate(null)

        setEdiciones(dataEditableRef0.current.options)
    }



    function handleAddCategory() {
        scroll.current = true
        const newSubCategory = {
            name: "Nombre nueva categoría",
            id: crypto.randomUUID(),
            image: "",
            visible: true,
            options: [
                {
                    name: "Nombre nueva categoria",
                    id: crypto.randomUUID(),
                    image: "",
                    visible: true,
                    options: [
                        {
                            name: "Nombre nuevo producto",
                            id: crypto.randomUUID(),
                            description: "Descripción del producto",
                            price: "0",
                            image: "",
                            visible: true
                        },
                    ]
                }
            ]
        }

        dataEditableRef0.current.options.push(newSubCategory)
        setEdiciones((prev) => {

            return [...dataEditableRef0.current.options]
        })

    }

    useEffect(() => {

        if (!scroll.current) return
        scroll.current = false
        if (longitudItemsPrevios.current == ediciones.length) {
            return
        }

        if (galleryRef.current && galleryRef.current && ediciones) { //30 de gap
            galleryRef.current.scrollTop += (galleryRef.current.offsetHeight + 400) * ediciones.length;

        }


    }, [ediciones.length])

    function verificarRepetidos(state) {
        const seen = new Set();
        const duplicates = state.filter(item => {
            if (seen.has(item.name)) {
                return true;
            }
            seen.add(item.name);
            return false;
        });

        if (duplicates.length > 0) {
            return true
        } else {
            false
        }

        return false
    }
    function handleMenu() {
        setShowMenu(!showMenu)
        // console.log("hola");
    }

    function handleEditionMode() {
        if (loading) return
        if (editionMode) {

            handleSave()
        } else {

            setEditionMode(true)
        }
    }

    async function handleSave() {
        guardando.current = true
        try {

            let elements = document.querySelector(".containerInicio");
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
                console.error("No se encontró el elemento con la clase .containerInicio");
            }

            if (verificarRepetidos(datos)) {
                alert("No pueden haber titulos repetidos")
                return setEditionMode(true)
            } else {
                setEditionMode(false)



                setToEliminate(null)
                //Guarda los titulos editados en el state en la ref que es copia de una parte de Data
                for (const i in dataEditableRef0.current.options) {

                    dataEditableRef0.current.options[i].name = datos.find((e) => e.id === dataEditableRef0.current.options[i].id).name
                    dataEditableRef0.current.options[i].image = datos.find((e) => e.id === dataEditableRef0.current.options[i].id).image
                }

                setEdiciones(dataEditableRef0.current.options)


                const images = {
                    idSection: dataEditableRef0.current.id,
                    imagesBase64: dataEditableRef0.current.options.map((e) => {
                        if (e.image && e.image.startsWith("http")) {
                            return { idElement: e.id, src: "" }
                        } else {
                            return { idElement: e.id, src: e.image }
                        }
                    })
                }


                let copia = structuredClone(dataEditableRef0.current.options);
                copia = copia.map((e) => {
                    return { ...e, image: "" }
                })

                dataAllRef0.current.options.find((e) => e.name === name).options = copia
                //guarda en data el json actualizado de la ref
                setData(dataAllRef0.current)
                //envia el json
                postear(images)
            }
        } catch (error) {
            console.log(error);
        }
    }


    function postear(images) {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/modify`, {
            method: "PUT",
            body: JSON.stringify({ dataAll: dataAllRef0.current, images: {}, imagesHaveChanged: imagesHaveChanged.current }), // data can be `string` or {object}!
            headers: {
                "Content-Type": "application/json",
            },
        }).then(
            (res) => res.json(),
        ).then(
            (res) => {
                setLoading(false)
                guardando.current = false
                imagesHaveChanged.current = false
                localStorage.clear();
            }
        ).catch((err) => {
            console.log(err);
            guardando.current = false
            localStorage.clear();
        })
    }


    function handleDragEnd(e) {
        imagesHaveChanged.current = true
        // saveBefore()

        const { active, over } = e
        const oldIndex = ediciones.findIndex((item) => item.id === active.id)
        const newIndex = ediciones.findIndex((item) => item.id === over.id)

        const newOrder = arrayMove(ediciones, oldIndex, newIndex)

        setEdiciones(newOrder)
        dataEditableRef0.current.options = newOrder

    }



    //🧐
    // useEffect(() => {
    //     console.log("Pagina 0");
    // }, [])




    // useEffect(() => {
    //     if (ediciones) console.log("ediciones", ediciones);
    // }, [ediciones])

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


    function handleVisionItem(id) {
        let cambio = !dataEditableRef0.current.options.find((el) => el.id == id).visible
        dataEditableRef0.current.options.find((el) => el.id == id).visible = !dataEditableRef0.current.options.find((el) => el.id == id).visible
        // dataEditableRef0.current.options.find((el) => el.id == id).visible = true

        if (dataEditableRef0.current.options.find((el) => el.id == id).options[0]) {
            // console.log("cambio:", cambio);
            propagar(dataEditableRef0.current.options.find((el) => el.id == id).options, cambio)
        }
        setEdiciones([...dataEditableRef0.current.options])

    }



    return (<main style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Flor.webp)` }}>
        <header>

            <Link href={`/`}>

                <img className='title' src={`${process.env.NEXT_PUBLIC_URL}/images/Title.webp`} alt="Título La Vene" />
            </Link>
            {/* <svg className='esquinaSupDerecha' xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                <path d="M0 0H138V138L0 0Z" fill="#b32624" />
            </svg> */}

            {logged ? !editionMode && showMenu ?
                <svg className='esquinaSupDerecha menuSuperior' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none" alt="esquinaSupDerecha">
                    <path d="M0 0H138V138L0 0Z" fill="#900020" />
                </svg>
                : <svg className={`esquinaSupDerecha ${!editionMode && "cursor-pointer"}`} onClick={handleMenu} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                    <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                </svg> : <svg className='esquinaSupDerecha' xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                <path d="M0 0H138V138L0 0Z" fill="#b32624" />
            </svg>
            }

        </header>
        <section>
            <h2>{name} - INICIO</h2>
        </section>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <article>

                {/*Primer pagina*/}

                {editionMode && logged && data && ediciones[0] ? (<>
                    {  /*Modo ediciones*/}
                    <div className='containerInicio' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                        <SortableContext items={ediciones.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                            {ediciones.map((e, i) => {
                                return <ListItem imagesHaveChanged={imagesHaveChanged} handleVisionItem={handleVisionItem} key={e.id} handleBannerEliminate={handleBannerEliminate} logged={logged} e={e} dragActive={dragActive} toEliminate={toEliminate} />
                            })}
                        </SortableContext>
                    </div>
                    {toEliminate && <div className='modal'>
                        <p>¿Está seguro que desea elminiar la categoría <b> {`${ediciones.find((el) => el.id == toEliminate).name}`}</b> y todos sus hijos?</p>
                        <div>
                            <button className='text-rose-500 [font-weight:bold]' onClick={handleEliminate}>ELIMINAR</button>
                            <button className='text-green-500 [font-weight:bold]' onClick={handleBannerEliminate}>CANCELAR</button>
                        </div>
                    </div>}


                </>)
                    : <>
                        <div className='containerInicio' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                            {/*Modo normal*/}
                            {ediciones[0] && ediciones.map((e, i) => {
                                return <div key={e.id} id={e.id} ref={cardRef} className={e.visible ? "" : "hidden"}>
                                    <Link prefetch={true} style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Card.webp)` }} className={`link-pag1`} href={`/${name.replaceAll(" ", "-")}/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
                                </div>
                            })}
                        </div>
                    </>
                }
            </article>
        </DndContext>
        <footer>
            {logged ? loading ? <span className='[font-size:18px] font-bold mr-4'> Guardando</span> :
                <button className={editionMode ? "editionMode" : "viewerMode"} onClick={handleEditionMode}> {editionMode ?
                    <svg fill='#00dd60' version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="100%" height="100%" viewBox="0 0 512.000000 512.000000"
                        preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                            <path d="M4599 4732 c-14 -9 -589 -654 -1277 -1432 -688 -778 -1266 -1424
-1283 -1434 -29 -18 -35 -18 -70 -5 -25 9 -182 146 -476 413 -391 357 -445
403 -513 435 -66 31 -86 36 -171 39 -152 6 -249 -29 -351 -126 -66 -63 -120
-160 -139 -249 -23 -113 5 -257 69 -351 15 -22 303 -378 641 -792 484 -593
624 -759 665 -786 78 -52 152 -74 246 -74 130 0 236 44 325 136 27 27 517 807
1271 2021 675 1088 1238 1996 1251 2018 12 22 23 53 23 68 0 43 -29 97 -64
118 -39 24 -112 25 -147 1z"/>
                        </g>
                    </svg> :
                    <svg fill='#962220' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="100%" width="100%" version="1.1" id="_x32_" viewBox="0 0 512 512" xmlSpace="preserve">
                        <g>
                            <path className="st0" d="M229.806,376.797l-58.165-40.976l-1.128-0.112c-26.889-2.741-53.247,9.248-68.79,31.31   c-14.743,20.928-20.101,43.743-25.282,65.812c-3.528,15.064-7.181,30.64-13.805,45.613c-5.483,12.382-9.156,16.802-9.169,16.822   l-3.784,4.283l5.148,2.479c23.958,11.542,56.31,13.143,88.766,4.394c34.09-9.182,62.639-28.109,80.372-53.28   c15.543-22.062,17.963-50.919,6.322-75.316L229.806,376.797z M208.721,442.4c-4.171,5.915-9.148,11.483-14.795,16.605   c-0.892,0.597-1.81,1.259-2.774,2.007c-10.657,8.382-24.548,4.775-16.101-12.224c8.447-17.012-6.44-22.456-18.534-11.286   c-15.175,14.022-22.298,2.826-19.491-4.913c2.8-7.738,12.881-18.291,4.446-25.111c-5.076-4.112-11.628,1.895-22.082,10.041   c-5.988,4.662-19.773,3.148-14.186-17.55c3.023-7.693,6.768-15.11,11.766-22.206c10.847-15.412,29.244-24.462,48.105-23.741   l49.81,35.087C221.923,406.631,219.575,426.988,208.721,442.4z" />
                            <path className="st0" d="M191.519,277.032c-6.238,7.943-8.939,18.095-7.484,28.09c1.47,9.994,6.972,18.946,15.229,24.764l26.83,18.9   c8.257,5.817,18.547,7.988,28.45,6.007c9.903-1.993,18.554-7.962,23.938-16.5l24.357-38.734l-83.047-58.506L191.519,277.032z" />
                            <path className="st0" d="M447.22,6.635l-0.204-0.138c-15.484-10.907-36.792-7.778-48.492,7.109L229.839,228.265l81.658,57.523   L456.847,54.687C466.934,38.658,462.697,17.541,447.22,6.635z" />
                        </g>
                    </svg>}
                </button> : ""}
            {/* {!editionMode && <svg className='esquinaInfIzquierda' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                <path d="M138 138H0V0L138 138Z" fill="#b32624" />
            </svg>} */}
            {logged ? !editionMode && showMenu ? <svg className='esquinaInfIzquierda menuInferior' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                <path d="M138 138H0V0L138 138Z" fill="#900020" />
            </svg> : !editionMode && <svg className='esquinaInfIzquierda cursor-pointer' onClick={handleMenu} alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                <path d="M138 138H0V0L138 138Z" fill="#b32624" />
            </svg> : <svg className='esquinaInfIzquierda' alt="esquinaInfIzquierda" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none">
                <path d="M138 138H0V0L138 138Z" fill="#b32624" />
            </svg>}


            {logged && !toEliminate && editionMode ? <button className={dragActive ? "modoArrastre" : "modoEscritura"} onClick={() => setDragActive(!dragActive)}>{dragActive ? "Arrastre" : "Escritura"}</button> : ""}
            {logged ? !toEliminate && editionMode ? <button className='añadirProducto' onClick={handleAddCategory}><span>❌</span>Añadir <br /> categoría</button> : "" :
                <div className="flex mr-6">
                    {imagesInterface && dataAllRef0.current && dataAllRef0.current.interface.socialMedia.map((e) => {
                        return <Link href={e.link} key={e.id} target="_blank" className="redes"><img src={imagesInterface.socialMedia.find((el) => el.idElement === e.id).src} id={e.id} alt={e.name} /></Link>
                    })}
                </div>
            }
        </footer>
        {!editionMode && showMenu ? logged ?
            <MenuLogged setShowPassword={setShowPassword} showPassword={showPassword} showMenu={showMenu} setShowMenu={setShowMenu} handleMenu={handleMenu} />
            : <MenuLogin setShowPassword={setShowPassword} showPassword={showPassword} showMenu={showMenu} setShowMenu={setShowMenu} handleMenu={handleMenu} /> : ""}

    </main>
    );

}
