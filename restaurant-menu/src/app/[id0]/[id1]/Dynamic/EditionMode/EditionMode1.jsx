import ListItems1 from "./ListItems1"
import { closestCenter, DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function EditionMode1({ handleEliminate, dataEditableRef, setEdiciones, toEliminate, dragActive, logged, galleryRef, ediciones, imagesHaveChanged, handleVisionItem, handleBannerEliminate }) {
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

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className='container' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                    <SortableContext items={ediciones.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                        {ediciones[0] && ediciones.map((e, i) => {
                            return <ListItems1 imagesHaveChanged={imagesHaveChanged} handleVisionItem={handleVisionItem} handleBannerEliminate={handleBannerEliminate} key={e.id} i={i} ediciones={ediciones} setEdiciones={setEdiciones} logged={logged} e={e} dragActive={dragActive} toEliminate={toEliminate} />
                        })}
                    </SortableContext>
                </div>

                {toEliminate && <div className='modal'>
                    <p>¿Está seguro que desea elminiar la categoría <b> {`${ediciones.find((el) => el.id == toEliminate).name}`}</b> y todos sus hijos ?</p>
                    <div>
                        <button className='text-rose-500 [font-weight:bold]' onClick={handleEliminate}>ELIMINAR</button>
                        <button className='text-green-500 [font-weight:bold]' onClick={handleBannerEliminate}>CANCELAR</button>
                    </div>
                </div>}
            </DndContext>
        </>
    )
}
