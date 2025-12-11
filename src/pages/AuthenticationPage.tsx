import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import "@/App.css";

const AuthenticationPage = () => {

  const navigate = useNavigate();


  
  return (
    <div className="min-h-screen bg-background">
        <form>
            <button className = "homePageButtons" onClick={() => navigate(`/login`)}>
                Login
            </button>
            <button className = "homePageButtons" onClick={() => navigate(`/signup`)}>
                Sign Up
            </button>
        </form>
      
    </div>
  );
};

export default AuthenticationPage;
