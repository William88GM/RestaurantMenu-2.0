import ListItems3 from "./ListItems3"


export default function NormalMode3({ baseURL, galleryRef, ediciones, }) {


    return (
        <>
            <div className='container' style={{ scrollBehavior: "smooth" }} ref={galleryRef}>
                {!ediciones[0] ?
                    <span className='loader mt-20 m-auto'></span> :
                    ediciones.map((e, i) => {
                        return <ListItems3 e={e} key={e.id} baseURL={baseURL} />
                    })}
            </div>
        </>
    )
}
