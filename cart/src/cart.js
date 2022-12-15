document.addEventListener("DOMContentLoaded", () => {
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
    async function addToCart(id) {
        const linkToCart = "https://food-delivery.kreosoft.ru/api/basket/dish/";
        const tokenForProfile = localStorage.getItem('token');
        const response = await fetch(`${linkToCart}${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenForProfile}`
            }
        });
        return await response.json();
    }
    async function getCart() {
        const linkToCart = "https://food-delivery.kreosoft.ru/api/basket/";
        const tokenForCart = localStorage.getItem('token');
        const response = await fetch(`${linkToCart}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenForCart}`
            }
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

            regHtml.classList.add("visually-hidden");
            loginHtml.classList.add("visually-hidden");
            profileHtml.textContent = respProfile.email;
            profileHtml.classList.remove("visually-hidden");
            lgoutHtml.classList.remove("visually-hidden");
            let promiseCart = new Promise(function (resolve) {
                resolve(getCart());
            });
            promiseCart.then(function (respCart) {
                console.log(respCart);
                let mealsImgs = document.querySelectorAll(".dish-image");
                let mealCards = document.querySelectorAll(".meal-card");
                for (let i = 0; i < respCart.length; i++) {
                    mealCards[i].classList.remove("visually-hidden");
                    mealsImgs[i].src = respCart[i].image;
                    console.log(mealsImgs[i].src);
                }
            });
        }
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
    });
});