import React from "react";
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
  const contentState = editorState.getCurrentContent();

  const contentAsText = contentState.getPlainText();
  console.log(contentAsText);
  function setFontToBold() {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, "BOLD");
    setEditorState(newEditorState);
  }
  function setFontToItalic() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  }
  function setFontToHeadingOne() {
    setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
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
      // Remove the "# " substring from the beginning of the block

      const selection = SelectionState.createEmpty(currentBlock.getKey()).merge(
        {
          anchorOffset: 0,
          focusOffset: 2,
        }
      );

      // Modify content state
      const updatedContentState = Modifier.replaceText(
        contentState,
        selection,
        currentBlock.getText().substring(2) // Remove the "# " substring
      );
      // Change the block type to 'header-one'
      const updatedContentStateWithHeader = Modifier.setBlockType(
        updatedContentState,
        selection,
        "header-one"
      );

      // Update editor state without pushing the content update
      setEditorState(
        EditorState.set(newEditorState, {
          currentContent: updatedContentStateWithHeader,
        })
      );
    } else {
      const newContentState = Modifier.setBlockType(
        contentState,
        selectionState,
        "unstyled"
      );
      setEditorState(newEditorState);
    }
  };

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
