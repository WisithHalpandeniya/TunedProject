const config = require("./dbConfig"),
    sql = require('mssql');

const json_data = require('./latest_terms.json');
//const json_data = require('../files/combined.json');

//Establishing conenction with sql server
const createTerms = async () => {
    let pool = await sql.connect(config);
    pool.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

        //Daves Original changed a bit, whats the difference between `` and '' for querys? 
        //var sql = `INSERT INTO [dbo].[tuned] VALUES([term],[definition],[context],[term_plural],[reference],[comment])`;

        //TEST DB CONNECTION..
        const sql = `INSERT INTO tuned VALUES('term', 'definition', 'context', 'term_plural', 'reference', 'comment')`;

        //   // var sql = (`INSERT INTO tuned VALUES
        // // ('${term.term}', '${term.definition}', '${term.context}', '${term.term_plural}', '${term.reference}', '${term.comment}' )
        // // `);


        const data = JSON.stringify(json_data);
        //console.log(data);
        const parsedData = JSON.parse(data);
        //console.log(parsedData);

        ///---NOTE- this doesnt have square brackets around parsedData and when I consolelog query array it look more accurate
        const queryArr = parsedData.map((term) => [term.term, term.definition, term.context, term.term_plural, term.reference, term.comment]);

        
        //this is the only way I found to get specific terms or comments etc..
        //console.log(parsedData[0].term);
        //console.log(queryArr);
        pool.query(sql, queryArr, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);

        });

    });

}

//select from code for exporting sql later
// const getTerms async () => {
//     try {
//         // make sure that any items are correctly URL encoded in the connection string
//         await sql.connect('Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true')
//         const result = await sql.query`select * from mytable where id = ${value}`
//         console.dir(result)
//     } catch (err) {
//         // ... error checks
//     }
// }


module.exports = {
            createTerms,
        }