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
                    "<div class=\"details\"><p>" + data["caption"] + "<p></div>"
                )
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