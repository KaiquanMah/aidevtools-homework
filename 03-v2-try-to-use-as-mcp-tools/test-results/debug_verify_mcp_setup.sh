#!/bin/bash
# Test script to reproduce the pipe exit code issue

echo "Testing pipe exit code..."
timeout 1s sleep 5 | head -n 1
EXIT_CODE=$?
echo "Exit code of 'timeout 1s sleep 5 | head -n 1': $EXIT_CODE"

if [ $EXIT_CODE -eq 124 ]; then
    echo "Correct: Detected timeout"
else
    echo "Incorrect: Masked by pipe (Result was $EXIT_CODE, expected 124)"
fi

echo ""
echo "Testing with pipefail..."
set -o pipefail
timeout 1s sleep 5 | head -n 1
EXIT_CODE=$?
echo "Exit code with pipefail: $EXIT_CODE"

if [ $EXIT_CODE -eq 124 ]; then
    echo "Correct: Detected timeout with pipefail"
else
    echo "Note: pipefail might not be supported or behaved differently (Result: $EXIT_CODE)"
fi
