const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { 
    type: String, 
    enum: ['cpp', 'python', 'java', 'javascript'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending','Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'], 
    required: true 
  },
  runtime: { type: Number }, // in milliseconds
  memory: { type: Number }, // in MB, optional
  failedTestCase: { // Optional, shown for Wrong Answer
    input: { type: String },
    expectedOutput: { type: String },
    actualOutput: { type: String }
  },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);