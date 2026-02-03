import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700">
      <Editor
        apiKey='kt2g7qgcjwtq0zwx431kfuf2hpbomfqabtj477scefs1rmi7' // Users should replace this with their own key
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'image media table | removeformat | help',
          content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px; background-color: #1e293b; color: #f1f5f9; }',
          skin: 'oxide-dark',
          content_css: 'dark'
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;
