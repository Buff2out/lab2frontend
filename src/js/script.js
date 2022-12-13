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
            imgs = document.querySelectorAll(".card-img-top");
            cTitles = document.querySelectorAll(".card-title");
            mPrices = document.querySelectorAll(".meal-price");
            cTexts = document.querySelectorAll(".card-text");
            for (let i = 0; i < menuPage.dishes.length; i++) {
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
        //history.pushState(null, null, `?page=${numPage}`);
        console.log(GETParamsObj);
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
        if (GETParamsObj.page === undefined) {
            numPage = 1;
        } else if (Number(GETParamsObj.page) < 1) {
            numPage = 1;
        } else {
            numPage = Number(GETParamsObj.page);
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
        if (GETParamsObj.categories === undefined || GETParamsObj.categories.length === 0) {
            aLineString = `&vegetarian=${vegBool}&sorting=${sorting}`;
            history.pushState(null, null, `?page=${numPage}${aLineString}`);
        } else {
            aLineString = `&vegetarian=${vegBool}&sorting=${sorting}`;
            for (let i = 0; i < ctgs.length; i++) {
                aLineString = `${aLineString}&categories=${ctgs[i]}`;
            }

            history.pushState(null, null, `?page=${numPage}${aLineString}`);
        }
        console.log(numPage, aLineString)
        return [numPage, aLineString];
    }
    let GETParamsObj2 = new Promise(function (resolve) {
        resolve(parseGetParams());
    });
    GETParamsObj2.then(function (GETParamsObj22) {
        let arrNumPageAlineString = parseParsedALine(GETParamsObj22);
        let numPage = arrNumPageAlineString[0];
        let aLineString = arrNumPageAlineString[1];
        let GETParamsObj3 = new Promise(function (resolve) {
            resolve(parseGetParams());
        });
        GETParamsObj3.then(function (GETParamsObj){
            console.log(GETParamsObj);
            let paginObj = {
                page_buttons: document.querySelectorAll(".page-link"),
                prev: numPage,
                numPage: numPage
            };
            let menuPage2 = new Promise(function (resolve) {
                resolve(openMenu(numPage, aLineString))
            });
            menuPage2.then(function(value) {
                let arrPG = f1(GETParamsObj, paginObj, value);
                paginObj = arrPG[0];
                GETParamsObj = arrPG[1];
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
            });
        });
    });

    //let GETParamsObj = parseGetParams();


    //openMenu(Number(GETParamsObj.page));

    document.querySelector(".menuLink").addEventListener("click", () => {
        openMenu(numPage, aLineString);
    });
});
