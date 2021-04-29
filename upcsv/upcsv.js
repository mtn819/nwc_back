const fs = require("fs");

const mapKey = (key) => {
  return key
    .replace(/[]/g, "_id")
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

const main = (() => {
  const csvURL = process.argv[2];
  const csv = fs.readFileSync(csvURL, {encoding: "utf8"});

  //console.log(process.env.DATABASE_NAME);

  console.log(csv2json(csv))
})();