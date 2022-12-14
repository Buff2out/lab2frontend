document.addEventListener("DOMContentLoaded", () => {
    async function sendData(params) {
        const linkToReg = "https://food-delivery.kreosoft.ru/api/account/register";
        console.log(JSON.stringify(params));
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
            email: document.querySelector("#inputEmail").value,
            password: document.querySelector("#inputPassword").value
        }
    }
    let dang = document.querySelector("#crdsText-danger");
    submitReg = document.querySelector(".btn-primary");
    submitReg.addEventListener("click", () => {
        user = getDataFromForms();
        console.log(user);
        console.log(JSON.stringify(user));
        let promise = new Promise(function (resolve) {
            resolve(sendData(user));
        });
        promise.then(function (response) {
            console.log(response);
            responseObj = response;
            if (response.token) {
                localStorage.setItem('token', responseObj.token);
                console.log(localStorage.getItem('token')); // read
                history.pushState(null, null, ``);
                location.reload();
            } else {
                dang.classList.remove("visually-hidden");
            }
        });
    });

})