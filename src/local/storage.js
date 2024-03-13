import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
export function storeEditorDocumentTitle(title) {
  localStorage.setItem("editorDocumentTitle", title);
}

export function retrieveEditorDocumentTitle() {
  const title = localStorage.getItem("editorDocumentTitle");
  if (title === null) return null;
  else return title;
}

export function saveEditorStateToLocalStorage(editorState) {
  try {
    const serializedEditorState = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    // Save
    localStorage.setItem("myDocumentEditorState", serializedEditorState);
  } catch (error) {
    // Handle errors, e.g., when local storage is full
    console.error("Failed to save editor state to local storage:", error);
  }
}

export function loadEditorStateFromLocalStorage() {
  try {
    const serializedEditorState = localStorage.getItem("myDocumentEditorState");
    if (serializedEditorState === null) {
      return undefined; // If no editor state found in local storage
    }
    const rawEditorState = JSON.parse(serializedEditorState);
    const retrievedEditorState = EditorState.createWithContent(
      convertFromRaw(rawEditorState)
    );

    return retrievedEditorState;
  } catch (error) {
    // Handle errors, e.g., when local storage is not accessible or JSON parsing fails
    console.error("Failed to load editor state from local storage:", error);
    return undefined;
  }
}
