var menuPage = {};
document.addEventListener('DOMContentLoaded', () => {
    function parseGetParams() {
        var $_GET = {};
        var __GET = window.location.search.substring(1).split("&");
        for(var i=0; i<__GET.length; i++) {
            var getVar = __GET[i].split("=");
            $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
        }
        return $_GET;
    }
    function openMenu(numPage = 1) {
        function setPagHtmlVals() {
            imgs = document.querySelectorAll(".card-img-top");
            cTitles = document.querySelectorAll(".card-title");
            mPrices = document.querySelectorAll(".meal-price");
            cTexts = document.querySelectorAll(".card-text");
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].src = menuPage.dishes[i].image;
                cTitles[i].textContent = menuPage.dishes[i].name;
                mPrices[i].textContent = menuPage.dishes[i].price;
                cTexts[i].textContent = menuPage.dishes[i].description;
            }
        }
        // задаём значения для innerhtml тутъ
        //setPagHtmlVals(numPage);
        // конецтут

        var x = new XMLHttpRequest();
        const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
        x.open("GET", `${linkToDish}?page=${numPage}`, true);
        x.responseType = "json";
        x.send(null);
        x.addEventListener("load", () => {
            function releasePagBtn (i, paginObj) {
                // console.log(menuPage);
                paginObj.page_buttons[paginObj.prev].classList.remove("active");
                paginObj.page_buttons[i].classList.add("active");
                // случаи:
                // 1 !2! 3 click << (станет !1! 2 3)
                // 1 2 !3! click >> (станет: 2 3 !4!)
                // 3 !4! 5 click >> (станет 3 4 !5!) нужно учесть size
                if ("«" === paginObj.page_buttons[i].textContent) {
                    paginObj.page_buttons[i].classList.remove("active");
                    if (paginObj.prev === 1) {
                        paginObj.page_buttons[1].textContent = String(Number(paginObj.page_buttons[1].textContent) - 1);
                        paginObj.page_buttons[2].textContent = String(Number(paginObj.page_buttons[2].textContent) - 1);
                        paginObj.page_buttons[3].textContent = String(Number(paginObj.page_buttons[3].textContent) - 1);

                        paginObj.page_buttons[paginObj.prev].classList.add("active");
                        // prev = prev;
                    } else {
                        paginObj.page_buttons[paginObj.prev - 1].classList.add("active");
                        paginObj.prev--;
                    }
                    paginObj.numPage--;

                } else if ("»" === paginObj.page_buttons[i].textContent) {
                    paginObj.page_buttons[i].classList.remove("active");
                    if (paginObj.prev === 3) {
                        paginObj.page_buttons[1].textContent = String(Number(paginObj.page_buttons[1].textContent) + 1);
                        paginObj.page_buttons[2].textContent = String(Number(paginObj.page_buttons[2].textContent) + 1);
                        paginObj.page_buttons[3].textContent = String(Number(paginObj.page_buttons[3].textContent) + 1);

                        paginObj.page_buttons[paginObj.prev].classList.add("active");
                        // prev = prev;
                    } else {
                        paginObj.page_buttons[paginObj.prev + 1].classList.add("active");
                        paginObj.prev++;
                    }
                    paginObj.numPage++;
                } else {
                    paginObj.numPage = Number(paginObj.page_buttons[i].textContent);
                    paginObj.prev = i;
                }
                if (1 === Number(paginObj.page_buttons[1].textContent) && 1 === Number(paginObj.page_buttons[paginObj.prev].textContent)) {
                    paginObj.page_buttons[0].classList.add("disabled");
                } else if (Number(menuPage.pagination.count) === Number(paginObj.page_buttons[paginObj.prev].textContent)) {
                    paginObj.page_buttons[4].classList.add("disabled");
                    if (Number(menuPage.pagination.count) !== Number(paginObj.page_buttons[3].textContent)) {
                        paginObj.page_buttons[3].classList.add("disabled");
                        if (Number(menuPage.pagination.count) !== Number(paginObj.page_buttons[2].textContent)) {
                            paginObj.page_buttons[2].classList.add("disabled");
                        }
                    }
                } else {
                    paginObj.page_buttons[0].classList.remove("disabled");
                    paginObj.page_buttons[1].classList.remove("disabled");
                    paginObj.page_buttons[2].classList.remove("disabled");
                    paginObj.page_buttons[3].classList.remove("disabled");
                    paginObj.page_buttons[4].classList.remove("disabled");
                }

                return paginObj;
            }
            menuPage = x.response;
            console.log(menuPage);
            let numPage = 0;
            let paginObj = {
                page_buttons: document.querySelectorAll(".page-link"),
                prev: numPage,
                numPage: numPage
            };
            if (GETParamsObj.page === undefined) {
                numPage = 1;
                paginObj.page_buttons[0].classList.add("disabled");
                paginObj.page_buttons[1].classList.add("active");
                if (Number(menuPage.pagination.count) === 1) {
                    paginObj.page_buttons[3].classList.add("disabled");
                    paginObj.page_buttons[4].classList.add("disabled");
                    paginObj.page_buttons[2].classList.add("disabled");
                    paginObj.page_buttons[0].classList.add("disabled");
                }
            } else {
                if (Number(GETParamsObj.page) > Number(menuPage.pagination.count)) {
                    numPage = menuPage.pagination.count;
                }
                switch (Number(GETParamsObj.page)) {
                    case 1:
                        numPage = 1;
                        paginObj.page_buttons[1].classList.add("active");
                        paginObj.page_buttons[0].classList.add("disabled");
                        if (Number(menuPage.pagination.count) === 1) {
                            paginObj.page_buttons[3].classList.add("disabled");
                            paginObj.page_buttons[4].classList.add("disabled");
                            paginObj.page_buttons[2].classList.add("disabled");
                        }
                        break;
                    case 2:
                        numPage = 2;
                        paginObj.page_buttons[2].classList.add("active");
                        if (Number(menuPage.pagination.count) === 2) {
                            paginObj.page_buttons[3].classList.add("disabled");
                            paginObj.page_buttons[4].classList.add("disabled");
                        }
                        break;
                    default:
                        numPage = Number(GETParamsObj.page);
                        paginObj.page_buttons[1].textContent = String(Number(GETParamsObj.page) - 2);
                        paginObj.page_buttons[2].textContent = String(Number(GETParamsObj.page) - 1);
                        paginObj.page_buttons[3].textContent = String(Number(GETParamsObj.page));
                        if (Number(menuPage.pagination.count) === Number(Number(GETParamsObj.page))) {
                            paginObj.page_buttons[4].classList.add("disabled");
                        }
                }
            }
            history.pushState(null, null, `?page=${numPage}`);
            //openMenu(Number(numPage));
            paginObj.prev = numPage;
            paginObj.numPage = numPage;

            setPagHtmlVals();
            recSum++;
            console.log(recSum);
            paginObj.page_buttons[0].addEventListener("click", () => {
                paginObj = releasePagBtn(0, paginObj);
                openMenu(paginObj.numPage);
            });
            paginObj.page_buttons[1].addEventListener("click", () => {
                paginObj = releasePagBtn(1, paginObj);
                openMenu(paginObj.numPage);
            });
            paginObj.page_buttons[2].addEventListener("click", () => {
                paginObj = releasePagBtn(2, paginObj);
                openMenu(paginObj.numPage);
            });
            paginObj.page_buttons[3].addEventListener("click", () => {
                paginObj = releasePagBtn(3, paginObj);
                openMenu(paginObj.numPage);
            });
            paginObj.page_buttons[4].addEventListener("click", () => {
                paginObj = releasePagBtn(4, paginObj);
                openMenu(paginObj.numPage);
            });
        });
    }
    let GETParamsObj = parseGetParams();
    let recSum = 0;
    if (GETParamsObj.page === undefined) {
        openMenu();
        console.log("WORKS1");
    } else {
        openMenu(Number(GETParamsObj.page));
        console.log("WORKS2");
    }

    document.querySelector(".menuLink").addEventListener("click", () => {
        openMenu();
    });
});