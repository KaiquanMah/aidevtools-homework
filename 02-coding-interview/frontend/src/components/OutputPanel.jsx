import React from 'react';
import './OutputPanel.css';

function OutputPanel({ output, error, onClear }) {
    const hasOutput = output && output.trim().length > 0;

    return (
        <div className="output-panel">
            <div className="output-header">
                <h4>Output</h4>
                {hasOutput && (
                    <button onClick={onClear} className="clear-output-btn">
                        Clear
                    </button>
                )}
            </div>
            <div className={`output-content ${error ? 'error' : ''} ${!hasOutput ? 'empty' : ''}`}>
                {hasOutput ? output : 'Run code to see output here...'}
            </div>
        </div>
    );
}

export default OutputPanel;
