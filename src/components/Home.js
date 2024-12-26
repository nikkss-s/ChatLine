import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import home from "../assets/home.png";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/chat");
  }, []);

  return (
    <div className="border w-100 d-flex" style={{ maxHeight: "100%" }}>
      <img
        className="m-auto w-100"
        style={{ maxHeight: "100%" }}
        src={home}
      />
    </div>
  );
}

export default Home;
