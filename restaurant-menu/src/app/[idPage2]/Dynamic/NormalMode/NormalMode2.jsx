import ListItems2 from "./ListItems2"

export default function NormalMode2({ galleryRef, ediciones, cardRef, baseURL }) {
    return (
        <div className='containerInicio' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
            {!ediciones[0] ?
                <span className='loader mt-20 m-auto'></span> :
                ediciones.map((e, i) => {
                    return <ListItems2 cardRef={cardRef} e={e} key={e.id} baseURL={baseURL} />
                })}
        </div>
    )
}
