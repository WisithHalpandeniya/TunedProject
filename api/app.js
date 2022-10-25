//###WHAT I TRIED AND QUESTIONS for mid sprint1 meeting...
// - The APIS were all working fine and acessing the project environment with the given script all went smoothly
// - when it came to syncing is when I faced a lot of problems, I know how to create a project, edit it, upload terms etc.., but
// linking one project to the other was difficuiult and I am yet to figure  it out.
// - since im not too familiar with nodejs and the poeditor api, I tried to brute force it by first listing out all terms in the masterfile and
// then outputting that to another file( Ive  tried po, json, txt.. none of them work as I get the same unsupported format error), again this brute force
//method might work but there has to be a simpler way to do it.

// Are we allowed to use external node packages? I found this one online called: poconnect = require('node-poeditor'), thats helped me 
//figure out how to update terms inside the code and without the curl scripts but Im not too sure how useful that will be...
// What can I change the data field to in the curl script? Can it only take json string?
// #How to specify only rmit2 is there a way configure the "updating" argument to state terms and location?
// #The only way I could think of cleanly going about this now, is to not use curl commands but to tweak
//the js code so that we can run sync terms but the data argument takes in a json list of all terms in master, im
// not too familiar with js so thats definitley something I want to work on over this sprint.

//POSSIBLE solution
//using export api, returning the link of the file,using that to upload?Ive tried curl, but I  think
//Ive got  it setup wrong and cant access the https file...

// rmit team 1 implementation
// -A script was made that listens to POEditor webhooks (on new terms)
// -If new terms event, requests all projects from POEditor API
// -If projects are returned, iterates over projects and logs out their ids
// 	-While skipping master project (doesnt work I dont think!)
// Yet to be Implemented-
// - Iterate over projects and push all of masters terms to them
// 	-Using update endpoint, not sync, since sync would delete all other terms not present on master
// - Testing on fallback language
// -Testing with many terms to sync
// -... more 

// ##tuned global project 1 starting up on node.js
// -npm install
// -npm install -g nodemon
// -node app.js

///-----------CURL IMPORTS
// const querystring = require("querystring");
// const { Curl } = require("node-libcurl");
// const terminate = curlTest.close.bind(curlTest);
///-----------end-CURL IMPORTS

//------------------------TESTING---------------------------------------------/
//const poconnect = require('node-poeditor');
//const token = 'cb6ca4e477f1cfe78555d8890a3732ab';
//const id = 552897;

const poconnect = require('node-poeditor');

//testing Wen and Yoonees tokens
//my token
//const token = 'cb6ca4e477f1cfe78555d8890a3732ab';
//wen
//const token = '0772d8ac039eab4b93e8fb9bfa7e316d';
//yoonees token
const token = '13a47685705000121cfeb38aabe4b24d';
//yoonees project
const id = 567931;

//ADDING TERMS ---WORKS!
// Use this for listing terms: curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="552897" -d language="en"
//try linking the below code to the json text file and push to test2 project?
//upload: curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="552897" -F updating="terms_translations" -F file=@"C:\Users\Wisith Halpandeniya\Desktop\Tuned Global/resw.resw" -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"

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

// //UPLOADING WITH JSON --- was just guessing this, DOESNT WORK!!!
// // curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="551463" -F updating="terms_translations" -F file=@"C:\Users\Wisith Halpandeniya\Desktop\Tuned Global/resw.resw" -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"
// const options = {
//   method: 'POST',
//   uri: 'https://api.poeditor.com/v2/projects/upload', // whatever the endpoint
//   body: {
//       api_token: "cb6ca4e477f1cfe78555d8890a3732ab",
//       id: "552979",
//       updating: "terms_translations",
//       file: "C:\Users\Wisith Halpandeniya\Desktop\Tuned Global/resw.resw",
//       language: "en",
//       overwrite: "1",
//       sync_terms: "1",
//       tags: "{\"all\":\"removed-strings\"}"
//   },
//   json: true // Automatically stringifies the body to JSON
// };

// (async () => {
//   try {
//     const res = await poconnect.terms.add(token, id, terms);

//     // // res => {
//     //     "terms": {
//     //         "parsed": 1,
//     //         "added": 1
//     //     };
//   } catch (err) {
//     // err => returns an error when failed
//   }
// })();



//------------------------TESTING---------------------------------------------/

