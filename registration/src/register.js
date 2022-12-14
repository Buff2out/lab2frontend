// without ajax
document.addEventListener('DOMContentLoaded', () => {
    async function sendData(params, token) {
        // example POST to server
        // {
        //   "fullName": "string",
        //   "password": "string",
        //   "email": "user@example.com",
        //   "address": "string",
        //   "birthDate": "2022-12-14T12:34:33.976Z",
        //   "gender": "Male",
        //   "phoneNumber": "string"
        // }
        const linkToReg = "https://food-delivery.kreosoft.ru/api/account/register";
        const response = await fetch(`${linkToReg}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'body': params,
                'Authorization': `Bearer ${token}`
            }
        });
        return await response;
    }
    function getDataFromForms() {
        return {
            fio: document.querySelector("#inputUserName"),
            gend: document.querySelector("#inputSelectGender"),
            phn: document.querySelector("#inputPhone"),
            brth: document.querySelector("#inputDate"),
            adrs: document.querySelector("#inputAddress"),
            mail: document.querySelector("#inputEmail"),
            pswd: document.querySelector("#inputPassword")
        };
    }
    function validAll() {
        let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        let user = getDataFromForms();
        if (user.fio === "") {
            console.log("fio incorrect")
        }
        if (regex.test(user.phn)) {

        } else {

        }
        return false;
    }

    console.log("register works");
    // localStorage.setItem('token', 'asY-x34SfYPk'); // write
    // console.log(localStorage.getItem('token')); // read
});