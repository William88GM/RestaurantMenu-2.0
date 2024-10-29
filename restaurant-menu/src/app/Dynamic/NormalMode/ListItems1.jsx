import Link from "next/link";

export default function ListItems1({ e, cardRef }) {
    return (
        <div key={e.id} ref={cardRef} className={e.visible ? "" : "hidden"}>
            <Link prefetch={true} className="link-pagSuc" key={e.id} href={`/${e.name.replaceAll(" ", "-")}`}>{e.name}</Link>
        </div>
    )
}