//Server which runs on pc
const express = require("express");
//Get webhook body content
const bodyParser = require("body-parser");
//For writing requests to api to update and get projects
const https = require("https");
//For optimization
const { time, timeEnd } = require("console");
const { fileURLToPath } = require('url')

const app = express();

// //Environment Variables, plug these in lambda env
// const PORT = 3000;
// const API_TOKEN = "7bbf8deb3c0333fcd7666d51dd951463";
// const ROOT_ID = "532583";

//WISITH TEST, using my api token and proj id?
//Environment Variables , plug these in lambda env
const PORT = 3000;
//my api token, which I maxed out
//const API_TOKEN = "cb6ca4e477f1cfe78555d8890a3732ab";
//testing Wen and Yoonees tokens
const API_TOKEN = "13a47685705000121cfeb38aabe4b24d";
//maybe this should be master id??
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


// //CURTL WITH CHILD PROCESS TEST
// const util = require('util');
// const exec = require('child_process').exec;

// const command = 'curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 567931, "name": "Yoonee_project", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }''

// child = exec(command, function(error, stdout, stderr){

// console.log('stdout: ' + stdout);
// console.log('stderr: ' + stderr);

// if(error !== null)
// {
//     console.log('exec error: ' + error);
// }

// });


//-------------------------TEST CURL REQUEST-------------------------------
// curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 532583, "name": "Project Root", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }'

// !! Wisiths adjusted curl request, changed id and name, what is date?
// curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 552897, "name": "Wisith_API_test", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }'

//TEST2! testing og curl call from wisith_api_test to new test2 project to, see if terms transfer(sync?)
// curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 552979, "name": "test2", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }'

//my API key: cb6ca4e477f1cfe78555d8890a3732ab
//Other POEditor api commands

//RMIT 2 551463
//curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 551463, "name": "RMIT2", "public": 0, "open": 0 } } }'


//-------------------------Project calls-----------------------------------
//View Project Details
// curl -X POST https://api.poeditor.com/v2/projects/view      -d api_token="cb6ca4e477f1cfe78555d8890a3732ab"      -d id="552897"

//Add Project
// curl -X POST https://api.poeditor.com/v2/projects/add     -d api_token="cb6ca4e477f1cfe78555d8890a3732ab"     -d name="Wisith_API_test"

//Update Project Settings
// curl -X POST https://api.poeditor.com/v2/projects/update  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab"  -d id="552897" -d name="Wisith_API_test" -d description="testing updating project settings using the API" -d reference_language="en" -d fallback_language="fr"

//Upload terms/translations 
// No more than one request every 30 seconds.
// curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="552897" -F updating="terms"  -F file="C:\Users\Wisith Halpandeniya\Desktop\Tuned misc\csv/test2.xlsx" -F tags="{\"new\":\"removed-strings\"}"
// .xlsx

//-------------------------------TERMS-------------------------------------

//List Project Terms
//for master, works shows terms
//curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="548715" -d language="en"
//For Wisiths api
//curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="552897" -d language="en"
//For TEST2 , id(552979)
// curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="552979" -d language="en"


//Add Terms (works, when testing with above list terms it shows added terms)
//curl -X POST https://api.poeditor.com/v2/terms/add -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="552897" -d data="[{\"term\":\"just a test\"}]"


//NPMJS API CALL TEST
// poeditor -t <cb6ca4e477f1cfe78555d8890a3732ab> -c terms -m list -id <552897>

//-------------------------------------CURL master terms to textfile-------------------------
// curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="548715" -d language="en" > ~/Desktop/output.txt && more ~/Desktop/output.txt
// master to json
//curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="548715" -d language="en" > ~/Desktop/output.json && more ~/Desktop/output.json
// master to po
//curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="548715" -d language="en" > ~/Desktop/output.po && more ~/Desktop/output.po

//EXPORT TERMS
// curl -X POST https://api.poeditor.com/v2/projects/export -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="552897" -d language="en" -d type="po"



//--------------------------------------UPLOADING TERMS!-------------------------------
//curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="552897" -F updating="terms" -F file="C:\Users\Wisith Halpandeniya\Deskto/output.po" -F tags="{\"all\":\"removed-strings\"}"

// xls wisith test (this works!!!)
//wisith api
//curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="552897" -F updating="terms" -F file=@"C:\Users\Wisith Halpandeniya\Downloads/resw.resw" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"

