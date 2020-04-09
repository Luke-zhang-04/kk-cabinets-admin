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

function getStatus() {
    return firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
        console.log(idTokenResult)
        // Confirm the user is an Admin.
        if (!!idTokenResult.claims.admin) {
            return "admin"
        } else if (!!idTokenResult.claims.editor) {
            return "editor"
        } else {
            document.getElementById("adminContent").style.display = "none"
            document.getElementById("adminContent").remove()
            document.getElementById("editorContent").style.display = "none"
            document.getElementById("editorContent").remove()
            alert("UNAUTHORIZED ACCESS")
            window.location.href = "index.html"
        }
    }).catch((error) => {
        let errorCode = error.code
        let errorMessage = error.message
        window.alert("ERROR! Code: " + errorCode + "\nInfo: " + errorMessage)
        console.log(error)
    })
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
            console.log(idTokenResult)
            // Confirm the user is an Admin.
            if (!!idTokenResult.claims.admin) {
                show_admin(user.email, "admin")
            } else if (!!idTokenResult.claims.editor) {
                show_admin(user.email, "editor")
            }else {
                document.getElementById("adminContent").style.display = "none"
                document.getElementById("adminContent").remove()
                document.getElementById("editorContent").style.display = "none"
                document.getElementById("editorContent").remove()
                alert("UNAUTHORIZED ACCESS")
                logout()
                window.location.href = "index.html"
            }
        }).catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message
            window.alert("ERROR! Code: " + errorCode + "\nInfo: " + errorMessage)
            console.log(error)
        })
    } else {
        document.getElementById("adminContent").style.display = "none"
        document.getElementById("adminContent").remove()
        document.getElementById("editorContent").style.display = "none"
        document.getElementById("editorContent").remove()
        alert("UNAUTHORIZED ACCESS")
        window.location.href = "index.html"
    }
})

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("Sucessfully Logged Out")
    })
}