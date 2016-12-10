const apiRouter = require('express').Router();
const { getDonorData } = require('../services/api')

apiRouter.get('/', getDonorData, (req, res) => {
  res.json(res.name)
});

module.exports = apiRouter
