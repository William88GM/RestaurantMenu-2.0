
import Link from "next/link"

export default function Header({ navigateTo, isHome, logged, editionMode, showMenu, handleMenu }) {

    const logoImg = `${process.env.NEXT_PUBLIC_URL}/images/Title.webp`



    return (
        <header>
            <Link prefetch={false} href={navigateTo}>
                <img className='title' src={logoImg} alt="Título La Vene" />
            </Link>


            {isHome ?
                <>
                    {!editionMode && showMenu ?
                        <svg className='esquinaSupDerecha menuSuperior' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none" alt="esquinaSupDerecha">
                            <path d="M0 0H138V138L0 0Z" fill="#900020" />
                        </svg>
                        : <svg className={`esquinaSupDerecha ${!editionMode && "cursor-pointer"}`} onClick={handleMenu} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                            <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                        </svg>
                    }
                </>
                :
                <>
                    {logged ? !editionMode && showMenu ?
                        <svg className='esquinaSupDerecha menuSuperior' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none" alt="esquinaSupDerecha">
                            <path d="M0 0H138V138L0 0Z" fill="#900020" />
                        </svg>
                        : <svg className={`esquinaSupDerecha ${!editionMode && "cursor-pointer"}`} onClick={handleMenu} xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                            <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                        </svg>
                        :
                        <svg className='esquinaSupDerecha' xmlns="http://www.w3.org/2000/svg" alt="esquinaSupDerecha" viewBox="0 0 138 138" fill="none">
                            <path d="M0 0H138V138L0 0Z" fill="#b32624" />
                        </svg>}
                </>}

        </header >

    )
}
