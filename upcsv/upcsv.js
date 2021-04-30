require('dotenv').config();
const fs = require("fs");
const mongoose = require("mongoose");

const mapKey = (key) => {
  if(key === "_id") return key;

  return key
    .replace(/[.^]/g, "_id")
    .replace(/[^\w]/g, '');
}

const csv2headYdata = (csv) => {
  const csvSplit = (
    csv
    .split(/\n|\r/g)
    .filter(e => e.length > 0)
    .map(line => line.split(/,/g))
  );
  return {
    "head": csvSplit[0],
    "data": csvSplit.slice(1)
  };
}

const head2parser = (keys, keyMapper=mapKey) => {
  return (data) => {
    const tupleObj = {};
    for(let i = 0; i < keys.length; i++){
      let keyCleaned = keyMapper(keys[i]);
      tupleObj[keyCleaned] = data[i];
    }
    return tupleObj;
  }
}

const csv2json = (csv) => {
  const {head, data} = csv2headYdata(csv);
  const parse = head2parser(head);
  const jsonified = data.map(datum => parse(datum));
  return jsonified;
}

const ship2db = (data) => {
  mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});

  const personSchema = new mongoose.Schema({
    /**
     * This _id must be 24 characters in length
     * so
     * _id = 1 must become _id = 000000000000000000000001
     * _id = 2 must become _id = 000000000000000000000002
     * ...and so on
     */
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    age: String,
    messykey: String,

    /**
     * published_at is needed to trick strapi into thinking the piece of data is published
     */
    published_at: {type: Date, default: Date.now}
  });
  const Person = mongoose.model('Person', personSchema);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
    data.forEach(datum => {
      const person = new Person(datum);
      person.save((err, entry) => {
        if(err) return console.error(err);
        console.log("SAVED:", entry);
      });

      //console.log(person);
      console.log(datum);
    });
  });
}

const main = (() => {
  const csvURL = process.argv[2];
  const csv = fs.readFileSync(csvURL, {encoding: "utf8"});
  const json = csv2json(csv);

  ship2db(json);
})();