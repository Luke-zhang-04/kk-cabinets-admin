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

document.getElementById("new_gallery_entry").addEventListener("submit", e => {
    e.preventDefault()
    let largest
    if (checkGalleryForm()) {
        db.collection("gallery").get().then(snapshot => {
            const data = snapshot.docs

            largest = (max(Object.keys(data)) + 1).toString()


            const newData = new Map()
            newData["file"] = `${Date.now()}.jpg`
            newData["details"] = {
                "colour": document.getElementById("newGalleryColour").value.toLowerCase(),
                "furniture": {
                    "cabinet": document.getElementById("newGalleryCabinet").checked,
                    "countertop": document.getElementById("newGalleryCountertop").checked
                },
                "location": document.getElementById("newGalleryLocation").value.toLowerCase(),
                "material": document.getElementById("newGalleryMaterial").value.toLowerCase(),
                "pattern": document.getElementById("newGalleryPattern").checked
            }

            return db.collection("gallery").doc(largest).set({
                ...newData
            }).then(() => {return newData})
        }).then(newData => {
            const storageRef = storage.ref("gallery/").child(newData["file"])
            const file = document.getElementById("newGalleryImg").files[0]
            let task = storageRef.put(file)
            Promise.resolve(task).then(() => {
                alert("Success!")
                refreshGallery()
            })
        }).catch(err => {
            console.log(err)
            alert("An error occured. Check console for more details. " + err.message_)
        })
    } else {
        alert("Please fill in all fields")
    }
})

function checkGalleryForm() {
    for (i of document.getElementById("new_gallery_entry").querySelector(".form-group").getElementsByTagName("input")) {
        if (!i.value) return false
    }
    return true
}

function expandGallery(key) {
    let element = document.getElementById("gallery" + key)
    let container = element.querySelector(".details")
    if (container.style.maxHeight){
        container.style.maxHeight = null;
    } else {
        container.style.maxHeight = container.scrollHeight + "px";
    }
}

function refreshGallery() {
    document.getElementById("galleryList").querySelector(".responsive_row").innerHTML = ""
    for (let i = 0; i < 4; i++) {
        document.getElementById("galleryList").querySelector(".responsive_row").insertAdjacentHTML(
            "beforeend",
            "<div class=\"responsive_column\"></div>"
        )
    }
    listGallery()
}

function listGallery(counter = 0) {
    let cur = counter + 1
    const column = document.getElementById("galleryList")
        .getElementsByClassName("responsive_column")[counter%4]
    
    const storageRef = storage.ref("gallery")

    db.collection("gallery").doc(counter.toString()).get().then(doc => {
        if (doc.exists) {
            const data = doc.data()
            const imgRef = data.file
            const imgURL = storageRef.child(imgRef)
            const id = counter
            const elem = column
            let furniture


            if (data.details.furniture.cabinet && data.details.furniture.countertop) {
                furniture = "Cabinets, countertops"
            } else if (data.details.furniture.cabinet) {
                furniture = "Cabinets"
            } else if (data.details.furniture.countertop) {
                furniture = "Countertops"
            } else {
                furniture = "none"
            }

            imgURL.getDownloadURL().then(url => {
                elem.insertAdjacentHTML(
                    "beforeend",
                    "<div class=\"image_container\" id=gallery" + id + "><img onclick=\"expandGallery(" + id + ")\"src=\""+ url + "\"/></div>"
                )

                //attach information to image
                let element = document.getElementById(`gallery${id}`) //shortcut for target element

                //append information to element
                element.insertAdjacentHTML(
                    "beforeend",
                    `<div class=\"details\"><span class=\"material-icons remove\" id=\"removeGallery${id}\">remove_circle_outline</span>
                        <p>Colour: ${data.details.colour.charAt(0).toUpperCase() + data.details.colour.slice(1)}</p>
                        <p>Furniture: ${furniture}</p>
                        <p>Location: ${data.details.location.charAt(0).toUpperCase() + data.details.location.slice(1)}</p>
                        <p>Material: ${data.details.material.charAt(0).toUpperCase() + data.details.material.slice(1)}</p>
                        <p>Pattern: ${(data.details.pattern ? "yes" : "no")}</p>
                    </div>`
                )
            }).then(() => {
                document.getElementById(`removeGallery${id}`).addEventListener("click", () => {
                    if (confirm("Are you sure you want to remove this gallery entry?")) {
                        db.collection("gallery").get().then(snapshot => {
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
                                db.collection("gallery").doc(id.toString()).set({
                                    ...dataForAdd
                                }).then(() => {
                                    db.collection("gallery").doc(largest.toString()).delete().then(() => {
                                        alert("Success!")
                                        refreshGallery()
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
                        }).catch(err => {
                            console.log(err)
                            alert("An error occured. Check console for more details. " + err.message_)
                        })
                    }
                })
            })
        } else {
            cur = null
        }
    }).catch(err => {
        console.log(err)
        alert("An error occured. Check console for more details. " + err.message_)
    }).then(() => {
        if (cur) listGallery(cur)
    })
}

listGallery()