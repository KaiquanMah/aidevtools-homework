import React from 'react';
import './CodeEditor.css';

function CodeEditor({ code, onCodeChange }) {
  return (
    <div className="code-editor">
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
}

export default CodeEditor;
