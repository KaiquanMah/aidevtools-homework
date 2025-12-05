import { useEffect, useRef, useState } from 'react';

export const useCodeExecutor = (language) => {
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);
    const workerRef = useRef(null);
    const [pyodideLoaded, setPyodideLoaded] = useState(false);

    // Initialize Worker
    useEffect(() => {
        if (language === 'python' && !workerRef.current) {
            try {
                workerRef.current = new Worker(new URL('../workers/pyodide.worker.js', import.meta.url), {
                    type: 'module'
                });
                setPyodideLoaded(true); // Worker loads async, but we assume it's ready to accept messages

                workerRef.current.onmessage = (event) => {
                    const { type, output: workerOutput, error: workerError } = event.data;
                    setIsRunning(false);

                    if (type === 'success') {
                        setOutput(workerOutput || 'Code executed successfully (no output)');
                    } else if (type === 'error') {
                        setError(workerError);
                        setOutput(`Error: ${workerError}`);
                    }
                };
            } catch (err) {
                console.error('Failed to initialize Pyodide worker:', err);
                setError('Failed to initialize Python runtime');
            }
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, [language]);

    const executeCode = async (code) => {
        setOutput('');
        setError(null);
        setIsRunning(true);

        try {
            if (language === 'javascript') {
                // Execute JavaScript (Main Thread - Safe enough for simple JS)
                const capturedOutput = [];
                const originalConsoleLog = console.log;

                console.log = (...args) => {
                    capturedOutput.push(args.map(arg =>
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' '));
                };

                try {
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
                setIsRunning(false);
            } else if (language === 'python') {
                // Execute Python via Web Worker
                if (!workerRef.current) {
                    throw new Error('Python runtime not initialized');
                }

                // Send code to worker
                workerRef.current.postMessage({ type: 'run', code });

                // Timeout handling for worker
                setTimeout(() => {
                    if (isRunning) {
                        // If still running after 10s, terminate and restart
                        workerRef.current.terminate();
                        workerRef.current = new Worker(new URL('../workers/pyodide.worker.js', import.meta.url), {
                            type: 'module'
                        });
                        // Re-attach listener
                        workerRef.current.onmessage = (event) => {
                            const { type, output: workerOutput, error: workerError } = event.data;
                            setIsRunning(false);
                            if (type === 'success') setOutput(workerOutput);
                            else if (type === 'error') { setError(workerError); setOutput(`Error: ${workerError}`); }
                        };

                        setIsRunning(false);
                        setError('Execution timeout (10s)');
                        setOutput('Error: Execution timeout (10s) - Worker terminated');
                    }
                }, 10000);
            }
        } catch (err) {
            setError(err.message || 'Execution error');
            setOutput(`Error: ${err.message}`);
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
