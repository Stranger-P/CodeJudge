const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { sandboxExecute } = require('../utils/sandbox');

const executeCode = async (code, language, input) => {
  return await sandboxExecute(code, language, input);
};

const submitCode = async (req, res) => {
  const { code, language, sampleTestCases } = req.body;
  let verdict = 'Accepted';
  let failedTestCase = null;
  for (const testCase of sampleTestCases) {
    const result = await executeCode(code, language, testCase.input);
    if (result.error) {
      verdict = result.error === 'Time Limit Exceeded' ? 'TLE' :
                result.error === 'Memory Limit Exceeded' ? 'MLE' : 'Compilation Error';
      break;
    }
    if (result.output.trim() !== testCase.output.trim()) {
      verdict = 'Wrong Answer on Test Case';
      failedTestCase = { input: testCase.input, expectedOutput: testCase.output, actualOutput: result.output };
      break;
    }
  }
  console.log(verdict);
  res.json({ verdict, failedTestCase });
};

const runCode = async (req, res) => {
  const { code, language, input } = req.body;
  if (!code || !language || !input) {
    return res.status(400).json({ output: null, error: 'Code, language, and input are required' });
  }
  const result = await executeCode(code, language, input)
  res.json(result);
};

module.exports = { runCode, submitCode };