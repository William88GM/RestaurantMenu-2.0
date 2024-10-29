import MenuLogged from "./MenuLogged";
import MenuLogin from "./MenuLogin";

export default function Menu({ editionMode, showMenu, logged, setShowMenu, handleMenu, setShowPassword, showPassword }) {


    return (<>
        {!editionMode && showMenu ? logged ?
            <MenuLogged
                setShowMenu={setShowMenu}
                showMenu={showMenu}
                handleMenu={handleMenu}
                setShowPassword={setShowPassword}
                showPassword={showPassword}
            />
            :
            <MenuLogin
                setShowMenu={setShowMenu}
                showMenu={showMenu}
                handleMenu={handleMenu}
                setShowPassword={setShowPassword}
                showPassword={showPassword}
            />
            :
            ""}
    </>)
}
