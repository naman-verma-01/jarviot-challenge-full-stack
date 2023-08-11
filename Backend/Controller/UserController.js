const express = require("express");
const router = express.Router();
const { google } = require('googleapis')
const dotenv = require('dotenv');
const {redirectAuth, fetchFiles, deleteUser, getUserData, fetchAnalytic,deleteFile} = require('../Services/UserService')
dotenv.config()


const oauth2 = google.oauth2('v2');
const OAuth2 = google.auth.OAuth2;


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)


router.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.readonly.metadata']
    })

    res.redirect(url)
})


router.get('/google/redirect', async (req, res) => {
   

    try {
        const response = await redirectAuth(req.query.code)
        res.redirect(`http://localhost:3001/dashboard/redirect/${response.data.user.gId}`)

    } catch (error) {
        console.log(error)
    }

})


router.get('/fetchFiles', async (req, res) => {
   
    try {
        const response = await fetchFiles(req.query.gId)
        res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
    }

})


router.get('/fetchAnalytic', async (req, res) => {
   
    try {
        const response = await fetchAnalytic(req.query.gId)
        res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
    }

})

router.get('/deleteUser', async (req, res) => {
    try {
        const response = await deleteUser(req.query.gId)
        res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
    }
    
})

router.get('/getUserData', async (req, res) => {
    try {
        const response = await getUserData(req.query.gId)
        res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
    }
    
})

router.get('/deleteFile', async (req, res) => {
    try {
        const response = await deleteFile(req.query.gId, req.query.fileId)
        res.status(response.status).json(response.data)
    } catch (error) {
        console.log(error)
    }
    
})

module.exports = router;