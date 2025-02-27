import axios from "axios";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BiHide, BiShow } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

function Register() {
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let [err, setErr] = useState("");
  const navigate = useNavigate();
  let [show, setShow] = useState(false);
  let [repeatShow, setRepeatShow] = useState(false);

  function submitRegister(obj) {
    axios
      .post("https://chatline-gz0q.onrender.com/user-api/register", obj)
      .then((res) => {
        if (res.data.success === true) {
          navigate("/login");
        } else {
          setErr(res.data.message);
        }
      })
      .catch((err) => setErr(err.message));
  }

  return (
    <div
      className="container d-flex flex-wrap justify-content-around h-100 overflow-auto"
      style={{ position: "relative" }}
    >
      <div
        className="mt-auto mb-auto"
        style={{ position: "relative", width: "40rem" }}
      >
        <img
          alt=""
          src="https://cdn.dribbble.com/users/267404/screenshots/3713416/media/6a7e93dc6473c86476d748e82f917cea.png?compress=1&resize=800x600&vertical=center"
          className="w-100 mt-auto"
          style={{ borderRadius: "50%" }}
        />
        <img
          alt=""
          style={{
            position: "absolute",
            width: "25%",
            borderRadius: "50%",
            top: "33%",
            left: "37%",
          }}
          className=""
          src={logo}
        />
      </div>
      <div className="d-flex align-items-center justify-content-center me-5 ms-5">
        <form
          className="d-flex flex-column"
          style={{ position: "" }}
          onSubmit={handleSubmit(submitRegister)}
        >
          <h1 className="display-6 mb-5 text- text-center">
            {" "}
            <u> Register Here </u>{" "}
          </h1>
          {err.length !== 0 && <p className="lead text-danger">*{err}</p>}
          <input
            type="text"
            className="mt-3 rounded fs-5 ps-2"
            placeholder="Enter your Name"
            {...register("username", { required: true })}
          />
          <label className="ms-5 text-dark">
            *This will be used as your Name in the Chats
          </label>
          {errors.username?.type === "required" && (
            <p className="text-danger">*UserName is required</p>
          )}
          <input
            type="text"
            className="mt-3 rounded fs-5 ps-2"
            placeholder="Create a UserID"
            {...register("userid", { required: true })}
          />
          <label className="ms-5 text-dark">
            *This will be used as your UserID in the Chats
          </label>
          {errors.userid?.type === "required" && (
            <p className="text-danger">*UserID is required</p>
          )}
          <input
            type="email"
            className="mt-3 rounded fs-5 ps-2"
            placeholder="Enter your Email"
            {...register("email", { required: true })}
          />
          {errors.email?.type === "required" && (
            <p className="text-danger">*Email is required</p>
          )}
          <input
            type="number"
            className="mt-3 rounded fs-5 ps-2"
            placeholder="Enter Mobile Number"
            {...register("mobile")}
          />
          <div className="d-flex p-0">
            <input
              type={show ? "text" : "password"}
              className="mt-3 rounded fs-5 ps-2"
              placeholder="Enter Password"
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
          {errors.password?.type === "required" && (
            <p className="text-danger">*Password is required</p>
          )}
          <div className="d-flex p-0">
            <input
              type={repeatShow ? "text" : "password"}
              className="mt-3 rounded fs-5 ps-2"
              placeholder="Repeat Password"
              {...register("repeatPassword", { required: true })}
            />
            <NavLink
              onClick={() => setRepeatShow(!repeatShow)}
              className="mt-3 ms-2 nav-link pt-1"
            >
              {repeatShow ? (
                <BiHide className="fs-4 m-0" />
              ) : (
                <BiShow className="fs-4 m-0" />
              )}
            </NavLink>
          </div>
          {errors.repeatPassword?.type === "required" && (
            <p className="text-danger">*RepeatPassword is required</p>
          )}
          <label className="mt-3 text-dark lead fs-5">
            Upload your profile pic
          </label>
          <input type="file" {...register("picture")} />
          <Button
            className="btn btn-success text-center m-auto mt-3 mb-3"
            type="submit"
            style={{ width: "35%" }}
          >
            {" "}
            Submit{" "}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;
