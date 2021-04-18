'use strict';

const _ = require('lodash');
const { default: createStrapi } = require('strapi');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = () => {
  const csv2Json = require('convert-csv-to-json');
  const json = csv2Json.getJsonFromCsv("./data/sample.csv");

  json.forEach(async entry => {
    //search to see if the entry is already there.
    const result = await strapi.query('person').findOne(entry);
    //console.log(result === null);
    
    if(result === null){
      strapi.services.person.create({
        name: entry.name,
        age: entry.age,
      });
    }/*else {
      strapi.services.person.update({id: result.id}, entry);
    }*/
  })
  console.log(json);
};
