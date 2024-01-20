import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

export default function TextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const handleEditorChange = (content) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
      apiKey="zwrqbb0i47j7by7lq18g88gm2735skoklmy36lf5wi39r3bv"
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      init={{
        plugins:
          " mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        placeholder: "Content"
      }}
      onEditorChange={handleEditorChange}
    />
  );
}

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
