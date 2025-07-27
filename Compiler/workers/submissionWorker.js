const Queue = require('bull');
const axios = require('axios');
const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Ensure MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected in submissionWorker');
}).catch((err) => {
  console.error('MongoDB connection error in submissionWorker:', err.message);
});

const submissionQueue = new Queue('submissionQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

submissionQueue.process(5, async (job) => {
  const { submissionId, code, language, testCases } = job.data;

  try {
    if (!submissionId || !code || !language || !testCases) {
      throw new Error('Invalid job data: missing required fields');
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found in database`);
    }
    console.log(submission);
    const response = await axios.post('http://13.201.183.179:2000/api/submit', {
      code,
      language,
      sampleTestCases: testCases,
    }, { timeout: 20000 });
    const { verdict, failedTestCase } = response.data;
    console.log(verdict);
    await Submission.updateOne(
      { _id: submissionId },
      {
        status: verdict,
        failedTestCase: failedTestCase || null,
        completedAt: new Date(),
      }
    );
      
    if (submission.problemId) {
      const problem = await Problem.findById(submission.problemId);
      if (problem) {
        problem.totalSubmissions += 1;
        if (verdict === 'Accepted') {
          problem.acceptedSubmissions += 1;
        }
    
        problem.acceptanceRate = parseFloat(
          (problem.acceptedSubmissions / problem.totalSubmissions * 100).toFixed(2)
        );
    
        await problem.save();
      }
    }

    return { submissionId, verdict, failedTestCase };
  } catch (error) {
    console.log(error);
    await Submission.updateOne(
      { _id: submissionId },
      {
        status: 'Error',
        error: error.message,
        completedAt: new Date(),
      }
    );
    throw error;
  }
});

process.on('unhandledRejection', (error) => {
  // Optional: log critical issues if needed
});
