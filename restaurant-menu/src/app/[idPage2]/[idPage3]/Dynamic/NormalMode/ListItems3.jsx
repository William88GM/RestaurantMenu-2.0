import Link from "next/link";

export default function ListItems3({ e, baseURL, }) {
    return (
        <div key={e.id} className={e.visible ? 'link-pag2' : "hidden"}>
            <Link prefetch={true} id={`link-pag2-${e.id}`} className='link-pag2 [padding:2px] rounded-md' href={`${baseURL}/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
            {e.image ? <img src={e.image} className="cursor-pointer" onClick={() => document.getElementById(`link-pag2-${e.id}`).click()} width="30px" height="30px" alt={e.name} /> : <div className={`animate-pulse space-x-4 pulseBackground aspect-square pr-6 h-[30px] w-[30px] rounded`}></div>}
        </div>
    )
}
