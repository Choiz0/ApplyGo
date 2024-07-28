import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../util/authContext";

const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isLoggedIn && !user) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? (
    <>
      <Navigation />
      <Outlet />
    </>
  ) : null;
};

export default Layout;
