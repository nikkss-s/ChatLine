import axios from "axios";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BiHide, BiShow } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import socket from "../socket";
import logo from "../assets/logo.png";

function Login() {
  let { register, handleSubmit } = useForm();
  let [err, setErr] = useState("");
  const navigate = useNavigate();
  let [show, setShow] = useState(false);

  function submitLogin(obj) {
    axios
      .post("http://localhost:3500/user-api/login", obj)
      .then((res) => {
        if (res.data.success === true) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", res.data.user);
          setErr("");
          socket.emit("new-connection", res.data.user);
          navigate("/chat");
        } else {
          setErr(res.data.message);
        }
      })
      .catch((error) => setErr(error.message));
  }

  return (
    <div
      className="container d-flex flex-wrap justify-content-evenly overflow-auto h-100"
      style={{ position: "relative" }}
    >
      <div className="mt-auto mb-auto" style={{ position: "relative" }}>
        <img
          alt=""
          src="https://img.freepik.com/free-vector
        /dialogue-chat-clouds-speech-bubble-icon-from-lines-triangles-particle-style-design-low-poly-technology-devices
        -people-communication-concept-blue-background_587448-471.jpg?size=626&ext=jpg&ga=GA1.1.503943051.1686425803&semt=ais"
          className="rounded-4 w-100"
        />

        <h1
          className="text-warning"
          style={{ position: "absolute", top: "60%", left: "15%" }}
        >
          <i>ChatLine</i>
        </h1>
        <img
          alt=""
          className=""
          style={{
            position: "absolute",
            borderRadius: "50%",
            top: "2rem",
            left: "2rem",
            width: "7rem",
          }}
          src={logo}
        />
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mt-auto mb-auto">
        <form
          onSubmit={handleSubmit(submitLogin)}
          className="text-center d-flex flex-column justify-content-center align-items-center"
        >
          <h1 className="display-5 mt-4">
            {" "}
            Login To <i>Cht</i>
          </h1>
          {err.length !== 0 && <p className="lead text-danger">*{err}</p>}
          <div className="d-flex flex-column">
            <input
              type="text"
              placeholder="Enter UserId"
              className="rounded mt-3 fs-5 ps-2"
              {...register("userid", { required: true })}
            />
            <div className="d-flex p-0">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                className="rounded mt-3 fs-5 ps-2"
                {...register("password", { required: true })}
              />
              <NavLink
                onClick={() => setShow(!show)}
                className="mt-3 ms-2 nav-link pt-1"
              >
                {show ? (
                  <BiHide className="fs-4 m-0" />
                ) : (
                  <BiShow className="fs-4 m-0" />
                )}
              </NavLink>
            </div>
          </div>
          <Button type="submit" className="mt-3 btn btn-success">
            {" "}
            Login{" "}
          </Button>
          <NavLink className="text-danger mt-3 ms-auto" to="/forgotPass">
            {" "}
            Forgot Password{" "}
          </NavLink>
        </form>
      </div>
    </div>
  );
}

export default Login;
