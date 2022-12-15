// without ajax
document.addEventListener('DOMContentLoaded', () => {
    async function sendData(params) {
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: (JSON.stringify(params)),
            // 'Authorization': `Bearer ${token}`
        });
        return await response.json();
    }
    function getDataFromForms() {
        return {
            fullName: document.querySelector("#inputUserName").value,
            password: document.querySelector("#inputPassword").value,
            email: document.querySelector("#inputEmail").value,
            address: document.querySelector("#inputAddress").value,
            birthDate: document.querySelector("#inputDate").value,
            gender: document.querySelector("#inputSelectGender").value,
            phoneNumber: document.querySelector("#inputPhone").value
        };
    }
    function validAll(user) {
        let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        let dang = document.querySelectorAll(".text-danger");
        let date = (user.birthDate).split("-");
        let year = Number(date[0]);
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        let checkDate = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

        for (let i = 0; i < dang.length; i++) {
            dang[i].classList.add("visually-hidden");
        }
        let bCheck = true;
        if (user.fullName === "") {
            dang[0].classList.remove("visually-hidden");
            bCheck = false;
        }
        if (user.gender === "") {
            dang[1].classList.remove("visually-hidden");
            bCheck = false;
        }
        if (!regex.test(user.phoneNumber)) {
            dang[2].classList.remove("visually-hidden");
            bCheck = false;
        }
        if (!checkDate.test(user.birthDate) || (year > 2021 || year < 1900)) {
            dang[3].classList.remove("visually-hidden");
            bCheck = false;
        }
        if ("" === user.address) {
            dang[4].classList.remove("visually-hidden");
            bCheck = false;
        }
        if (!pattern.test(user.email)) {
            dang[5].classList.remove("visually-hidden");
            bCheck = false;
        }
        if ("" === user.password) {
            dang[6].classList.remove("visually-hidden");
            bCheck = false;
        }
        return bCheck;
    }
    submitReg = document.querySelector(".btn-primary");
    submitReg.addEventListener("click", () => {
        user = getDataFromForms();
        if (validAll(user)) {
            let promise = new Promise(function (resolve) {
                resolve(sendData(user));
            });
            promise.then(function (response) {
                responseObj = response;

                localStorage.setItem('token', responseObj.token);
                console.log(localStorage.getItem('token')); // read
                location.replace("/");
            });
        } else {
            console.log("Unfortune");
        }
    });
    console.log("register works");
    //  // write
    // console.log(localStorage.getItem('token')); // read
});