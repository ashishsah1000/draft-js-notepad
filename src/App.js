import ReactDOM from "react-dom";
import "./App.css";
import MyEditor from "./components/MyEditor";
import "draft-js/dist/Draft.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
function App() {
  return (
    <div className="App w-full h-[100vh] bg-white p-2">
      <Navbar />
      <MyEditor />
    </div>
  );
}

export default App;
