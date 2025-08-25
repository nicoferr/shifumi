import { NavLink } from "react-router-dom";

export default function Homepage() {

    return (
        <>
           <NavLink to={"/create-room"}><button className="btn">Create a room</button></NavLink>
            <button className="btn">Solo against Computer</button>
        </>
    );
}