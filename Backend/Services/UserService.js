const { google } = require('googleapis')
const dotenv = require('dotenv');
const fs = require('fs');
const User = require("../Model/User");
dotenv.config()

const oauth2 = google.oauth2('v2');
const OAuth2 = google.auth.OAuth2;


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)



const redirectAuth = async (code) => {
    let response = {}
    try {
        const authClient = new OAuth2();

        const { tokens } = await oauth2Client.getToken(code)

        authClient.setCredentials({
            access_token: tokens.access_token,
        });

        let userData = await oauth2.userinfo.get({
            auth: authClient
        })



        var user = new User({ gId: userData.data.id, name: userData.data.name, profilePicture: userData.data.picture, tokens: JSON.stringify(tokens) })
        user = await user.save()


        if (user) {
            response.status = 200,
                response.data = { msg: "Successfull", user }
            return response
        }
        else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "failed" }
            return response

        }
    } catch (error) {
        console.log(error)
        response.status = 500,
            response.data = { msg: error }
        return response

    }
}


const fetchFiles = async (gId) => {
    let response = {}
    try {

        let user = await User.find({ gId })
        console.log("USERDATA ==> ", user);
        oauth2Client.setCredentials(await JSON.parse(user[user.length - 1].tokens))

        const drive = google.drive({ version: 'v3', auth: oauth2Client })

        const driveData = await drive.files.list({
            pageSize: 50, // Number of files per page (adjust as needed)
            fields: 'nextPageToken, files(id, name, mimeType,size, webViewLink)', // Specify the fields we want
        });

        console.log("FILES ==>", driveData.data.files)

        if (driveData) {
            response.status = 200,
                response.data = { msg: "Successfull", data: driveData.data.files }
            return response
        }
        else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "failed" }
            return response

        }
    } catch (error) {
        console.log(error)
        response.status = 500,
            response.data = { msg: error }
        return response

    }
}


const fetchAnalytic = async (gId) => {
    let response = {}
    try {

        let user = await User.find({ gId })

        oauth2Client.setCredentials(await JSON.parse(user[user.length - 1].tokens))

        const drive = google.drive({ version: 'v3', auth: oauth2Client })

        const driveData = await drive.files.list({
            pageSize: 50, // Number of files per page (adjust as needed)
            fields: 'nextPageToken, files(id, name, mimeType,size, webViewLink)', // Specify the fields we want
        });



        let files = driveData.data.files

        let externalFilesCount = 0
        for (const file of files) {
            try {
                const permissionsResponse = await drive.permissions.list({
                    fileId: file.id,
                    fields: 'permissions(emailAddress, role, type, domain, allowFileDiscovery)', // Include only necessary fields
                });
                file.permissions = permissionsResponse.data.permissions;
            } catch (error) {
                console.log("Access Denied !!")
                externalFilesCount++
            }

        }

        const publicAccessFiles = files.filter(file => {
            try {
                return file.permissions.some(permission => permission.role === 'reader' && !permission.emailAddress)
            } catch (error) {
                return false
            }
        }

        );

        const uniqueEmails = new Set();
        files.forEach(file => {
            try {
                file.permissions.forEach(permission => {
                    if (permission.emailAddress) {
                        uniqueEmails.add(permission.emailAddress);
                    }
                });
            } catch (error) {

            }
        });


        if (driveData) {
            response.status = 200,
                response.data = { msg: "Successfull", data: { uniqueEmails:[...uniqueEmails], publicAccessFiles, externalFilesCount } }
            return response
        }
        else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "failed" }
            return response

        }
    } catch (error) {
        console.log(error)
        response.status = 500,
            response.data = { msg: error }
        return response

    }
}



const deleteUser = async (gId) => {
    let response = {}
    try {

        let user = await User.deleteOne({ gId })

        if (user) {
            response.status = 200,
                response.data = { msg: "Successfull", data: user }
            return response
        }
        else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "failed" }
            return response

        }
    } catch (error) {
        console.log(error)
        response.status = 500,
            response.data = { msg: error }
        return response

    }
}

const getUserData = async (gId) => {
    let response = {}
    try {

        let user = await User.find({ gId })

        if (user) {
            response.status = 200,
                response.data = { msg: "Successfull", data: { gId: user[0].gId, name: user[0].name, profilePicture: user[0].profilePicture } }
            return response
        }
        else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "failed" }
            return response

        }
    } catch (error) {
        console.log(error)
        response.status = 500,
            response.data = { msg: error }
        return response

    }
}


const deleteFile = async (gId, fileId) => {
    let response = {}
    try {

        let user = await User.find({ gId })

        oauth2Client.setCredentials(await JSON.parse(user[user.length - 1].tokens))

        const drive = google.drive({ version: 'v3', auth: oauth2Client })

        let res = await drive.files.delete({ 'fileId': fileId })

        if (user) {
            response.status = 200,
                response.data = { msg: "Successfull" }
            return response
        }
        else {
            console.log("Error 400")
            response.status = 400,
                response.data = { msg: "failed" }
            return response

        }
    } catch (error) {
        console.log(error)
        response.status = 500,
            response.data = { msg: error }
        return response

    }
}



module.exports = { redirectAuth, fetchFiles, deleteUser, getUserData, fetchAnalytic, deleteFile }
