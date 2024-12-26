import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import socket from "../socket";
import logo from "../assets/logo.png";

function NavigationBar() {
  let [host, setHost] = useState("");

  let navigate = useNavigate();

  const activeLink = {
    color: "orange",
    fontSize: "120%",
  };
  const inactiveLink = {
    color: "white",
  };
  function handleLogout() {
    let host = localStorage.getItem("user");
    socket.emit("remove-user", host);
    localStorage.clear();
    navigate("/login");
  }
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:3500/user-api/pathjump", { token: token })
      .then((res) => {
        if (res.data.success !== true) {
          localStorage.clear();
          setHost("");
          navigate("/");
        } else {
          const user = localStorage.getItem("user");
          setHost(user);
        }
      })
      .catch((err) => alert("Error: " + err.message));
  }, [localStorage.getItem("user")]);
  return (
    <div className="h-auto p-0 w-100">
      <nav className="h-auto m-0 rounded-top navbar navbar-expand-lg navbar-primary bg-primary">
        <NavLink className="nav-link m-1 navbar-brand" to="/">
          <img
            alt=""
            className="me-2 border"
            style={{ borderRadius: "50%", width: "3rem" }}
            src={logo}
          />
          <p className="d-inline mt-2 fs-4 " style={{ position: "absolute" }}>
            ChatLine
          </p>
        </NavLink>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="ms-auto navbar-nav align-items-center me-2">
            {host.length === 0 && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/"
                  style={({ isActive }) => {
                    return isActive ? activeLink : inactiveLink;
                  }}
                >
                  Home
                </NavLink>
              </li>
            )}
            {host.length === 0 && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/login"
                  style={({ isActive }) => {
                    return isActive ? activeLink : inactiveLink;
                  }}
                >
                  Login
                </NavLink>
              </li>
            )}
            {host.length === 0 && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/register"
                  style={({ isActive }) => {
                    return isActive ? activeLink : inactiveLink;
                  }}
                >
                  Register
                </NavLink>
              </li>
            )}
            {host.length !== 0 && (
              <Button
                className="text-white btn btn-danger"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;
