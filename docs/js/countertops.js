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
            let keys = []
            for (i of data) {
                keys.push(i.id)
            }
            largest = (max(keys) + 1).toString()

            const caption = document.getElementById("newCountertopCaption").value
            let newData = new Map()
            newData["caption"] = caption
            newData["file"] = `${largest}.jpg`
            db.collection("countertops").doc(largest).set({
                ...newData
            })
        }).then(() => {
            const storageRef = storage.ref("countertops/").child(`${largest}.jpg`)
            console.log(largest)
            const uploader = document.getElementById('uploader')
            const file = document.getElementById("newCountertopImg").files[0]
            let task = storageRef.put(file)
            task.on('state_changed', function progress(cur) {
                var percentage = (cur.bytesTransferred/cur.totalBytes)*100
                uploader.value = percentage
            })
        }).catch(error => {
            console.log("ERROR", error)
        })
    } else {
        alert("Please fill in all fields")
    }
})

//makes information drop down
function expandCountertop(key) {
    let element = document.getElementById("countertop" + key)
    let container = element.getElementsByClassName("details")[0]
    if (container.style.maxHeight){
        container.style.maxHeight = null;
    } else {
        container.style.maxHeight = container.scrollHeight + "px";
    }
}

function refreshCountertops() {
    document.getElementById("countertopsList").querySelector("responsive_row").innerHTML = ""
    for (let i = 0; i < 3; i++) {
        document.getElementById("countertopsList").querySelector("responsive_row").insertAdjacentHTML(
            "beforeend",
            "<div class=\"responsive_column\"></div>"
        )
    }
}

function listCountertops(counter = 0) {
    let cur = counter+1
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
                    `<div class=\"details\"><span class=\"material-icons remove\" id=\"removeCountertop${id}\">remove_circle_outline</span><p>${data["caption"]}<p></div>`
                )
            }).then(() => {
                document.getElementById(`removeCountertop${id}`).addEventListener("click", () => {
                    if (confirm("Are you sure you want to remove this countertop?")) {
                        db.collection("countertops").get().then(snapshot => {
                            const data = snapshot.docs[id].data()
                            const largest = max(Object.keys(data)).toString()
                            console.log(largest)
                        })
                    }
                }) 
            })

        } else {
            cur = null
        }
    }).catch(error => {
        alert("ERROR! " + error)
    }).then(() => {
        if (cur) listCountertops(cur)
    })    
}

listCountertops()