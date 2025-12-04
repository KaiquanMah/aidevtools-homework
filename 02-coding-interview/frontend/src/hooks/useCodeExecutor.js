import { useEffect, useRef, useState } from 'react';

export const useCodeExecutor = (language) => {
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);
    const pyodideRef = useRef(null);
    const [pyodideLoaded, setPyodideLoaded] = useState(false);

    // Load Pyodide on mount
    useEffect(() => {
        const loadPyodide = async () => {
            if (language === 'python' && !pyodideRef.current) {
                try {
                    const { loadPyodide: loadPyodideFunc } = await import('pyodide');
                    pyodideRef.current = await loadPyodideFunc({
                        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
                    });
                    setPyodideLoaded(true);
                } catch (err) {
                    console.error('Failed to load Pyodide:', err);
                    setError('Failed to load Python runtime');
                }
            }
        };
        loadPyodide();
    }, [language]);

    const executeCode = async (code) => {
        setOutput('');
        setError(null);
        setIsRunning(true);

        try {
            if (language === 'javascript') {
                // Execute JavaScript
                const capturedOutput = [];
                const originalConsoleLog = console.log;

                // Override console.log to capture output
                console.log = (...args) => {
                    capturedOutput.push(args.map(arg =>
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' '));
                };

                try {
                    // Execute with timeout
                    const result = await Promise.race([
                        new Promise((resolve) => {
                            const fn = new Function(code);
                            const returnValue = fn();
                            resolve(returnValue);
                        }),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000)
                        )
                    ]);

                    // Restore console.log
                    console.log = originalConsoleLog;

                    if (capturedOutput.length > 0) {
                        setOutput(capturedOutput.join('\n'));
                    } else if (result !== undefined) {
                        setOutput(String(result));
                    } else {
                        setOutput('Code executed successfully (no output)');
                    }
                } catch (err) {
                    console.log = originalConsoleLog;
                    throw err;
                }
            } else if (language === 'python') {
                // Execute Python with Pyodide
                if (!pyodideRef.current) {
                    throw new Error('Python runtime not loaded. Please wait...');
                }

                // Redirect stdout
                await pyodideRef.current.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
`);

                // Execute code with timeout
                const result = await Promise.race([
                    pyodideRef.current.runPythonAsync(code),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Execution timeout (5s)')), 5000)
                    )
                ]);

                // Get stdout
                const stdout = await pyodideRef.current.runPythonAsync('sys.stdout.getvalue()');

                if (stdout) {
                    setOutput(stdout);
                } else if (result !== undefined && result !== null) {
                    setOutput(String(result));
                } else {
                    setOutput('Code executed successfully (no output)');
                }
            }
        } catch (err) {
            setError(err.message || 'Execution error');
            setOutput(`Error: ${err.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    return {
        executeCode,
        output,
        isRunning,
        error,
        pyodideLoaded: language === 'javascript' || pyodideLoaded,
    };
};
