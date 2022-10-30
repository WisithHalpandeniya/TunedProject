// COMBINE to combine a store and the all tags, eg. rhuk and all
//return a file that has no duplicates

const fs = require('fs');
const path = require('path');

const readData1 = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname,'./files/rhuk.json'), 'utf8', (err, data1) => {
      if(err) reject(err);
      let data = JSON.parse(data1);
      resolve(data);
    });
  });
};

const readData2 = (data1) => {
  return new Promise((resolve, reject) =>{
    fs.readFile(path.join(__dirname,'./files/all.json'), 'utf8', (err, data) => {
      if(err) reject(err);
      data = JSON.parse(data);
      resolve([data1,data]);
      //console.log(data);
      // write new data back to the file
  fs.writeFile('./files/combined.json', JSON.stringify(data, null, 4), err => {
    if (err) {
      console.log(`Error writing file: ${err}`)
    }
});
    })
    
  })
  
};

const merging = (data1, data2) => {
    // keeps track of already existing titles to avoid duplicates
    let existingIndexes = {};

    // check the the arguments to make sure the code does not break
    data1 = data1 instanceof Array ? data1 : [];
    data2 = data2 instanceof Array ? data2 : [];

    // return a concatenated and filtered copy result
    return data1.concat(data2).filter((rhuk) => {
        if (!existingIndexes.hasOwnProperty(rhuk.term)) {
            existingIndexes[rhuk.term] = true;
            return true;
        }
        return false;
    })
};
readData1()
  .then(readData2)
    .catch((err) => console.error(err));
  // .then((data) => console.log(merging(data[0],data[1])))
  //   .catch((err) => console.error(err));
    // .then((data) => fs.writeFile('./files/output2.json', JSON.stringify(merging(data[0],data[1]), null, 4), err => {
    //     if (err) {
    //       console.log(`Error writing file: ${err}`)
    //     }
    // }))
    // .catch((err) => console.error(err));

// NOTE: the combination and removal of duplicates needs to be tested further...

//for testing
module.exports = {
  readData2,
}