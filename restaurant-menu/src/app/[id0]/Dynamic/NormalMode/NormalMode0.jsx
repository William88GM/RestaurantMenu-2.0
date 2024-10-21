import ListItems0 from "./ListItems0"

export default function NormalMode0({ galleryRef, ediciones, cardRef, baseURL }) {
    return (
        <div className='containerInicio' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
            {ediciones[0] && ediciones.map((e, i) => {
                return <ListItems0 cardRef={cardRef} e={e} key={e.id} baseURL={baseURL} />
            })}
        </div>
    )
}