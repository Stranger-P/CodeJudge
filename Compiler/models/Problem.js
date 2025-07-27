const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const sampleTestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },   
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  statement: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  constraints: { type: String, required: true },
  sampleTestCases: [sampleTestCaseSchema],
  testCases: [testCaseSchema],
  testCaseS3Url: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublished: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'Medium'},
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  acceptanceRate : {type: Number, default: 100}, // Percentage of accepted submissions
  totalSubmissions: { type: Number, default: 0 }, // Total submissions for the problem
  acceptedSubmissions: { type: Number, default: 0 }, // Accepted submissions for the problem
});

problemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Problem', problemSchema);