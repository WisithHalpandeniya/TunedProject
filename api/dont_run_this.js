//--------------------TESTING WITH others API TOKEN---------------------------

//const { format } = require("mysql")

//wen
0772d8ac039eab4b93e8fb9bfa7e316d
//yoonee
13a47685705000121cfeb38aabe4b24d
//yoonee project id
567931

//!! Wisiths adjusted curl request, changed id and name, what is date?
curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 552897, "name": "Wisith_API_test", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }'
//yoonee request
curl -X POST http://localhost:3000 -H 'Content-Type: application/json' -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": 567931, "name": "Yoonee_project", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }'

//---JSON EXPORT
//---------------EXPORT AND UPLOAD TEST------------------------
//export from master to url in json
curl -X POST https://api.poeditor.com/v2/projects/export \
     -d api_token="13a47685705000121cfeb38aabe4b24d" \
     -d id="548715" \
     -d language="en" \
     -d type="json" 

// // //export from master to url in key value json
curl -X POST https://api.poeditor.com/v2/projects/export \
     -d api_token="13a47685705000121cfeb38aabe4b24d" \
     -d id="548715" \
     -d language="en" \
     -d type="key_value_json"

///----SAVING TO MINGW DRIVE
//naming output for curl file JSON
curl -o terms.json https:\/\/api.poeditor.com\/v2\/download\/file\/56ceed7be4740120729ab0f5b459718e -F api_token="13a47685705000121cfeb38aabe4b24d" -F id="548715"

//--Uploading to yoonees project from local

//------USE THIS ! --upload test with different flags
//removed string
curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="13a47685705000121cfeb38aabe4b24d" -F id="567931" -F updating="terms_translations" -F file=@"C:\Program Files\Git\tuned\terms_updated.json" -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"
//ios test,
//NOTE: what we need to do is export the different files with tags and then we could upload them into poeditor one by one specify the tag
//in the upload query...
curl -X POST https://api.poeditor.com/v2/projects/upload -F api_token="13a47685705000121cfeb38aabe4b24d" -F id="567931" -F updating="terms_translations" -F file=@"C:\Program Files\Git\tuned\terms_updated.json" -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"ios\"}"

//testing directly from the web link, DOESNT WORK
curl -X POST https://api.poeditor.com/v2/projects/upload -H "Accept: application/json" -F api_token="13a47685705000121cfeb38aabe4b24d" -F id="567931" -F updating="terms_translations" -F file=https:\/\/api.poeditor.com\/v2\/download\/file\/0163581c373b5691c58bafc1f416ba40 -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}" -H "Accept: application/javascript"



//list terms from master, can be implemneted in code instead of a script..
curl -X POST https://api.poeditor.com/v2/terms/list  -d api_token="13a47685705000121cfeb38aabe4b24d" -d id="548715" -d language="en" -o terms.json



//NOTES-------------------------

// export seems to give all terms but still in array format, would it be easier to 
// differntiate ebtween tags and then combine them in the code?

// the upload for yoonees project works but the actual strings look a little Off