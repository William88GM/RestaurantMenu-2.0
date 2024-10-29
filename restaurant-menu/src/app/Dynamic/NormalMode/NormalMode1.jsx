import ListItems1 from "./ListItems1"

export default function NormalMode1({ baseURL, galleryRef, cardRef, ediciones }) {
    return (
        <>
            <div className='containerSucursales' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                { /*Modo normal*/}
                {!ediciones[0] ?
                    <span className='loader mt-20 m-auto'></span> :
                    ediciones.map((e, i) => {
                        return <ListItems1 e={e} key={e.id} cardRef={cardRef} />
                    })}
            </div>
        </>
    )
}
