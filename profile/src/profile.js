document.addEventListener('DOMContentLoaded', () => {
    async function getProfile() {
        try {
            const linkToProfile = "https://food-delivery.kreosoft.ru/api/account/profile";
            const tokenForProfile = localStorage.getItem('token');
            const response = await fetch(`${linkToProfile}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${tokenForProfile}`
                }
            });
            return await response.json();
        } catch (error) {
            location.replace("/login");
        }
    }
    async function putProfile(params) {
        const linkToProfile = "https://food-delivery.kreosoft.ru/api/account/profile";
        const tokenForProfile = localStorage.getItem('token');
        const response = await fetch(`${linkToProfile}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenForProfile}`
            },
            body: (JSON.stringify(params)),
        });
        return await response.json();
    }
    async function logOut() {
        const linkToLogout = "https://food-delivery.kreosoft.ru/api/account/logout";
        const tokenForProfile = localStorage.getItem('token');
        const response = await fetch(`${linkToLogout}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenForProfile}`
            }
        });
        return await response.json();
    }
    function validAll(user) {
        let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        let dang = document.querySelectorAll(".text-danger");
        let checkDate = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
        let date = (user.birthDate).split("-");
        let year = Number(date[0]);

        for (let i = 0; i < dang.length; i++) {
            dang[i].classList.add("visually-hidden");
        }
        let bCheck = true;
        if (user.gender !== "Male" && user.gender !== "Female") {
            dang[2].classList.remove("visually-hidden");
            bCheck = false;
        }
        if (!checkDate.test(user.birthDate) || (year > 2021 || year < 1900)) {
            dang[1].classList.remove("visually-hidden");
            bCheck = false;
        }
        if (user.fullName === "") {
            dang[0].classList.remove("visually-hidden");
            bCheck = false;
        }
        if (!regex.test(user.phoneNumber)) {
            dang[4].classList.remove("visually-hidden");
            bCheck = false;
        }
        if ("" === user.address) {
            dang[3].classList.remove("visually-hidden");
            bCheck = false;
        }
        return bCheck;
    }
    let promise = new Promise(function (resolve) {
        resolve(getProfile());
    });
    promise.then(function (respProfile) {
        let profileForm = document.querySelector(".profile-form");
        if (respProfile.email) {
            let profileHtml = document.querySelector("#prfl");
            let regHtml = document.querySelector("#reg");
            let loginHtml = document.querySelector("#loging");
            let lgoutHtml = document.querySelector("#lgout");

            let email = document.querySelector("#inputEmail");
            let userName = document.querySelector("#inputUserName");
            let birthDate = document.querySelector("#inputDate");
            let adress = document.querySelector("#inputAddress");
            let phone = document.querySelector("#inputPhone");
            let gender = document.querySelector("#inputGender");

            regHtml.classList.add("visually-hidden");
            loginHtml.classList.add("visually-hidden");
            profileHtml.textContent = respProfile.email;
            profileHtml.classList.remove("visually-hidden");
            lgoutHtml.classList.remove("visually-hidden");

            email.textContent = respProfile.email;
            userName.value = respProfile.fullName;
            birthDate.value = respProfile.birthDate.slice(0,10);
            adress.value = respProfile.address;
            phone.value = respProfile.phoneNumber;
            gender.value = respProfile.gender;
            submitChange = document.querySelector(".btn-primary");
            submitChange.addEventListener("click", () => {
                user = {
                    fullName: userName.value,
                    address: adress.value,
                    birthDate: birthDate.value,
                    gender: gender.value,
                    phoneNumber: phone.value
                };
                if (validAll(user)) {
                    let promise = new Promise(function (resolve) {
                        resolve(putProfile(user));
                    });
                    promise.then(function (response) {
                        console.log(response);
                    });
                    let success = document.querySelector("#success");
                    success.classList.remove("visually-hidden");
                }
            });
            lgoutHtml.addEventListener("click", () => {
                let promiseLogout = new Promise(function (resolve) {
                    resolve(logOut());
                });
                promiseLogout.then(function (respLogout) {
                    if (respLogout) {
                        console.log("Unsuccess Logout");
                    } else {
                        console.log("Success Logout");
                    }
                    location.reload();
                });
            });
        }
    });
});