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

    async function openMenu(numPage = 1) {
        // задаём значения для innerhtml тутъ
        //setPagHtmlVals(numPage);
        // конецтут
        const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
        const response = await fetch(`${linkToDish}?page=${numPage}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        return await response.json();

    }
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
        history.pushState(null, null, `?page=${paginObj.prev}`);
        return paginObj;
    }
    function f1 (GETParamsObj, paginObj, menuPage) {
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

        if (Number(GETParamsObj.page) > Number(menuPage.pagination.count)) {
            numPage = menuPage.pagination.count;
        } else if (Number(GETParamsObj.page) < 1) {
            numPage = 1;
        } else {
            numPage = Number(GETParamsObj.page);
        }
        history.pushState(null, null, `?page=${numPage}`);
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

        setPagHtmlVals();
        return [paginObj, GETParamsObj];
    }
    let GETParamsObj = parseGetParams();
    let numPage = 0;
    if (GETParamsObj.page === undefined) {
        numPage = 1;
    } else if (Number(GETParamsObj.page) < 1) {
        numPage = 1;
    } else {
        numPage = Number(GETParamsObj.page);
    }
    history.pushState(null, null, `?page=${numPage}`);
    GETParamsObj = parseGetParams();
    let paginObj = {
        page_buttons: document.querySelectorAll(".page-link"),
        prev: numPage,
        numPage: numPage
    };

    let menuPage2 = new Promise(function (resolve) {
        resolve(openMenu(Number(GETParamsObj.page)))
    });
    menuPage2.then(function(value) {
        let arrPG = f1(GETParamsObj, paginObj, value);
        paginObj = arrPG[0];
        GETParamsObj = arrPG[1];
        paginObj.page_buttons[0].addEventListener("click", () => {
            history.pushState(null, null, `?page=${Number(paginObj.prev) - 1}`);
            location.reload();
        });
        paginObj.page_buttons[1].addEventListener("click", () => {
            history.pushState(null, null, `?page=${Number(paginObj.page_buttons[1].textContent)}`);
            location.reload();
        });
        paginObj.page_buttons[2].addEventListener("click", () => {
            history.pushState(null, null, `?page=${Number(paginObj.page_buttons[2].textContent)}`);
            location.reload();
        });
        paginObj.page_buttons[3].addEventListener("click", () => {
            history.pushState(null, null, `?page=${Number(paginObj.page_buttons[3].textContent)}`);
            location.reload();
        });
        paginObj.page_buttons[4].addEventListener("click", () => {
            history.pushState(null, null, `?page=${Number(paginObj.prev) + 1}`);
            location.reload();
        });
    });
    //openMenu(Number(GETParamsObj.page));
    //console.log(menuPage);

    document.querySelector(".menuLink").addEventListener("click", () => {
        openMenu();
    });
});
