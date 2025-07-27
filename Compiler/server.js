const express = require('express');
const cors = require('cors');
const codeRoutes = require('./routes/codeRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
}));
app.use('/', codeRoutes);
const PORT = process.env.PORT;
require("./workers/submissionWorker")
app.listen(PORT, () => console.log(`Compiler server running on port ${PORT}`));   