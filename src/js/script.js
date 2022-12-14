var menuPage = {};
document.addEventListener('DOMContentLoaded', () => {
    async function parseGetParams() {
        var query = location.search.substr(1);
        var params = query.split("&");
        var result = {};
        for(var i=0; i<params.length; i++) {
            var item = params[i].split("=");

            const key = item[0].replace(/\[|\]/g, '')
            const value = item[1].toLowerCase();

            if(!result[key]) result[key] = [value]
            else result[key].push(value)

        }
        return await result;
    }

    async function openMenu(numPage=1, aLineString="") {
        // задаём значения для innerhtml тутъ
        // конецтут
        const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
        const response = await fetch(`${linkToDish}?page=${numPage}${aLineString}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        return await response.json();

    }
    function f1 (GETParamsObj, paginObj, menuPage) {
        function setPagHtmlVals(menuPage) {
            let cardsH = document.querySelectorAll(".h-100");
            let imgs = document.querySelectorAll(".card-img-top");
            let cTitles = document.querySelectorAll(".card-title");
            let mPrices = document.querySelectorAll(".meal-price");
            let cTexts = document.querySelectorAll(".card-text");
            for (let i = 0; i < menuPage.dishes.length; i++) {
                cardsH[i].classList.remove("visually-hidden");
                imgs[i].src = menuPage.dishes[i].image;
                cTitles[i].textContent = menuPage.dishes[i].name;
                mPrices[i].textContent = menuPage.dishes[i].price;
                cTexts[i].textContent = menuPage.dishes[i].description;
            }
        }

        if (Number(GETParamsObj.page) > Number(menuPage.pagination.count)) {
            numPage = menuPage.pagination.count;
        } else if (Number(GETParamsObj.page) < 1) {
            numPage = 1;
        } else {
            numPage = Number(GETParamsObj.page);
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
        let numPage = 0;
        let vegBool = false;
        let ctgs = [];
        let sorting = "";
        let aLineString = "";
        GETParamsObj.page = GETParamsObj.page[0];
        if (GETParamsObj.page === undefined) {
            numPage = 1;
        } else if (Number(GETParamsObj.page) < 1) {
            numPage = 1;
        } else {
            numPage = Number(GETParamsObj.page);
        }
        GETParamsObj.vegetarian = GETParamsObj.vegetarian[0];
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
                        break;
                    case "pizza":
                        ctgs.push("pizza");
                        break;
                    case "soup":
                        ctgs.push("soup");
                        break;
                    case "dessert":
                        ctgs.push("dessert");
                        break;
                    case "drink":
                        ctgs.push("drink");
                        break;
                    default:
                        GETParamsObj.categories.splice(i, 1);
                }
            }
        }
        GETParamsObj.sorting = GETParamsObj.sorting[0];
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
        console.log("f1");
        console.log(vegBool);
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
        let ctgs = arrNumPageAlineString[3];
        let sorting = arrNumPageAlineString[4];
        console.log("ctgs:");
        console.log(ctgs);
        let GETParamsObj3 = new Promise(function (resolve) {
            resolve(parseGetParams());
        });
        GETParamsObj3.then(function (GETParamsObj){
            console.log(GETParamsObj);
            let paginObj = {
                page_buttons: document.querySelectorAll(".page-link"),
                prev: numPage,
                numPage: numPage,
                vegSwitcher: document.querySelector("#submitPolzunki"),
                srtBtn_0: document.querySelector(".srtBtn0")
            };
            let menuPage2 = new Promise(function (resolve) {
                resolve(openMenu(numPage, aLineString))
            });
            menuPage2.then(function(value) {
                let arrPG = f1(GETParamsObj, paginObj, value);
                paginObj = arrPG[0];
                GETParamsObj = arrPG[1];
                let switchVeg = document.querySelector("#flexSwitchCheckDefault");
                let sbmPolBtn = document.querySelector("#submitPolzunki");
                let sortSelector = document.querySelectorAll(".clsorting");
                let srtBtn_0 = document.querySelector(".srtBtn0");
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
                    console.log(vegBool);
                });
                sbmPolBtn.addEventListener("click", () => {
                    let aLineString2 = "";
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
                        console.log("j");
                        console.log(j);
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
