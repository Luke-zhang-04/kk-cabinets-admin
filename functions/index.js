/*
	KK Cabinets
    Copyright (C) 2020 Luke Zhang, Ethan Lim
    
    https://github.com/Luke-zhang-04
    https://github.com/ethanlim04

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
    databaseURL: "https://kk-cabinets.firebaseio.com/"
})
let database = admin.database()


exports.addAdminRole = functions.https.onCall((data, context) => {
    //check for admin creds
    if (!context.auth.token.admin) {
        return {message: `ERROR! Only admins can add other admins\nThought you could get around security, ${data.email}?`}
    }

    //get user and add custom claim (admin)
    return admin.auth().getUserByEmail(data.email).then(user => {
        database.ref("admins/" + user.uid).set({"email": user.email})
        database.ref("editors/" + user.uid).remove()
        return admin.auth().setCustomUserClaims(user.uid, {admin: true, editor: false})
    }).then(() => {
        return {
            message: `Success! ${data.email} has been made an admin`
        }
    }).catch(err => {
        return err
    })
})

exports.addEditorRole = functions.https.onCall((data, context) => {
    //check for damin creds
    if (!context.auth.token.admin) {
        return {message: `ERROR! Only admins can add other editors\nThought you could get around security, ${data.email}?`}
    }

    //get user and add custon claim (editor)
    return admin.auth().getUserByEmail(data.email).then(user => {
        database.ref("editors/" + user.uid).set({"email": user.email})
        database.ref("admins/" + user.uid).remove()
        return admin.auth().setCustomUserClaims(user.uid, {admin: false, editor: true})
    }).then(() => {
        return {
            message: `Success! ${data.email} has been made an editor`
        }
    }).catch(err => {
        return err
    })
})

exports.removeRole = functions.https.onCall((data, context) => {
    //check for damin creds
    if (!context.auth.token.admin) {
        return {message: `ERROR! Only admins can remove other admins or editors\nThought you could get around security, ${data.email}?`}
    }

    //get user and add custon claim (editor)
    return admin.auth().getUserByEmail(data.email).then(user => {
        database.ref("editors/" + user.uid).remove()
        database.ref("admins/" + user.uid).remove()
        return admin.auth().setCustomUserClaims(user.uid, {admin: false, editor: false})
    }).then(() => {
        return {
            message: `Success! ${data.email} is no longer an editor/admin`
        }
    }).catch(err => {
        return err
    })
})