//RMIT2 WORKS!@!!!!
// curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="551463" -F updating="terms_translations" -F file=@"C:\Users\Wisith Halpandeniya\Desktop\Tuned Global/resw.resw" -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"


//test2
// curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="552979" -F updating="terms"  -F file="C:\Users\Wisith Halpandeniya\Desktop\Tuned misc\csv/output.po" -F tags="{\"new\":\"removed-strings\"}"

// //SYNCING terms
// curl -X POST https://api.poeditor.com/v2/projects/sync \
//      -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" \
//      -d id="552979" \
//      -d data="[{\"term\":\"Add new list\"}, {\"term\":\"Add new item\"}]"



// //---------------EXPORT AND UPLOAD TEST------------------------
// // //export from master to url in rese
// curl -X POST https://api.poeditor.com/v2/projects/export \
//      -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" \
//      -d id="548715" \
//      -d language="en" \
//      -d type="resw"

// //Upload from url to test2
// curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="552979" -F updating="terms_translations" -F file="https:\/\/api.poeditor.com\/v2\/download\/file\/4be8a0c9d1451529c8ac28c1c238dc97" -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"

// https:\/\/api.poeditor.com\/v2\/download\/file\/ff65f34b0477aa515c48238f6ce465b2

// //further curl http downlaod testing
// curl https:\/\/api.poeditor.com\/v2\/download\/file\/ff65f34b0477aa515c48238f6ce465b2

// //naming output for curl file
// curl -o filename.resw https:\/\/api.poeditor.com\/v2\/download\/file\/8ae6376e17cc718c41bb0f1dffe04a7d -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="548715"

// curl -o test.resw curl https:\/\/api.poeditor.com\/v2\/download\/file\/ff65f34b0477aa515c48238f6ce465b2



//!!!IMPORTANT!!
//Below Export will upload to the https address, grab that ausing the curl -o filename
//command below, that will be saved to mingw local or whatevr...

//---JSON EXPORT
// //---------------EXPORT AND UPLOAD TEST------------------------
// // //export from master to url in json
// curl -X POST https://api.poeditor.com/v2/projects/export \
//      -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" \
//      -d id="548715" \
//      -d language="en" \
//      -d type="json" \
//      -d tags="android"

//----SAVING TO MINGW DRIVE
//naming output for curl file JSON
// curl -o filename.json https:\/\/api.poeditor.com\/v2\/download\/file\/a8df9da9e1c4dbe031095a425e68a6e0 -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="548715"

//--Uploading to test2 from local
//test2
// curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="cb6ca4e477f1cfe78555d8890a3732ab" -F id="552979" -F updating="terms"  -F file=@"C:\Users\Wisith Halpandeniya\filename.json" -F tags="{\"new\":\"removed-strings\"}"

//list terms from master, can be implemneted in code instead of a script..
//curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="cb6ca4e477f1cfe78555d8890a3732ab" -d id="548715" -d language="en" -o terms.json





//--------------------TESTING WITH WENS API TOKEN---------------------------
//0772d8ac039eab4b93e8fb9bfa7e316d

// !! Wisiths adjusted curl request, changed id and name, what is date?
// curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 552897, "name": "Wisith_API_test", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }'

//---JSON EXPORT
// //---------------EXPORT AND UPLOAD TEST------------------------
// //export from master to url in json
// curl -X POST https://api.poeditor.com/v2/projects/export \
//      -d api_token="0772d8ac039eab4b93e8fb9bfa7e316d" \
//      -d id="548715" \
//      -d language="en" \
//      -d type="json" \
//      -d tags="android"

//----SAVING TO MINGW DRIVE
//naming output for curl file JSON
// curl -o latest_terms.json https:\/\/api.poeditor.com\/v2\/download\/file\/fd5a1891ceabe41763ea44f820ca115f -F api_token="0772d8ac039eab4b93e8fb9bfa7e316d" -F id="548715"

//--Uploading to test2 from local
//test2
// curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="0772d8ac039eab4b93e8fb9bfa7e316d" -F id="552979" -F updating="terms"  -F file=@"C:\Program Files\Git\tuned\latest.json" -F tags="{\"new\":\"removed-strings\"}"

//list terms from master, can be implemneted in code instead of a script..
//curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="0772d8ac039eab4b93e8fb9bfa7e316d" -d id="548715" -d language="en" -o terms.json
