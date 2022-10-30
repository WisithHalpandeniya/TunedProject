// GW-144-Tuned-Global
// POEditor translations, backend implementation

//Server which runs on pc
const express = require("express");
//Get webhook body content
const bodyParser = require("body-parser");
//For writing requests to api to update and get projects
const https = require("https");
//For optimization
const { time, timeEnd } = require("console");
const { fileURLToPath } = require('url');
//calling server to interact with sql express DB
const dbOperation   = require('./server/dbOperation');

//poeditor api, for testing 
const poconnect = require('node-poeditor');

const app = express();

//input your token and id 
const token = '13a47685705000121cfeb38aabe4b24d';
const id = 567931;

//adding terms through node-poeditor package test
// Use this for listing terms: curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="552897" -d language="en"

const terms = [
  {
      "term": "Another test",
      "context": "",
      "reference": "\/projects",
      "plural": "",
      "comment": ""
  },
  {
      "term": "kkkkkkk",
      "context": "",
      "reference": "\/projects",
      "plural": "%d projects found",
      "comment": "Make sure you translate the plural forms",
      "tags": [
          "first_tag",
          "second_tag"
      ]
  },
  {
      "term": "Show all projects",
      "context": "",
      "reference": "\/projects",
      "plural": "",
      "tags": "just_a_tag"
  }
];

(async () => {
try {
  const res = await poconnect.terms.add(token, id, terms);

  // // res => {
  //     "terms": {
  //         "parsed": 1,
  //         "added": 1
  //     };
} catch (err) {
  // err => returns an error when failed
}
})();


// //Environment Variables, plug these in lambda env
// const PORT = 3000;
// const API_TOKEN = "7bbf8deb3c0333fcd7666d51dd951463";
// const ROOT_ID = "532583";

//WISITH TEST, using my api token and proj id?
//Environment Variables , plug these in lambda env
const PORT = 3000;
//change this to your api token and project id
const API_TOKEN = "13a47685705000121cfeb38aabe4b24d";
const ROOT_ID = "567931";

//The below enable express to receive json in request
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Listens to Webhook from POEditor
app.post("/", async (req, res) => {
  res.status(200).send("OK");

  // the body of the data received, parses it to json
  try {
    // Might have to enable next line whenever taking actual requests from POEditor since their JSON formatting was wierd.
    // var payload = JSON.parse(req.body.payload)

    var payload = req.body.payload;
    console.log(payload);
  } catch (err) {
    console.log("Object not a payload or not JSON:\t" + err);
    return;
  }
  try {
    if (payload.event.name == "new_terms.added") {
      const projectPayload = await getProjectsToSync();
      const projects = await updateProjects(projectPayload.projects);
      //! This is as far as I have gotten. The updateProjects function should iterate over the projects and update them with the root's terms.
    }
  } catch (err) {
    console.error("JSON Format Wrong:\t" + err);
    return;
  }
});

app.listen(PORT, () => {
  console.log(
    `Listening for POEditor webhook event data on port ${PORT}. Started ${new Date().toString()}`
  );
});

async function getProjectsToSync() {
  var payload = "";
  const postData = "api_token= " + API_TOKEN;
  const options = {
    hostname: "api.poeditor.com",
    //might have to change below to a diff path?
    //(nvm it is correct!!)
    path: "/v2/projects/list",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };
  const promiseRequest = new Promise(function (resolve, reject) {
    const req = https.request(options, (res) => {
      // console.log("statusCode:", res.statusCode);
      // console.log("headers:", res.headers);

      res
        .on("data", (d) => {
          payload += d;
        })
        .on("end", () => {
          payload = JSON.parse(payload);
          //If payload is successful it returns resolves promise, if not, it rejects. If error, rejects.
          try {
            if (payload.response.status == "success") {
              resolve(payload.result);
            } else {
              reject();
            }
          } catch (err) {
            console.error("Failed Retrieving Projects:\t" + err);
            reject();
          }
        });
    });

    req.on("error", (e) => {
      console.error(e);
    });
    req.write(postData);
    req.end();
  });

  return promiseRequest;
}
async function updateProjects(projects) {
  projects.forEach((element) => {
    if (element.id != ROOT_ID) {
      console.log(element.id);
    }
  });
}


//Running bash file in node, this means only: node app.js is needed to run everything
//but can be annoying for testing, so Ive provided both ways to run scripts 
//and this can be commented out for testing
// Use git bash if on windows.

const { exec } = require('child_process');
const shscript = exec('sh curlrequest.sh',
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });

//export combined file
const combine = require('./combine');
//calling combine files
combine.readData2();

//calling the sql server
dbOperation.createTerms();
//console.log(dbOperation.createTerms())