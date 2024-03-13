import ReactDOM from "react-dom";
import "./App.css";
import MyEditor from "./components/MyEditor";
import "draft-js/dist/Draft.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import {
  saveEditorStateToLocalStorage,
  storeEditorDocumentTitle,
} from "./local/storage";
function App() {
  const [editorState, seteditorState] = useState(null);
  const [title, setTitle] = useState("");
  const [darkMode, setdarkMode] = useState(false);
  const getUpdatedEditorState = (newEditorState, newTitle) => {
    console.log("🚀 ~ getUpdatedEditorState ~ title:", newTitle);
    seteditorState(() => newEditorState);
    setTitle(newTitle);
  };
  const saveDocument = () => {
    console.log("trying to save the document", title);
    storeEditorDocumentTitle(title);
    saveEditorStateToLocalStorage(editorState);
  };
  const toggleDarkMode = () => {
    setdarkMode(() => !darkMode);
  };
  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <div className="w-full h-[100vh] bg-white dark:bg-gray-950 p-2 ">
        <Navbar
          saveDocument={saveDocument}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />
        <MyEditor updateMainState={getUpdatedEditorState} />
      </div>
    </div>
  );
}

export default App;
