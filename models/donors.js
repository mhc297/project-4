const db = require('../lib/dbConnect.js');

module.exports = {

  getLargestDonors(req, res, next) {
    db.many(
      `SELECT * FROM donors
      LEFT JOIN senators
      ON donors.sen_id = senators.api_id
      ORDER BY donors.dollar_total DESC
      LIMIT 10;`
      )
    .then((donorData) => {
      res.rows = donorData;
      next();
    })
    .catch(error => next(error));
  },

  getDonorsByState(req, res, next) {
    let stateID = Number.parseInt(req.params.stateID);
    db.any(`
      SELECT *
      FROM donors
      LEFT JOIN senators
      ON donors.sen_id = senators.api_id
      WHERE senators.geojson_id = $1;
      `, [stateID])
    .then((donorData) => {
      res.rows = donorData;
      next();
    })
    .catch(error => next(error));
  },

  getDonorsByStateAndSenator(req, res, next) {
    let stateID = Number.parseInt(req.params.stateID);
    let senatorName = req.params.senatorName;
    db.any(`
      SELECT *
      FROM donors
      LEFT JOIN senators
      ON donors.sen_id = senators.api_id
      WHERE senators.geojson_id = $1
      AND senators.name = $2;
      `, [stateID, senatorName])
    .then((donorData) => {
      res.rows = donorData;
      next();
    })
    .catch(error => next(error));
  },

  getSenatorsByDonor(req, res, next) {
    let donorName = req.params.donorName;
    let donorNameString = `${donorName}`
    db.any(`
      SELECT senators.name,
      donors.org_name,
      senators.state,
      senators.party,
      senators.geojson_id,
      donors.dollar_total
      FROM senators
      LEFT JOIN donors ON senators.api_id = donors.sen_id
      WHERE donors.org_name LIKE $1
      ORDER BY donors.dollar_total ASC;
      `, [donorNameString])
    .then((donorData) => {
      res.rows = donorData;
      next();
    })
    .catch(error => next(error));
  },

  getDistinctDonors(req, res, next) {
    db.many(`
      SELECT DISTINCT org_name
      FROM donors
      ORDER BY org_name ASC;
      `)
    .then((donors) => {
      res.rows = donors;
      next();
    })
    .catch(error => next(error));
  }
}
