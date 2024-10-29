import useEliminate from "@/Hooks/useEliminate";
import ListItemsHome from "./ListItems1"
import { closestCenter, DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect } from "react";

export default function EditionMode1({ dataEditableRef, setEdiciones, dragActive, logged, galleryRef, ediciones, imagesHaveChanged, handleVisionItem, }) {

    const { handleBannerEliminate, toEliminate, handleEliminate } = useEliminate()

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    function handleDragEnd(e) {
        imagesHaveChanged.current = true


        const { active, over } = e
        const oldIndex = ediciones.findIndex((item) => item.id === active.id)
        const newIndex = ediciones.findIndex((item) => item.id === over.id)

        const newOrder = arrayMove(ediciones, oldIndex, newIndex)

        setEdiciones(newOrder)
        dataEditableRef.current.options = newOrder

    }

    useEffect(() => {
        console.log("Eliminando", toEliminate);
    }, [toEliminate])

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {     /*Modo ediciones*/}
                <div className='containerSucursales' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                    <SortableContext items={ediciones.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                        {ediciones.map((e, i) => {

                            return <ListItemsHome handleBannerEliminate={handleBannerEliminate} imagesHaveChanged={imagesHaveChanged} handleVisionItem={handleVisionItem} key={e.id} logged={logged} e={e} dragActive={dragActive} />
                        })}
                    </SortableContext>
                </div>
                {toEliminate && <div className='modal'>
                    <p>¿Está seguro que desea elminiar la categoría <b> {`${ediciones.find((el) => el.id == toEliminate).name}`}</b> y todos sus hijos?</p>
                    <div>
                        <button className='text-rose-500 [font-weight:bold]' onClick={() => setEdiciones(handleEliminate(dataEditableRef).current.options)}>ELIMINAR</button>
                        <button className='text-green-500 [font-weight:bold]' onClick={handleBannerEliminate}>CANCELAR</button>
                    </div>
                </div>}

            </DndContext>
        </>
    )
}
