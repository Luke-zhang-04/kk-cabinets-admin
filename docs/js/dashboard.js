/*
	KK Cabinets
    Copyright (C) 2020  Luke Zhang, Ethan Lim
    
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

const adminForm = document.querySelector(".admin-actions")
adminForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const adminEmail = document.querySelector("#new-admin-email").value
    const addAdminRole = functions.httpsCallable("addAdminRole")
    addAdminRole({email: adminEmail}).then(result => {
        console.log(result)
    })
})