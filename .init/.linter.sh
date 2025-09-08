#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-to-do-application-1061-1072/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

