import Link from "next/link";
import { useEffect } from "react";

export default function ListItems2({ cardRef, e, baseURL }) {

    return (
        <div key={e.id} id={e.id} ref={cardRef} className={e.visible ? "" : "hidden"}>
            <Link prefetch={true} style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/images/Card.webp)` }} className={`link-pag1`} href={`${baseURL}/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
        </div>
    )
}
