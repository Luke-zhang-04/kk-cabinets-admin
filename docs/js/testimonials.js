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

document.getElementById("new_testimonial").addEventListener("submit", form => {
    form.preventDefault()

    const input = document.getElementById("new_testimonial_input")
    const value = input.value
    
    db.collection("testimonials").get().then(snapshot => {
        const data = snapshot.docs[0].data()
        const largest = (max(Object.keys(data)) + 1).toString()

        let newData = new Map()
        newData[largest] = value

        db.collection("testimonials").doc("testimonials").update({
            ...newData
        })
    }).then(() => {
        refreshTestimonials()
    })

    input.value = ""
})

function refreshTestimonials() {
    getStatus().then(status => {
        if (status === "admin" || status === "editor") {
            document.getElementById("testimonialsList").innerHTML = ""
            listTestimonials()
        }
    })
}

function listTestimonials() {
    const testList = document.getElementById("testimonialsList")

    db.collection("testimonials").get().then(snapshot => {
        const data = snapshot.docs[0].data()
        for ([key, value] of Object.entries(data)) {
            testList.insertAdjacentHTML(
                "beforeend",
                `<div class=\"row\">
                    <div class=\"col-1\">
                        <span class="material-icons remove" id=\"testimonial${key}\">remove_circle_outline</span>
                    </div>
                    <div class=\"col-11\">
                        <p>${value}</p>
                    </div>
                </div>`
            )
            const id = key
            document.getElementById(`testimonial${id}`).addEventListener("click", () => {
                //for deleting data
                if(confirm("Are you sure you want to delete this testimonial?")) {
                    db.collection("testimonials").get().then(snapshot => {
                        const data = snapshot.docs[0].data()
                        const largest = max(Object.keys(data)).toString()
                        let dataForAdd = new Map()
                        dataForAdd[id] = data[largest]
                        dataForAdd[largest] = firebase.firestore.FieldValue.delete()
                        db.collection("testimonials").doc("testimonials").update({
                            ...dataForAdd
                        }).then(() => {
                            refreshTestimonials()
                        })
                    })
                }
            })
        }
    })
}

getStatus().then(status => {
    if (status === "admin" || status === "editor") {
        listTestimonials()
    }
})