import ReactDOM from "react-dom";
import "./App.css";
import MyEditor from "./components/MyEditor";
import "draft-js/dist/Draft.css";
import { useState } from "react";
function App() {
  return (
    <div className="App bg-sky-400 p-2">
      <h1 className="text-3xl font-bold">Namste tailwind</h1>
      <MyEditor />
    </div>
  );
}

export default App;
