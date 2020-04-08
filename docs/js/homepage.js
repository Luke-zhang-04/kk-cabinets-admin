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
var provider = new firebase.auth.GoogleAuthProvider();
//auth state changed
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        window.location.href = "dashboard.html";
    }
    else {
    }
});
//sign in with google
function googleSignin() {
    var err = false;
    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log(typeof (result), result);
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(token, user);
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("ERROR! Code: " + errorCode + "\nInfo: " + errorMessage);
        err = true;
    }).then(function (_) {
        window.location.href = "dashboard.html"; //redirect
    });
}
//logout user
function logout() {
    firebase.auth().signOut();
    console.log("succesfully out");
}
//log a user in
function login(email, password) {
    var err = false;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("ERROR! Code: " + errorCode + "\nInfo: " + errorMessage);
        err = true;
    }).then(function (_) {
        if (!err) {
            window.location.href = "dashboard.html"; //redirect
        }
    });
}
document.getElementById("login_button").addEventListener("click", function (_) {
    var info = [
        document.getElementById("login_email").value,
        document.getElementById("login_password").value,
    ];
    login.apply(void 0, info);
});
//google login button
document.getElementById("login_google").addEventListener("click", function (_) {
    googleSignin();
});
document.getElementById("login_password").addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("login_button").click();
    }
});
