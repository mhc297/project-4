// Jason & https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
// require senatorIDArray from 'senatorArray.js'
const fetch = require('node-fetch')

// array of 100 senators to be fetched
const senatorIDArray = [
  'N00009920',
  'N00003062',
  'N00026050',
  'N00035774',
  'N00006424',
  'N00009573',
  'N00013873',
  'N00033363',
  'N00007364',
  'N00006692',
  'N00030608',
  'N00030780',
  'N00031685',
  'N00027566',
  'N00012508',
  'N00031820',
  'N00009926',
  'N00030612',
  'N00002593',
  'N00035516',
  'N00028138',
  'N00028139',
  'N00006267',
  'N00029441',
  'N00004981',
  'N00012539',
  'N00003845',
  'N00026586',
  'N00001758',
  'N00035483',
  'N00005285',
  'N00005282',
  'N00003389',
  'N00030836',
  'N00009659',
  'N00030245',
  'N00000491',
  'N00034580',
  'N00001945',
  'N00001955',
  'N00033492',
  'N00000270',
  'N00004118',
  'N00029277',
  'N00027500',
  'N00029016',
  'N00003328',
  'N00003280',
  'N00027694',
  'N00005195',
  'N00027605',
  'N00033054',
  'N00033443',
  'N00035544',
  'N00009922',
  'N00027522',
  'N00024790',
  'N00030980',
  'N00000699',
  'N00035267',
  'N00006561',
  'N00029835',
  'N00001093',
  'N00027658',
  'N00002221',
  'N00035492',
  'N00031688',
  'N00033782',
  'N00003535',
  'N00003682',
  'N00005582',
  'N00031129',
  'N00007724',
  'N00029303',
  'N00027503',
  'N00001489',
  'N00000362',
  'N00027533',
  'N00009975',
  'N00031782',
  'N00004572',
  'N00035187',
  'N00009888',
  'N00027441',
  'N00024852',
  'N00033085',
  'N00009869',
  'N00031696',
  'N00009918',
  'N00000528',
  'N00002097',
  'N00033177',
  'N00007876',
  'N00007836',
  'N00032838',
  'N00009771',
  'N00032546',
  'N00004367',
  'N00006249',
  'N00006236']

function getDonorData(req, res, next) {
  // collector which will grab stringified donor fields
  res.name = [];

  // each fetch call to be run per senator (bound at bottom)
  const getOneDonor = (senator) =>
    fetch(`http://www.opensecrets.org/api/?method=candContrib&cid=${senator}&cycle=2016&apikey=7c5ba725c7f265595be2ce33526ef3a3&output=json`)
      .then(r => r.json())
      .then((response) => {

        // for each response, we'll collect the transformation into res.name
        response.response.contributors.contributor.reduce((collector,attr) => {
          // loop over the keys of the
          const row = Object.keys(attr['@attributes'])
            .map(key => {
              const value = attr['@attributes'][key].replace(/'/i, "''")
              return `'${value}'`;
            })
            .join(',');
          // push the new string into the collector
          collector.push(`'${senator}',${row}`);
          return collector;
        }, res.name);

     })
    .catch(error => console.log(error));


  // creates an array of promises that closes over the getOneDonor function with the value of a unique senator
  const allAsyncCalls = senatorIDArray.map((senator) => {
    return new Promise((resolve,reject) => resolve(getOneDonor(senator)));
  });

  // takes the array of promises above
  Promise.all( allAsyncCalls )
  /* postpones the next call until all 100 fetch calls have been run */
  .then(() => next() )
  .catch(error => console.log(error))

}

module.exports = { getDonorData }
