import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";

export default function MyEditor() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [blockKey, setblockKey] = React.useState(null);
  const [style, setstyle] = React.useState(null);
  const contentState = editorState.getCurrentContent();

  const contentAsText = contentState.getPlainText();
  console.log(contentAsText);
  function setFontToBold() {
    setEditorState((editorState) =>
      RichUtils.toggleInlineStyle(editorState, "BOLD")
    );
  }
  function setFontToItalic() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  }
  function setFontToHeadingOne() {
    setEditorState((editorState) =>
      RichUtils.toggleBlockType(editorState, "header-one")
    );
  }
  function setFontToHeadingTwo() {
    setEditorState(RichUtils.toggleBlockType(editorState, "header-two"));
  }
  function setFontToHeadingTwo() {
    setEditorState(RichUtils.toggleBlockType(editorState, "header-three"));
  }

  const handleInputChange = (newEditorState) => {
    let contentState = newEditorState.getCurrentContent();
    let selectionState = newEditorState.getSelection();

    // Get the current selected block
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );

    if (currentBlock.getText().startsWith("# ")) {
      setblockKey(selectionState.getStartKey());
      // Remove the "# " substring from the beginning of the block
      const updatedContentState = Modifier.replaceText(
        contentState,
        selectionState.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        ""
      );
      // Update the editor state with the new content
      const newEditorState = EditorState.push(
        editorState,
        updatedContentState,
        "remove-range"
      );
      setEditorState(() => newEditorState);
      setFontToHeadingOne();
    } else {
      if (blockKey == selectionState.getStartKey()) {
        setEditorState(newEditorState);
      } else {
        console.log(
          "this is what it looks like",
          currentBlock.getText().length
        );
        if (currentBlock.getText().length > 1) {
          setEditorState(newEditorState);
        } else {
          const newContentState = Modifier.setBlockType(
            contentState,
            selectionState,
            "unstyled"
          );
          setEditorState(
            EditorState.set(newEditorState, {
              currentContent: newContentState,
            })
          );
        }
      }
    }
  };
  useEffect(() => {
    if (style === "bold") {
    }
  }, [style]);

  return (
    <div className="w-[80vw] min:h-20 m-auto bg-gray-300 p-4 rounded mt-10">
      <div className="flex gap-2 border px-4 py-1 border-gray-700">
        <button
          className="px-2 py-1 text-xs shadow-lg rounded bg-teal-600 text-gray-200 font-bold"
          onClick={setFontToBold}
        >
          Bold
        </button>
        <button
          className="px-2 py-1 text-xs shadow-lg rounded bg-teal-600 text-gray-200 font-bold"
          onClick={setFontToItalic}
        >
          Italic
        </button>
        <button
          className="px-2 py-1 text-xs shadow-lg rounded bg-teal-600 text-gray-200 font-bold"
          onClick={setFontToHeadingOne}
        >
          Heading
        </button>
      </div>
      <div className="mt-4">
        <Editor editorState={editorState} onChange={handleInputChange} />
      </div>
    </div>
  );
}

// ReactDOM.render(<MyEditor />, document.getElementById("container"));
