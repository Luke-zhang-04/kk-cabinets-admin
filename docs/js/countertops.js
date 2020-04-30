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

document.getElementById("new_countertop").addEventListener("submit", e => {
    e.preventDefault()
    let largest
    if (document.getElementById("newCountertopCaption").value && document.getElementById("newCountertopImg")) {
        db.collection("countertops").get().then(snapshot => {
            const data = snapshot.docs

            largest = (max(Object.keys(data)) + 1).toString()

            const caption = document.getElementById("newCountertopCaption").value
            let newData = new Map()
            newData["caption"] = caption
            newData["file"] = `${Date.now()}.jpg`
            return db.collection("countertops").doc(largest).set({
                ...newData
            }).then(() => {return newData})
        }).then(newData => {
            const storageRef = storage.ref("countertops/").child(newData["file"])
            const file = document.getElementById("newCountertopImg").files[0]
            let task = storageRef.put(file)
            Promise.resolve(task).then(() => {
                alert("Success!")
                refreshCountertops()
            })
        }).catch(err => {
            console.log(err)
            alert("An error occured. Check console for more details. " + err.message_)
        })
    } else {
        alert("Please fill in all fields")
    }
})

//makes information drop down
function expandCountertop(key) {
    let element = document.getElementById("countertop" + key)
    let container = element.querySelector(".details")[0]
    if (container.style.maxHeight){
        container.style.maxHeight = null;
    } else {
        container.style.maxHeight = container.scrollHeight + "px";
    }
}

function refreshCountertops() {
    document.getElementById("countertopsList").querySelector(".responsive_row").innerHTML = ""
    for (let i = 0; i < 4; i++) {
        document.getElementById("countertopsList").querySelector(".responsive_row").insertAdjacentHTML(
            "beforeend",
            "<div class=\"responsive_column\"></div>"
        )
    }
    listCountertops()
}

function listCountertops(counter = 0) {
    let cur = counter + 1
    const column = document.getElementById("countertopsList")
        .getElementsByClassName("responsive_column")[counter%4]

    const storageRef = storage.ref("countertops")

    db.collection("countertops").doc(counter.toString()).get().then(doc => {
        if (doc.exists) {
            const data = doc.data()
            const imgRef = data.file
            const imgURL = storageRef.child(imgRef)
            const id = counter
            const elem = column
            imgURL.getDownloadURL().then(url => {
                elem.insertAdjacentHTML(
                    "beforeend",
                    "<div class=\"image_container\" id=countertop" + id + "><img onclick=\"expandCountertop(" + id + ")\"src=\""+ url + "\"/></div>"
                )

                //attach information to image
                let element = document.getElementById(`countertop${id}`) //shortcut for target element

                //append information to element
                element.insertAdjacentHTML(
                    "beforeend",
                    `<div class=\"details\"><span class=\"material-icons remove\" id=\"removeCountertop${id}\">remove_circle_outline</span><p>${data["caption"]}</p></div>`
                )
            }).then(() => {
                document.getElementById(`removeCountertop${id}`).addEventListener("click", () => { //remove countertop
                    if (confirm("Are you sure you want to remove this countertop?")) {
                        db.collection("countertops").get().then(snapshot => {
                            let data //data of object to be deleted
                            for (doc of snapshot.docs) {
                                if (doc.id == id) {
                                    data = doc.data()
                                    break
                                }
                            }
                            const largest = max(Object.keys(snapshot.docs)).toString() //largest key
                            let largestData

                            for (doc of snapshot.docs) { //data of object with largest id
                                if (doc.id == largest) {
                                    largestData = doc.data()
                                    break
                                }
                            }

                            const file = data.file
                            
                            let dataForAdd = new Map()
                            
                            for (i of Object.keys(largestData)) {
                                dataForAdd[i] = largestData[i]
                            }
                            
                            storageRef.child(file).delete().then(() => {
                                db.collection("countertops").doc(id.toString()).set({
                                    ...dataForAdd
                                }).then(() => {
                                    db.collection("countertops").doc(largest.toString()).delete().then(() => {
                                        alert("Success!")
                                        refreshCountertops()
                                    }).catch(err => {
                                        console.log(err)
                                        alert("An error occured. Check console for more details. " + err.message_)
                                    })
                                }).catch(err => {
                                    console.log(err)
                                    alert("An error occured. Check console for more details. " + err.message_)
                                })
                            }).catch(err => {
                                console.log(err)
                                alert("An error occured. Check console for more details. " + err.message_)
                            })
                        })
                    }
                }) 
            }).catch(err => {
                console.log(err)
                alert("An error occured. Check console for more details. " + err.message_)
            })

        } else {
            cur = null
        }
    }).catch(err => {
        console.log(err)
        alert("An error occured. Check console for more details. " + err.message_)
    }).then(() => {
        if (cur) listCountertops(cur)
    })    
}

listCountertops()