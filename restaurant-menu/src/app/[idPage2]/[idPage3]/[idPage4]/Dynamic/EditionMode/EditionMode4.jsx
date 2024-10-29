import useEliminate from "@/Hooks/useEliminate";
import ListItems2 from "./ListItems4"
import { closestCenter, DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function EditionMode4({ data, viewerMode, dataEditableRef, setEdiciones, dragActive, logged, galleryRef, ediciones, imagesHaveChanged, handleVisionItem }) {
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    const { handleBannerEliminate, toEliminate, handleEliminate } = useEliminate()

    function handleDragEnd(e) {
        imagesHaveChanged.current = true


        const { active, over } = e
        const oldIndex = ediciones.findIndex((item) => item.id === active.id)
        const newIndex = ediciones.findIndex((item) => item.id === over.id)

        const newOrder = arrayMove(ediciones, oldIndex, newIndex)

        setEdiciones(newOrder)
        dataEditableRef.current.options = newOrder

    }

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className='flex'>
                    <div ref={galleryRef} style={{ scrollBehavior: "smooth" }} className={dragActive ? "galery galery-small" : viewerMode ? "galery galery-small" : "galery"}>

                        <SortableContext items={ediciones.map((e) => e.id)} strategy={verticalListSortingStrategy}>

                            {ediciones[0] && ediciones.map((e, i) => {
                                return (
                                    <ListItems2 imagesHaveChanged={imagesHaveChanged} handleVisionItem={handleVisionItem} viewerMode={viewerMode} data={data} i={i} ediciones={ediciones} setEdiciones={setEdiciones} dragActive={dragActive} key={e.id} e={e} logged={logged} toEliminate={toEliminate} handleBannerEliminate={handleBannerEliminate} />
                                )
                            })}
                        </SortableContext>
                    </div>
                </div>
                {toEliminate && <div className='modal'>
                    <p>¿Está seguro que desea elminiar el elemento <b> {`${ediciones.find((el) => el.id == toEliminate).name}`}</b>?</p>
                    <div>
                        <button className='text-rose-500 [font-weight:bold]' onClick={() => setEdiciones(handleEliminate(dataEditableRef).current.options)}>ELIMINAR</button>
                        <button className='text-green-500 [font-weight:bold]' onClick={handleBannerEliminate}>CANCELAR</button>
                    </div>
                </div>}
            </DndContext>
        </>
    )
}
