import React from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

function CodeEditor({ code, onCodeChange, language = 'javascript' }) {
  const handleEditorChange = (value) => {
    onCodeChange(value || '');
  };

  return (
    <div className="code-editor">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}

export default CodeEditor;
