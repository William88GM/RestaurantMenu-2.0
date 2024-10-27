import useEliminate from "@/Hooks/useEliminate";
import ListItems0 from "./ListItems0"
import { closestCenter, DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function EditionMode0({ dataEditableRef, setEdiciones, dragActive, logged, galleryRef, ediciones, imagesHaveChanged, handleVisionItem }) {
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
                <div className='containerInicio' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                    <SortableContext items={ediciones.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                        {ediciones.map((e, i) => {
                            return <ListItems0 imagesHaveChanged={imagesHaveChanged} handleVisionItem={handleVisionItem} key={e.id} handleBannerEliminate={handleBannerEliminate} logged={logged} e={e} dragActive={dragActive} toEliminate={toEliminate} />
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
