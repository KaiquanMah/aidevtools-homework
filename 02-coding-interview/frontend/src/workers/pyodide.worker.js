/* eslint-disable no-restricted-globals */
import { loadPyodide } from 'pyodide';

let pyodide = null;

async function initPyodide() {
    if (!pyodide) {
        pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
        });
        // Redirect stdout
        await pyodide.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
        `);
    }
    return pyodide;
}

self.onmessage = async (event) => {
    const { code, type } = event.data;

    if (type === 'run') {
        try {
            const py = await initPyodide();

            // Reset stdout buffer
            await py.runPythonAsync('sys.stdout = io.StringIO()');

            // Run user code
            const result = await py.runPythonAsync(code);

            // Get stdout
            const stdout = await py.runPythonAsync('sys.stdout.getvalue()');

            self.postMessage({
                type: 'success',
                output: stdout || (result !== undefined ? String(result) : ''),
                result: result !== undefined ? String(result) : null
            });
        } catch (error) {
            self.postMessage({ type: 'error', error: error.message });
        }
    }
};
