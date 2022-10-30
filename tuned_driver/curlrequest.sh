##To make executable run: chmod +x curlrequest.sh
##To execute: ./curlrequest.sh
##option to run through javascript code is provided

##API variables, change these for your account
## Changes can be viewed in gitbash To view changes in POEditor UI you must request access through Tuned.
API_TOKEN="13a47685705000121cfeb38aabe4b24d"
CHILD_ID="567931"
MASTER_ID="548715"
CHILD_NAME="Yoonee_project"
echo $API_TOKEN
echo $CHILD_ID
echo $MASTER_ID
echo $CHILD_NAME

##Establish connection
curl -X POST http://localhost:3000 -H 'Content-Type: application/json' \
     -d '{ "payload": {"event": { "name": "new_terms.added" }, "project": { "id": "$CHILD_ID", "name": "$CHILD_NAME", "public": 0, "open": 0, "created": "2022-05-13T00:24:37+0000" } } }'

##POEDITOR export API from master, getting output stored in output variable, 
##Exporting all terms, POEDITOR API limitation, cannot export all terms and show their tags.
##ALL TERMS WITHOUT TAGS
# output=$(curl -X POST -s https://api.poeditor.com/v2/projects/export \
#      -d api_token="$API_TOKEN" \
#      -d id="$MASTER_ID" \
#      -d language="en" \
#      -d type="json" 2>/dev/null)

##The only apparent approach to go about this is to either manually export from the ui, when you do this the term file contains tags, 
##or to export using the API into seperate files depending on the tag
##ie. rhuk.json would contain tags: rhuk, all and then we combine these files using javascript if necessary...
##Note: If you look at POEDITOR API docs for exporting, it says you can combine terms but I think its an AND instead of an OR
##so by default you cant have rhuk OR all, you can have an all and a rhuk and combine them as with the other...
##Use the method below to get the necessarry combinations of terms and tags

###------------STORES---------------###
##RHUK
output=$(curl -X POST -s https://api.poeditor.com/v2/projects/export \
     -d api_token="$API_TOKEN" \
     -d id="$MASTER_ID" \
     -d language="en" \
     -d type="json" \
     -d tags="rhuk" \
     2>/dev/null)
##Storing only the api address in new variable using jq and removing the ""
api_address=$(echo $output | jq .result.url | tr -d '"')
##Test
echo "address: ${api_address}"
##Saving to local 
curl -o files/rhuk.json ${api_address} \
     -F api_token="$API_TOKEN" -F id="$MASTER_ID"

##TMGH
output=$(curl -X POST -s https://api.poeditor.com/v2/projects/export \
     -d api_token="$API_TOKEN" \
     -d id="$MASTER_ID" \
     -d language="en" \
     -d type="json" \
     -d tags="tmgh" \
     2>/dev/null)
##Storing only the api address in new variable using jq and removing the ""
api_address=$(echo $output | jq .result.url | tr -d '"')
##Test
echo "address: ${api_address}"
##Saving to local 
curl -o files/tmgh.json ${api_address} \
     -F api_token="$API_TOKEN" -F id="$MASTER_ID"

##SOHE
output=$(curl -X POST -s https://api.poeditor.com/v2/projects/export \
     -d api_token="$API_TOKEN" \
     -d id="$MASTER_ID" \
     -d language="en" \
     -d type="json" \
     -d tags="sohe" \
     2>/dev/null)
##Storing only the api address in new variable using jq and removing the ""
api_address=$(echo $output | jq .result.url | tr -d '"')
##Test
echo "address: ${api_address}"
##Saving to local 
curl -o files/sohe.json ${api_address} \
     -F api_token="$API_TOKEN" -F id="$MASTER_ID"

##ALL becomes an issue as we will have duplicates when combining all files at the end...
##ALL 
output=$(curl -X POST -s https://api.poeditor.com/v2/projects/export \
     -d api_token="$API_TOKEN" \
     -d id="$MASTER_ID" \
     -d language="en" \
     -d type="json" \
     -d tags="all" \
     2>/dev/null)
##Storing only the api address in new variable using jq and removing the ""
api_address=$(echo $output | jq .result.url | tr -d '"')
##Test
echo "address: ${api_address}"
##Saving to local 
curl -o files/all.json ${api_address} \
     -F api_token="$API_TOKEN" -F id="$MASTER_ID"

###------------PLATFORM---------------###
##IOS
output=$(curl -X POST -s https://api.poeditor.com/v2/projects/export \
     -d api_token="$API_TOKEN" \
     -d id="$MASTER_ID" \
     -d language="en" \
     -d type="json" \
     -d tags="ios" \
     2>/dev/null)
##Storing only the api address in new variable using jq and removing the ""
api_address=$(echo $output | jq .result.url | tr -d '"')
##Test
echo "address: ${api_address}"
##Saving to local 
curl -o files/ios.json ${api_address} \
     -F api_token="$API_TOKEN" -F id="$MASTER_ID"

##ANDROID
output=$(curl -X POST -s https://api.poeditor.com/v2/projects/export \
     -d api_token="$API_TOKEN" \
     -d id="$MASTER_ID" \
     -d language="en" \
     -d type="json" \
     -d tags="android" \
     2>/dev/null)
##Storing only the api address in new variable using jq and removing the ""
api_address=$(echo $output | jq .result.url | tr -d '"')
##Test
echo "address: ${api_address}"
##Saving to local 
curl -o files/android.json ${api_address} \
     -F api_token="$API_TOKEN" -F id="$MASTER_ID"

#POEDITOR Upload API to child, default test file that contains everything from master with no filtering
curl -X POST https://api.poeditor.com/v2/projects/upload \
     -F api_token="$API_TOKEN" \
     -F id="$CHILD_ID" -F updating="terms_translations" \
     -F file=@"C:\Program Files\Git\tuned\tuned_driver\new_terms.json" \
     -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"


##POEDITOR Upload API to child, filtered and combined file
# curl -X POST https://api.poeditor.com/v2/projects/upload \
#      -F api_token="$API_TOKEN" \
#      -F id="$CHILD_ID" -F updating="terms_translations" \
#      -F file=@"C:\Program Files\Git\tuned\tuned_driver\files\combined.json" \
#      -F language="en" -F overwrite="1" -F sync_terms="1"  -F tags="{\"all\":\"removed-strings\"}"