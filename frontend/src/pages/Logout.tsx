import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
    
    const navigate = useNavigate();
    
    useEffect(() => {
        sessionStorage.clear();
        // Dispatch custom event to notify navbar of logout
        window.dispatchEvent(new Event('authChange'));
        navigate("/");
    }, []);
    
    return(
        <div 
            className="flex flex-col items-center justify-center relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
            style={{
                backgroundColor: "#eeeeee",
                color: "#102b72",
            }}
        >
          
            <div className="relative z-10 text-center">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: "#102b72" }}>Logging out...</h2>
                <p className="text-sm" style={{ color: "#102b72", opacity: 0.7 }}>Redirecting to home page</p>
            </div>
        </div>
    )
}


export default Logout;