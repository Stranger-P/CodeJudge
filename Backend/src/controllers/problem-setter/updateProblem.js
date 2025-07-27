const Problem = require('../../models/Problem');
const { uploadToS3, deleteFromS3 } = require('../../utils/s3Utils');

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    statement, 
    inputFormat, 
    outputFormat, 
    constraints, 
    sampleTestCases, 
    testCases, 
    explanation, 
    isPublished,
    difficulty,
    tags
  } = req.body;
  const testCaseFile = req.file;

  try {
    const problem = await Problem.findOne({ _id: id, isDeleted: false });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    if (problem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let parsedSampleTestCases = problem.sampleTestCases;
    if (sampleTestCases) {
      try {
        parsedSampleTestCases = JSON.parse(sampleTestCases);
        if (!Array.isArray(parsedSampleTestCases)) {
          return res.status(400).json({ message: 'sampleTestCases must be an array' });
        }
      } catch (error) {
        return res.status(400).json({ message: 'Invalid sampleTestCases JSON format' });
      }
    }

    let parsedTestCases = problem.testCases;
    if (testCases && !testCaseFile) {
      try {
        parsedTestCases = JSON.parse(testCases);
        if (!Array.isArray(parsedTestCases)) {
          return res.status(400).json({ message: 'testCases must be an array' });
        }
      } catch (error) {
        return res.status(400).json({ message: 'Invalid testCases JSON format' });
      }
    }

    let parsedTags = problem.tags;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) {
          return res.status(400).json({ message: 'tags must be an array' });
        }
      } catch (error) {
        return res.status(400).json({ message: 'Invalid tags JSON format' });
      }
    }

    let testCaseS3Url = problem.testCaseS3Url;
    if (testCaseFile) {
      if (testCaseS3Url) await deleteFromS3(testCaseS3Url);
      testCaseS3Url = await uploadToS3(testCaseFile, id);
    }

    Object.assign(problem, {
      title: title || problem.title,
      statement: statement || problem.statement,
      inputFormat: inputFormat || problem.inputFormat,
      outputFormat: outputFormat || problem.outputFormat,
      constraints: constraints || problem.constraints,
      sampleTestCases: parsedSampleTestCases,
      testCases: testCaseFile ? [] : parsedTestCases,
      testCaseS3Url,
      explanation: explanation !== undefined ? explanation : problem.explanation,
      isPublished: isPublished !== undefined ? isPublished === 'true' : problem.isPublished,
      difficulty: difficulty || problem.difficulty,
      tags: parsedTags,
    });

    await problem.save();
    res.json({ message: 'Problem updated', problem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = updateProblem;