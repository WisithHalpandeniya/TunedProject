const express       = require('express'),
      Terms      = require('./terms'),
      dbOperation   = require('./dbOperation'),
      cors          = require('cors');


//testing individual upload of term, dont have context
//need to call the dboperation create term on this?
let Test2 = new Terms();



//
//gives arrray of objects
dbOperation.getTerms().then(res => {
    //console.log(res.recordset);
})


// app.listen(API_PORT, () => {
//   console.log(`Server is listening on port ${API_PORT}.`);
// });

//dbOperation.createTerms(Test);

dbOperation.createTerms2(Test2);
console.log(Test2)


//dbOperation.createTerms3();

