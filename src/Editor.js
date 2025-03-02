import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const socket = io("http://localhost:5000");

const Editor = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    axios.get("http://localhost:5000/text").then((res) => setText(res.data));

    socket.on("receiveText", (newText) => setText(newText));

    return () => socket.off("receiveText");
  }, [navigate]);

  const handleChange = (value) => {
    setText(value);
    socket.emit("updateText", value);
  };

  return (
    <div>
      <h2>Collaborative Text Editor</h2>
      <ReactQuill value={text} onChange={handleChange} />
    </div>
  );
};

export default Editor;
