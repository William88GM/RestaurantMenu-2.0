import { useRouter } from "next/navigation"
import ListItems4 from "./ListItems4"

export default function NormalMode4({ handleDetails, viewerMode, p, details, baseURL, galleryRef, ediciones, }) {
    const router = useRouter()
    return (
        <>
            <div className='flex'>
                {!ediciones[0] ?
                    <span className='loader mt-20'></span> :
                    <div ref={galleryRef} style={{ scrollBehavior: "smooth" }} className={viewerMode ? "galery galery-small" : "galery"}>

                        {ediciones[0] && ediciones.map((e, i) => {
                            return <ListItems4 e={e} key={e.id} viewerMode={viewerMode} handleDetails={handleDetails} />
                        })}

                    </div>
                }
            </div>


            {details && p && <div className='modalDetails'>
                {details.img ? <img src={details.img} /> : <div className="animate-pulse space-x-4 bg-red-300 h-[auto] aspect-square w-[70%] rounded"></div>}

                <h4>{details.h4}</h4>
                <p >{details.p}</p>
                <div className={"flex items-center "} ><span>$</span><p className='[min-width:20px] font-bold rounded-md [margin-left:2px] [padding:2px]'>{details.price}</p></div>
                <button onClick={() => router.push(baseURL)}>✖</button>
            </div>}
        </>
    )
}
