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

document.getElementById("makeAdminButton").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("confirm").style.display = "block"
    document.getElementById("makeAdminButton").style.display = "none"
    document.getElementById("makeEditorButton").style.display = "none"
})

document.getElementById("makeEditorButton").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("confirmEditor").style.display = "block"
    document.getElementById("makeAdminButton").style.display = "none"
    document.getElementById("makeEditorButton").style.display = "none"
})

document.getElementById("cancelButton").addEventListener("click", () => {
    document.getElementById("confirm").style.display = "none"
    document.getElementById("makeAdminButton").style.display = "inline-block"
    document.getElementById("makeEditorButton").style.display = "inline-block"
})

document.getElementById("confirmButton").addEventListener("click", () => {
    const adminEmail = document.querySelector("#new-admin-email").value
    const addAdminRole = functions.httpsCallable("addAdminRole")

    addAdminRole({email: adminEmail}).then(result => {
        alert(result.data.message)
        refreshAdminList()
    }).catch(error => {
        if (error.data === undefined) {
            alert("ERROR! Only admins can add other admins.")
        } else {
            alert(error.data)
        }
    })
    document.getElementById("confirm").style.display = "none"
    document.getElementById("makeAdminButton").style.display = "inline-block"
    document.getElementById("makeEditorButton").style.display = "inline-block"
})

document.getElementById("cancelEditorButton").addEventListener("click", () => {
    document.getElementById("confirmEditor").style.display = "none"
    document.getElementById("makeAdminButton").style.display = "inline-block"
    document.getElementById("makeEditorButton").style.display = "inline-block"
})

document.getElementById("confirmEditorButton").addEventListener("click", () => {
    const editorEmail = document.querySelector("#new-admin-email").value
    const addEditorRole = functions.httpsCallable("addEditorRole")

    addEditorRole({email: editorEmail}).then(result => {
        alert(result.data.message)
        refreshAdminList()
    }).catch(error => {
        if (error.data === undefined) {
            alert("ERROR! Only admins can add other editors.")
        } else {
            alert(error.data)
        }
    })
    document.getElementById("confirmEditor").style.display = "none"
    document.getElementById("makeAdminButton").style.display = "inline-block"
    document.getElementById("makeEditorButton").style.display = "inline-block"
})

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("Sucessfully Logged Out")
    })
}

function refreshAdminList() {
    let adminList = document.getElementById("adminList")
    adminList.innerHTML = "<p>Email</p><p>&emsp;&boxur; user id</p><p>&emsp;&boxur; role</p>"
    listAdmins()
}

function listAdmins() {
    let adminRef = new Map()
    database.ref("admins/").once("value").then(snapshot => {
        if (snapshot.exists()) {
            for ([i, j] of Object.entries(snapshot.val())) {
                adminRef[i] = j.email
            }
        }
    }).then(() => {
        let adminList = document.getElementById("adminList")
        for (uid in adminRef) {
            let email = adminRef[uid]
            adminList.insertAdjacentHTML(
                "beforeend",
                `<div class="admin_details">
                    <p>${email}</p>
                    <p>&emsp;└ ${uid}</p>
                    <p>&emsp;└ administrator</p>
                </div>`
            )
        }
    })
    let editorRef = new Map()
    database.ref("editors/").once("value").then(snapshot => {
        if (snapshot.exists()) {
            for ([i, j] of Object.entries(snapshot.val())) {
                editorRef[i] = j.email
            }
        }
    }).then(() => {
        let adminList = document.getElementById("adminList")
        for (uid in editorRef) {
            let email = editorRef[uid]
            adminList.insertAdjacentHTML(
                "beforeend",
                `<div class="admin_details">
                    <p>${email}</p>
                    <p>&emsp;&boxur; ${uid}</p>
                    <p>&emsp;&boxur; editor</p>
                </div>`
            )
        }
    })
}

function show_admin(email, status) {
    document.getElementById("adminContent").style.display = "block"
    listAdmins()
    document.getElementById("welcome").insertAdjacentHTML(
        "beforeend",
        `<span id=\"second\">${email}.</span>`
    )
    document.getElementById("status").insertAdjacentHTML(
        "beforeend",
        `<p id=\"third\">Your status: ${status}</p>`
    )
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
                alert("UNAUTHORIZED ACCESS")
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
        alert("UNAUTHORIZED ACCESS")
        window.location.href = "index.html"
    }
})