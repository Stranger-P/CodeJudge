const { exec: callbackExec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util');

const exec = util.promisify(callbackExec);

const sandboxExecute = async (code, language, input) => {
  const tempDir = path.join(__dirname, `temp_${uuidv4()}`);
  const codeFileName = language === 'java' ? 'Main.java' : `code.${language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'}`;
  const codeFile = path.join(tempDir, codeFileName);
  const inputFile = path.join(tempDir, 'input.txt');
  const outputFile = path.join(tempDir, 'output.txt');
  const filesToClean = [codeFile, inputFile, outputFile];
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(codeFile, code);
    await fs.writeFile(inputFile, input);

    let compileCommand = '';
    let runCommand = '';

    if (language === 'cpp') {
      const executableFile = path.join(tempDir, 'code');
      compileCommand = `g++ "${codeFile}" -o "${executableFile}"`;
      runCommand = `"${executableFile}"`;
      filesToClean.push(executableFile);
    } else if (language === 'python') {
      runCommand = `python3 "${codeFile}"`;
    } else if (language === 'javascript') {
      runCommand = `node "${codeFile}"`;
    } else if (language === 'java') {
      compileCommand = `javac "${codeFile}"`;
      runCommand = 'java -cp . Main';
      filesToClean.push(path.join(tempDir, 'Main.class'));
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }

    if (compileCommand) {
      try {
        await exec(compileCommand, { cwd: tempDir, timeout: 5000 });
      } catch (error) {
        return { output: null, error: `Compilation Error: ${error.stderr || error.message}` };
      }
    }

    const runCommandWithRedirection = `${runCommand} < "${inputFile}" > "${outputFile}"`;
    try {
      await exec(runCommandWithRedirection, {
        cwd: tempDir,
        timeout: 2000,
      });
    } catch (error) {
      if (error.killed) {
        return { output: null, error: 'Time Limit Exceeded' };
      }
      return { output: null, error: `Runtime Error: ${error.stderr || error.message}` };
    }

    const finalOutput = await fs.readFile(outputFile, 'utf8');
    return { output: finalOutput.trim(), error: null };

  } catch (error) {
    return { output: null, error: error.message };
  } finally {
    await Promise.all(filesToClean.map(file => fs.unlink(file).catch(() => {})));
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
};

module.exports = { sandboxExecute };
