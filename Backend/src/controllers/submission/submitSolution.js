const Problem = require('../../models/Problem');
const Submission = require('../../models/Submission');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');

const submitSolution = async (req, res) => {
  const { problemId, code, language } = req.body;
  // console.log(code);
  if (!problemId || !code || !language)
    return res.status(400).json({ message: 'Problem ID, code, and language are required' });

  try {
    const s3 = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const problem = await Problem.findOne({ _id: problemId, isPublished: true, isDeleted: false });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    let testCases = problem.testCases || [];

    // Handle test cases from S3
    if (problem.testCaseS3Url) {
      const key = problem.testCaseS3Url.split('/').pop();
      const command = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: `test-cases/${key}` });
      const response = await s3.send(command);
      const fileContent = await response.Body.transformToString();

      try {
        const parsedTestCases = JSON.parse(fileContent);
        if (Array.isArray(parsedTestCases) && parsedTestCases.every(tc => 'input' in tc && 'output' in tc)) {
          testCases = parsedTestCases;
        }
      } catch (err) {
        console.error('Failed to parse test cases:', err.message);
      }
    }

    if (!testCases.length)
      return res.status(500).json({ message: 'No test cases available' });

    // Create submission in DB
    const submission = new Submission({
      userId: req.user.id,
      problemId,
      code,
      language,
      status: 'Pending',
    });
    await submission.save();

    // Run code via external compiler
    const compileRes = await axios.post(`${process.env.COMPILER_SERVICE_URL}/api/submit`, {
      code,
      language,
      sampleTestCases: testCases,
    }, { timeout: 20000 });

    const { verdict, failedTestCase } = compileRes.data;

    // Update submission
    submission.status = verdict;
    submission.failedTestCase = failedTestCase || null;
    submission.completedAt = new Date();
    await submission.save();

    // Update problem stats
    problem.totalSubmissions += 1;
    if (verdict === 'Accepted') problem.acceptedSubmissions += 1;
    problem.acceptanceRate = parseFloat((problem.acceptedSubmissions / problem.totalSubmissions * 100).toFixed(2));
    await problem.save();

    return res.status(200).json({
      message: 'Submission evaluated',
      submission: {
        _id: submission._id,
        status: verdict,
        failedTestCase: failedTestCase || null,
      },
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = submitSolution;
