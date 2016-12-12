// this route is /db
const dbRouter = require('express').Router();
const dbDonors = require('../models/donors.js');

dbRouter.get('/donors/donorList', dbDonors.getDistinctDonors, (req, res, next) => {
  res.json(res.rows);
} )

dbRouter.get('/donors/:stateID', dbDonors.getDonorsByState, (req, res, next) =>{
  res.json(res.rows);
});

dbRouter.get('/donors/byDonor/:donorName', dbDonors.getSenatorsByDonor, (req, res, next) => {
  res.json(res.rows);
});

// dbRouter.get('/donors/:stateID/:senatorID', dbDonors.getDonorsByStateAndSenator, (req, res, next) =>{
//   res.json(res.rows);
// });

module.exports = dbRouter;
