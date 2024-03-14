import React, { useEffect, useState } from "react";

import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  AtomicBlockUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import {
  AiOutlineBold,
  AiOutlineCode,
  AiOutlineItalic,
  AiOutlineLine,
  AiOutlineOrderedList,
  AiOutlineUnderline,
  AiOutlineUnorderedList,
  AiTwotoneWarning,
} from "react-icons/ai";
import { LuHeading1 } from "react-icons/lu";
import {
  loadEditorStateFromLocalStorage,
  retrieveEditorDocumentTitle,
} from "../local/storage";

export default function MyEditor({ updateMainState = () => {} }) {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const [flag, setFlag] = useState(false);
  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: "line-through",
    },
    REDLINE: {
      borderTop: "2px dashed rgba(222,70,22,1)",
      display: "block",
      width: "100% !important",
      paddingTop: "8px",
    },
    REDFONT: {
      color: "red", // Ensuring higher specificity
    },
    BLACKFONT: {
      color: "gray", // Ensuring higher specificity
    },
  };
  const [blockKey, setblockKey] = React.useState(null);
  const [headingOn, setheadingOn] = React.useState(false);
  const contentState = editorState.getCurrentContent();
  const [title, settitle] = useState("");

  // removes the # symbol
  function headingFormater(contentState, selectionState) {
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
    return newEditorState;
  }
  function boldFormater(contentState, selectionState, boldPatternIndex) {
    const startOffset = boldPatternIndex;
    const endOffset = boldPatternIndex + 3; // Length of " ** "
    console.log("this is bold pattern index", startOffset, endOffset);

    // Remove the " ** " pattern from the block text
    const updatedContentState = Modifier.replaceText(
      contentState,
      selectionState.merge({
        anchorOffset: startOffset,
        focusOffset: endOffset,
      }),
      ""
    );
    // Update the editor state with the new content
    const newEditorState = EditorState.push(
      editorState,
      updatedContentState,
      "remove-bold-range"
    );
    setEditorState(() => newEditorState);
  }

  function setFontToBold() {
    setEditorState((editorState) =>
      RichUtils.toggleInlineStyle(editorState, "BOLD")
    );
  }
  function setFontToUnderline() {
    setEditorState((editorState) =>
      RichUtils.toggleInlineStyle(editorState, "UNDERLINE")
    );
  }
  function setFontToItalic() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  }
  const convertToFancy = (newEditorState) => {
    if (!flag) {
      setFlag(() => true);
      console.log("setting redfont");
      setEditorState(() =>
        RichUtils.toggleInlineStyle(newEditorState, "REDFONT")
      );
    } else {
      setFlag(() => false);
      console.log("setting blackfont");

      setEditorState(() =>
        RichUtils.toggleInlineStyle(newEditorState, "BLACKFONT")
      );
    }
    // setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
  };
  function setNewBlock() {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    // Get the current key
    const currentKey = selectionState.getStartKey();

    // Get the next block key
    const nextBlockKey = contentState.getKeyAfter(currentKey);

    // If next block key exists
    if (nextBlockKey) {
      // Change the block type of the next block
      const newContentState = Modifier.setBlockType(
        editorState.getCurrentContent(),
        editorState.getCurrentContent().getSelectionAfter(),
        "div"
      );

      // Update editor state with the new content state
      setEditorState(() =>
        EditorState.push(editorState, newContentState, "paragraph")
      );
    }
  }
  function setFontToHeadingOne() {
    setEditorState((editorState) =>
      RichUtils.toggleBlockType(editorState, "header-one")
    );
  }
  function setFontToCodeblock() {
    setEditorState((editorState) =>
      RichUtils.toggleBlockType(editorState, "code-block")
    );
  }

  function setBlockToUnorderedList() {
    setEditorState(
      RichUtils.toggleBlockType(editorState, "unordered-list-item")
    );
  }
  function setBlockToOrderedList() {
    setEditorState(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
  }
  // function setTextToUnderline() {
  //   setEditorState(RichUtils.toggleBlockType(editorState, "UNDERLINE"));
  // }
  // const addRedLine = () => {
  //   console.log("setting bold");
  //   setEditorState((editorState) =>
  //     RichUtils.toggleInlineStyle(editorState, "REDLINE")
  //   );
  // };

  const addDivWithBorder = (currentEditor) => {
    const contentState = currentEditor.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "DIV",
      "IMMUTABLE",
      { className: "redBorder " }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(currentEditor, {
      currentContent: contentStateWithEntity,
    });

    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  const handleInputChange = (newEditorState) => {
    setEditorState(() => newEditorState);
    let contentState = newEditorState.getCurrentContent();
    let selectionState = newEditorState.getSelection();
    var end = selectionState.getEndOffset();
    // Get the current selected block
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    setblockKey(() => selectionState.getStartKey());
    const blockText = currentBlock.getText();
    console.log("this is changed", blockKey);
    const boldPatternIndex = currentBlock.getText().indexOf("** ");
    if (boldPatternIndex !== -1) {
      boldFormater(contentState, selectionState, boldPatternIndex);
      setFontToBold();
    }

    if (currentBlock.getText().startsWith("# ")) {
      setblockKey(selectionState.getStartKey());
      // Remove the "# " substring from the beginning of the block
      headingFormater(contentState, selectionState);
      setheadingOn(!headingOn);
      setFontToHeadingOne();
    }

    // handle if the ** comes in
    let boldIndex = blockText.indexOf("* ");
    if (boldIndex > -1) {
      selectionState.set("focusOffset", end - 2);
      const newContentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        selectionState.merge({
          anchorOffset: boldIndex,
          focusOffset: boldIndex + 4,
        }),
        ""
      );
      const newFormatedEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(() => newFormatedEditorState);
      setFontToBold();
    }

    let redLineIndex = blockText.indexOf("** ");
    if (redLineIndex > -1) {
      selectionState.set("focusOffset", end - 2);
      const newContentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        selectionState.merge({
          anchorOffset: redLineIndex,
          focusOffset: redLineIndex + 4,
        }),
        ""
      );
      const newFormatedEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(() => newFormatedEditorState);

      convertToFancy(newFormatedEditorState);
    }
    // handle for a single *
    let underlineIndex = blockText.indexOf("*** ");
    if (underlineIndex > -1) {
      selectionState.set("focusOffset", end - 2);
      const newContentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        selectionState.merge({
          anchorOffset: underlineIndex,
          focusOffset: underlineIndex + 4,
        }),
        ""
      );
      const newFormatedEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(() => newFormatedEditorState);
      setFontToUnderline();
    }
    let codeIndex = blockText.indexOf("``` ");
    if (codeIndex > -1) {
      selectionState.set("focusOffset", end - 2);
      const newContentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        selectionState.merge({
          anchorOffset: codeIndex,
          focusOffset: codeIndex + 4,
        }),
        ""
      );
      const newFormatedEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      setEditorState(() => newFormatedEditorState);
      setFontToCodeblock();
    }
    updateMainState(editorState, title);
  };
  useEffect(() => {
    const getStoredTitle = retrieveEditorDocumentTitle();
    console.log(getStoredTitle);
    if (getStoredTitle != null) {
      settitle(getStoredTitle);
    }
    const getStoredEditorState = loadEditorStateFromLocalStorage();
    if (getStoredEditorState != undefined) {
      setEditorState(getStoredEditorState);
    }
  }, []);

  return (
    <div className="sm:w-[95w] md:w-[80vw] h-[90vh] m-auto  p-4 rounded mt-20 ">
      <div className="mt-4 h-full p-2 flex flex-col">
        <div className="heading my-4">
          <input
            type="text"
            name=""
            id=""
            placeholder="Title of the document..."
            className="sm:text-2xl md:text-3xl outline-none text-gray-700 dark:text-gray-400 dark:bg-gray-950 font-extrabold uppercase w-full"
            onChange={(e) => {
              settitle(() => e.target.value);
              updateMainState(editorState, title);
            }}
            defaultValue={title.length > 0 ? title : ""}
          />
        </div>
        <span className="font-thin text-sm text-gray-400">Your notepad</span>
        <div className="flex justify-end   px-4 py-1 ">
          <div className="flex-grow"></div>
          <div>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={setFontToBold}
            >
              <AiOutlineBold size={18} />
            </button>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={setFontToItalic}
            >
              <AiOutlineItalic size={18} />
            </button>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={setFontToHeadingOne}
            >
              <LuHeading1 size={20} />
            </button>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={setFontToUnderline}
            >
              <AiOutlineUnderline size={20} />
            </button>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={setBlockToUnorderedList}
            >
              <AiOutlineUnorderedList size={20} />
            </button>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={setBlockToOrderedList}
            >
              <AiOutlineOrderedList size={20} />
            </button>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={setFontToCodeblock}
            >
              <AiOutlineCode size={20} />
            </button>
            <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={() => addDivWithBorder(editorState)}
            >
              <AiOutlineLine size={20} />
            </button>
            {/* <button
              className="px-2 py-1 text-xs hover:shadow rounded  text-gray-500 font-bold"
              onClick={() => convertToFancy(editorState)}
            >
              <AiTwotoneWarning size={20} />
            </button> */}
          </div>
        </div>

        <div
          className="mt-8 h-[60vh]  overflow-y-scroll text-gray-400 "
          style={{
            all: "revert !important",
          }}
        >
          <Editor
            editorState={editorState}
            onChange={handleInputChange}
            customStyleMap={styleMap}
            placeholder="Start writing here"
            // handleReturn={handleReturn}
          />
        </div>
      </div>
    </div>
  );
}

// ReactDOM.render(<MyEditor />, document.getElementById("container"));
