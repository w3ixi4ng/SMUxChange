import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    
    const navigate = useNavigate();
    
    useEffect(() => {
        sessionStorage.clear();
        navigate("/");
    }, [navigate]);
    return(
        <></>
    )
}


export default Logout;