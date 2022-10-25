//db specific commands
const config = require("./dbConfig"),
    sql = require('mssql');



//function to get employees from database, its an async function
const getTerms = async () => {
    //try catch
    try {
        let pool = await sql.connect(config);
        //this is where you can make querys...
        let terms = pool.request().query("SELECT * from tuned")
        //console.log(terms);
        return terms;
    }
    catch (error) {
        console.log(error);
    }
}



//------------- IMPORT TO SQL FROM JSON FILE ---------//
//read json data
const json_data = require('./latest_terms.json');
//const json_data = require('./terms.json');
//const json_data = require('./files/output.json');


const createTerms2 = async (Terms) => {
    //try catch
    // try{
    //console.log(json_data)
    let pool = await sql.connect(config);
    //var sql1 = "INSERT INTO EmployeeDemographics (EmployeeID, Firstname, Lastname, Age, Gender) VALUES ?";

    const data = json_data;
    var test1 = JSON.parse(data);
    var test = test1[0];
    console.log(JSON.stringify(test))
    //console.log(test1)
    //console.dir(test1)

    //const queryArr = data.map((Terms) => [Terms.term, Terms.definition, Terms.context, Terms.term_plural, Terms.reference, Terms.comment]);
    const sql1 = (`INSERT INTO tuned VALUES
        ('${Terms.term}', '${Terms.definition}', '${Terms.context}', '${Terms.term_plural}', '${Terms.reference}', '${Terms.comment}' )
        `)
    console.log('sql1' + sql1)
    console.log('querrArr' + queryArr)
    //this is where you can make querys...
    let terms = pool.request().query(sql1, queryArr, function (err, result) {

        console.log(terms);
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });

    return terms;

    // catch(error) {
    //     console.log(error);
    // }
}



module.exports = {
    createTerms2,
    //createTerms3,
    getTerms
}