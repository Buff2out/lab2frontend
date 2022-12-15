var menuPage = {};
document.addEventListener('DOMContentLoaded', () => {
    async function parseGetParams() {
        var query = location.search.substr(1);
        if (query === "") {
            return "";
        } else {
            var params = query.split("&");
            var result = {};
            for (var i = 0; i < params.length; i++) {
                var item = params[i].split("=");

                const key = item[0].replace(/\[|\]/g, '')
                const value = item[1].toLowerCase();

                if (!result[key]) result[key] = [value]
                else result[key].push(value)

            }
            return await result;
        }
    }

    async function openMenu(numPage=1, aLineString="") {
        // задаём значения для innerhtml тутъ
        // конецтут
        const tokenForProfile = localStorage.getItem('token');
        const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
        const response = await fetch(`${linkToDish}?page=${numPage}${aLineString}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenForProfile}`

            }
        });
        return await response.json();

    }

    async function getProfile() {
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
    function f1 (GETParamsObj, paginObj, menuPage) {
        function setPagHtmlVals(menuPage) {
            let cardsH = document.querySelectorAll(".h-100");
            let imgs = document.querySelectorAll(".card-img-top");
            let addToCartBtn = document.querySelectorAll(".btn-basket");
            let cTitles = document.querySelectorAll(".card-title");
            let mCategories = document.querySelectorAll(".meal-category");
            let mRatings = document.querySelectorAll(".meal-rating");
            let mPrices = document.querySelectorAll(".meal-price");
            let cTexts = document.querySelectorAll(".card-text");
            for (let i = 0; i < menuPage.dishes.length; i++) {
                cardsH[i].classList.remove("visually-hidden");
                imgs[i].src = menuPage.dishes[i].image;
                cTitles[i].textContent = menuPage.dishes[i].name;
                mCategories[i].textContent = menuPage.dishes[i].category;
                mRatings[i].textContent = Math.round(menuPage.dishes[i].rating);
                mPrices[i].textContent = menuPage.dishes[i].price;
                cTexts[i].textContent = menuPage.dishes[i].description;

                cTitles[i].addEventListener("click", () => {
                    gettingMealId(menuPage.dishes[i].id);
                });
                addToCartBtn[i].addEventListener("click", () => {
                    let promiseAddToCart = new Promise(function (resolve) {
                        resolve(addToCart(menuPage.dishes[i].id));
                    });
                    promiseAddToCart.then(function (value){
                        console.log(value);
                    });
                });

            }
        }

        function gettingMealId(dishId) {
            history.pushState(null, null, `item?id=${dishId}`);
            location.reload();
        }
        let numPage = 1;
        let switchVeg = document.querySelector("#flexSwitchCheckDefault");
        if (menuPage.pagination !== undefined) {
            if (Number(GETParamsObj.page) > Number(menuPage.pagination.count)) {
                numPage = menuPage.pagination.count;
            } else if (Number(GETParamsObj.page) < 1) {
                numPage = 1;
            } else {
                numPage = Number(GETParamsObj.page);
            }
        } else {
            location.replace("/");
        }
        switch (numPage) {
            case 1:
                paginObj.page_buttons[1].classList.add("active");
                paginObj.page_buttons[0].classList.add("disabled");
                paginObj.page_buttons[2].classList.remove("active");
                paginObj.page_buttons[3].classList.remove("active");
                paginObj.page_buttons[4].classList.remove("disabled");
                if (Number(menuPage.pagination.count) === 1) {
                    paginObj.page_buttons[3].classList.add("disabled");
                    paginObj.page_buttons[4].classList.add("disabled");
                    paginObj.page_buttons[2].classList.add("disabled");
                } else if (Number(menuPage.pagination.count) === 2) {
                    paginObj.page_buttons[3].classList.add("disabled");
                }
                break;
            case 2:
                paginObj.page_buttons[2].classList.add("active");
                paginObj.page_buttons[1].classList.remove("active");
                paginObj.page_buttons[3].classList.remove("active");
                paginObj.page_buttons[0].classList.remove("disabled");
                paginObj.page_buttons[4].classList.remove("disabled");
                if (Number(menuPage.pagination.count) === 2) {
                    paginObj.page_buttons[3].classList.add("disabled");
                    paginObj.page_buttons[4].classList.add("disabled");
                }
                break;
            default:
                paginObj.page_buttons[1].textContent = String(Number(numPage) - 2);
                paginObj.page_buttons[2].textContent = String(Number(numPage) - 1);
                paginObj.page_buttons[3].textContent = String(Number(numPage));

                paginObj.page_buttons[3].classList.add("active");
                paginObj.page_buttons[1].classList.remove("active");
                paginObj.page_buttons[2].classList.remove("active");
                paginObj.page_buttons[0].classList.remove("disabled");
                paginObj.page_buttons[4].classList.remove("disabled");
                if (Number(menuPage.pagination.count) === Number(Number(numPage))) {
                    paginObj.page_buttons[4].classList.add("disabled");
                }
        }
        switch (String(GETParamsObj.vegetarian)) {
            case "true":
                paginObj.vegSwitcher.classList.add("active");
                break;
        }
        switch (String(GETParamsObj.sorting)) {
            case "nameasc":
                paginObj.srtBtn_0.textContent = "А-Я";
                break;
            case "namedesc":
                paginObj.srtBtn_0.textContent = "Я-А";
                break;
            case "priceasc":
                paginObj.srtBtn_0.textContent = "По цене Возр";
                break;
            case "pricedesc":
                paginObj.srtBtn_0.textContent = "По цене Убыв";
                break;
            case "ratingasc":
                paginObj.srtBtn_0.textContent = "По рейт Возр";
                break;
            case "ratingdesc":
                paginObj.srtBtn_0.textContent = "По рейт Убыв";
                break;

        }
        GETParamsObj.page = numPage;
        //openMenu(Number(numPage));
        paginObj.prev = numPage;
        paginObj.numPage = numPage;

        setPagHtmlVals(menuPage);
        return [paginObj, GETParamsObj];
    }
    function parseParsedALine (GETParamsObj) {
        let numPage = 1;
        let vegBool = false;
        let ctgs = [];
        let chBxsCtgs = document.querySelectorAll(".CBCtgs");
        let sorting = "nameasc";
        let aLineString = "";
        try {
            GETParamsObj.page = GETParamsObj.page[0];
        } catch (error) {
            GETParamsObj.page = numPage;
        }
        if (GETParamsObj.page === undefined) {
            numPage = 1;
        } else if (Number(GETParamsObj.page) < 1) {
            numPage = 1;
        } else {
            numPage = Number(GETParamsObj.page);
        }
        try {
            GETParamsObj.vegetarian = GETParamsObj.vegetarian[0];
        } catch (error) {
            GETParamsObj.vegetarian = String(vegBool);
        }
        switch (GETParamsObj.vegetarian) {
            case "false":
                vegBool = false;
                break;
            case "true":
                vegBool = true;
                break;
            default:
                vegBool = false;
        }
        if (GETParamsObj.categories !== undefined && GETParamsObj.categories.length !== 0) {
            for (let i = 0; i < GETParamsObj.categories.length; i++) {
                switch (GETParamsObj.categories[i]) {
                    case "wok":
                        ctgs.push("wok");
                        chBxsCtgs[0].setAttribute("checked", "");
                        break;
                    case "pizza":
                        ctgs.push("pizza");
                        chBxsCtgs[1].setAttribute("checked", "");
                        break;
                    case "soup":
                        ctgs.push("soup");
                        chBxsCtgs[2].setAttribute("checked", "");
                        break;
                    case "dessert":
                        ctgs.push("dessert");
                        chBxsCtgs[3].setAttribute("checked", "");
                        break;
                    case "drink":
                        ctgs.push("drink");
                        chBxsCtgs[4].setAttribute("checked", "");
                        break;
                    default:
                        GETParamsObj.categories.splice(i, 1);
                }
            }
        }
        try {
            GETParamsObj.sorting = GETParamsObj.sorting[0];
        } catch (error) {
            GETParamsObj.sorting = sorting;
        }
        switch (GETParamsObj.sorting) {
            case "nameasc":
                sorting = "nameasc";
                break;
            case "namedesc":
                sorting = "namedesc";
                break;
            case "priceasc":
                sorting = "priceasc";
                break;
            case "pricedesc":
                sorting = "pricedesc";
                break;
            case "ratingasc":
                sorting = "ratingasc";
                break;
            case "ratingdesc":
                sorting = "ratingdesc";
                break;
            default:
                sorting = "nameasc";
        }
        GETParamsObj.page = numPage;
        GETParamsObj.vegetarian = vegBool;
        GETParamsObj.sorting = sorting;
        ctgs = GETParamsObj.categories;
        GETParamsObj.sorting = sorting;
        // v дублирование кода ниже встретится, возможен рефакторинг (в обозримом или нет будущем) v
        if (GETParamsObj.categories === undefined || GETParamsObj.categories.length === 0) {
            aLineString = `&vegetarian=${vegBool}&sorting=${sorting}`;
        } else {
            aLineString = `&vegetarian=${vegBool}&sorting=${sorting}`;
            for (let i = 0; i < ctgs.length; i++) {
                aLineString = `${aLineString}&categories=${ctgs[i]}`;
            }
        }
        history.pushState(null, null, `?page=${numPage}${aLineString}`);
        // ^ вот этого кода ^
        return [numPage, aLineString, vegBool, ctgs, sorting];
    }
    let GETParamsObj2 = new Promise(function (resolve) {
        resolve(parseGetParams());
    });
    GETParamsObj2.then(function (GETParamsObj22) {
        let arrNumPageAlineString = parseParsedALine(GETParamsObj22);
        let numPage = arrNumPageAlineString[0];
        let aLineString = arrNumPageAlineString[1];
        let vegBool = arrNumPageAlineString[2];
        let ctgs = [];
        let sorting = arrNumPageAlineString[4];
        let GETParamsObj3 = new Promise(function (resolve) {
            resolve(parseGetParams());
        });
        GETParamsObj3.then(function (GETParamsObj){
            let paginObj = {
                page_buttons: document.querySelectorAll(".page-link"),
                prev: numPage,
                numPage: numPage,
                vegSwitcher: document.querySelector("#submitPolzunki"),
                srtBtn_0: document.querySelector(".srtBtn0")
            };
            let menuPage2 = new Promise(function (resolve) {
                resolve(openMenu(numPage, aLineString));
            });
            menuPage2.then(function(value) {
                let promise = new Promise(function (resolve) {
                    resolve(getProfile());
                });
                promise.then(function (respProfile) {
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
                let arrPG = f1(GETParamsObj, paginObj, value);
                paginObj = arrPG[0];
                GETParamsObj = arrPG[1];
                let switchVeg = document.querySelector("#flexSwitchCheckDefault");
                let sbmPolBtn = document.querySelector("#submitPolzunki");
                let sortSelector = document.querySelectorAll(".clsorting");
                let srtBtn_0 = document.querySelector(".srtBtn0");
                let chBxsCtgs = document.querySelectorAll(".CBCtgs");
                paginObj.page_buttons[0].addEventListener("click", () => {
                    history.pushState(null, null, `?page=${Number(paginObj.prev) - 1}${aLineString}`);
                    location.reload();
                });
                paginObj.page_buttons[1].addEventListener("click", () => {
                    history.pushState(null, null, `?page=${Number(paginObj.page_buttons[1].textContent)}${aLineString}`);
                    location.reload();
                });
                paginObj.page_buttons[2].addEventListener("click", () => {
                    history.pushState(null, null, `?page=${Number(paginObj.page_buttons[2].textContent)}${aLineString}`);
                    location.reload();
                });
                paginObj.page_buttons[3].addEventListener("click", () => {
                    history.pushState(null, null, `?page=${Number(paginObj.page_buttons[3].textContent)}${aLineString}`);
                    location.reload();
                });
                paginObj.page_buttons[4].addEventListener("click", () => {
                    history.pushState(null, null, `?page=${Number(paginObj.prev) + 1}${aLineString}`);
                    location.reload();
                });
                switchVeg.addEventListener("click", () => {
                    vegBool = !vegBool;
                    if (vegBool) {
                        switchVeg.setAttribute("checked", "");
                    } else {
                        switchVeg.removeAttribute("checked");
                    }
                });
                sbmPolBtn.addEventListener("click", () => {
                    let aLineString2 = "";
                    for (let j = 0; j < chBxsCtgs.length; j++) {
                        if (j === 0 && chBxsCtgs[j].checked) {
                            ctgs.push("wok");
                        } else if (j === 1 && chBxsCtgs[j].checked) {
                            ctgs.push("pizza");
                        } else if (j === 2 && chBxsCtgs[j].checked) {
                            ctgs.push("soup");
                        } else if (j === 3 && chBxsCtgs[j].checked) {
                            ctgs.push("dessert");
                        } else if (j === 4 && chBxsCtgs[j].checked) {
                            ctgs.push("drink");
                        }
                    }
                    if ((ctgs === undefined || ctgs === "") || ctgs.length === 0) {
                        aLineString2 = `&vegetarian=${String(vegBool)}&sorting=${sorting}`;

                    } else {
                        aLineString2 = `&vegetarian=${vegBool}&sorting=${sorting}`;
                        for (let i = 0; i < ctgs.length; i++) {
                            aLineString2 = `${aLineString2}&categories=${ctgs[i]}`;
                        }
                    }
                    history.pushState(null, null, `?page=1${aLineString2}`);
                    location.reload();
                });
                for (let j = 0; j < sortSelector.length; j++) {
                    sortSelector[j].addEventListener("click", () => {
                        switch (j) {
                            case 0:
                                sorting = "nameasc";
                                srtBtn_0.textContent = "А-Я";
                                break;
                            case 1:
                                sorting = "namedesc";
                                srtBtn_0.textContent = "Я-А";
                                break;
                            case 2:
                                sorting = "priceasc";
                                srtBtn_0.textContent = "По цене Возр";
                                break;
                            case 3:
                                sorting = "pricedesc";
                                srtBtn_0.textContent = "По цене Убыв";
                                break;
                            case 4:
                                sorting = "ratingasc";
                                srtBtn_0.textContent = "По рейт Возр";
                                break;
                            case 5:
                                sorting = "ratingdesc";
                                srtBtn_0.textContent = "По рейт Убыв";
                                break;
                        }

                    })
                }
            });
        });
    });

    //let GETParamsObj = parseGetParams();


    //openMenu(Number(GETParamsObj.page));

    document.querySelector(".menuLink").addEventListener("click", () => {
        history.pushState(null, null, ``);
        location.reload();
    });
});
