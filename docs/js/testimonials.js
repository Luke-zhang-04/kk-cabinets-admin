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
    })

    input.value = ""
})