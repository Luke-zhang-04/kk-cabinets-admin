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