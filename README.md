## Risk Analysis Dashboard [(Vercel)](https://risk-analyzer-back-xt9b.vercel.app/)

**_NOTE:_**  In order to login please share the email id with the developer to white list the user from Google Cloud Console. (Google does not grant non white listed users to use OAuth on Un-Verified Apps which can possibly take weeks).

**_NOTE:_**  This repo does not have any client_id, api key, etc in the .env file of backend due to personal safety reasons. Follow the below steps to set up your own Google Cloud Console project (OR THE EASIER AND QUICKER OPTION WILL BE TO USE THE ABOVE DEPLOYED LINK AND SHARE THE EMAIL ADDRESS THAT WILL BE USED, TO GET THE EMAIL ID WHITE LISTED FOR TESTING PURPOSES). 

1. Create a new project on google cloud console.
2. Navigate to API and Services > OAuth Consent Screen > External > Save and Continue > Fill Basic REQUIRED details > Save and Continue.
3. Navigate to API and Services > Credentials > Create Credentials > Fill basic Required details.
4. Under Authorised JavaScript origins -> https://risk-analyzer-back.vercel.app
5. Under Authorised redirect URIs -> https://risk-analyzer-back.vercel.app/google/redirect
6. After completion you will get Client Id and Client Secret and Use that Client Secret, client Id and above redirect URI and save it in the .env file of the Backend.

[(DEMO)](https://drive.google.com/file/d/15hhwBgDT3XezeUmniClWOazjSfXx2Myj/view?usp=sharing)

## Installation

To install dependencies for this project run

Frontend/Client
```bash
  npm install --legacy-peer-deps
```

Backend/Server
```bash
  npm install 
```

## Start

To start this project on localhost run

Frontend/Client
```bash
  npm start
```

Backend/Server
```bash
  node index.js
```
