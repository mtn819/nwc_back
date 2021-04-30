# UPCSV Branch

This branch is sort of an experiment to see how I can get Strapi to play nice with Mongoose. The main code for this is found in the folder upcsv/

to run, type

    npm run upcsv <input csv data url>

example:

    npm run upcsv upcsv/data.csv

The test csv I used for this looks as follows:

    _id,name,age,messy*@(*%)key
    000000000000000000000001,billy,5,asds
    000000000000000000000002,jim,13,ppep

The program uses mongoose to clean the data, into something like this:

    [{
      _id: 000000000000000000000001,
      name: billy,
      age: 5,
      messykey: asds,
    }, ...]

It then injects a "published_at" property into every object to trick Strapi into serving the data.