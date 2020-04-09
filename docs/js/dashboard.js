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

function refreshAdminList() {
    let adminList = document.getElementById("adminList")
    adminList.innerHTML = "<div class=\"admin_details\"><p>Email</p><p>&emsp;&boxur; user id</p><p>&emsp;&boxur; role</p></div>"
    getStatus().then(status => {
        listAdmins(status)
    })
}

function listAdmins(status) {
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
            let info
            if (status === "admin") {
                info = `<div class="admin_details">
                        <p><span class="material-icons remove" id=\"${email}\">remove_circle_outline</span>${email}</p>
                        <p>&emsp;└ ${uid}</p>
                        <p>&emsp;└ administrator</p>
                    </div>`
            } else if (status === "editor") {
                info = `<div class="admin_details">
                        <p>${email}</p>
                        <p>&emsp;└ ${uid}</p>
                        <p>&emsp;└ administrator</p>
                    </div>`
            }
            adminList.insertAdjacentHTML(
                "beforeend",
                info
            )

            if (status === "admin") {
                document.getElementById(email).addEventListener("click", () => {
                    getStatus().then(status => {
                        if (status === "admin") {
                            const removeUsr = functions.httpsCallable("removeRole")
                            removeUsr({email: email}).then(result => {
                                alert(result.data.message)
                                refreshAdminList()
                            })
                        } else {
                            alert("Unauthorized action! Nice try -_-")
                        }
                    }).catch(error => {
                        if (error === undefined) {
                            alert("Unauthorized action! We have backend security too.")
                        } else {
                            alert(error.data)
                        }
                    })
                })
            }
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
            let info
            if (status === "admin") {
                info = `<div class="admin_details">
                        <p><span class="material-icons remove" id=\"${email}\">remove_circle_outline</span>${email}</p>
                        <p>&emsp;└ ${uid}</p>
                        <p>&emsp;└ editor</p>
                    </div>`
            } else if (status === "editor") {
                info = `<div class="admin_details">
                        <p>${email}</p>
                        <p>&emsp;└ ${uid}</p>
                        <p>&emsp;└ editor</p>
                    </div>`
            }
            adminList.insertAdjacentHTML(
                "beforeend",
                info
            )

            if (status === "admin") {
                document.getElementById(email).addEventListener("click", () => {
                    getStatus().then(status => {
                        if (status === "admin") {
                            const removeUsr = functions.httpsCallable("removeRole")
                            removeUsr({email: email}).then(result => {
                                alert(result.data.message)
                                refreshAdminList()
                            })
                        } else {
                            alert("Unauthorized action! Nice try -_-")
                        }
                    }).catch(error => {
                        if (error === undefined) {
                            alert("Unauthorized action! We have backend security too.")
                        } else {
                            alert(error.data)
                        }
                    })
                })
            }
        }
    })
}

function show_admin(email, status) {
    if (status === "admin") {
        document.getElementById("adminContent").style.display = "block"
    }
    document.getElementById("editorContent").style.display = "block"
    
    listAdmins(status)
    document.getElementById("welcome").insertAdjacentHTML(
        "beforeend",
        `<span id=\"second\">${email}.</span>`
    )
    document.getElementById("status").insertAdjacentHTML(
        "beforeend",
        `<p id=\"third\">Your status: ${status}</p>`
    )
}