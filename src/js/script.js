function parseGetParams() {
    var $_GET = {};
    var __GET = window.location.search.substring(1).split("&");
    for(var i=0; i<__GET.length; i++) {
        var getVar = __GET[i].split("=");
        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1];
    }
    return $_GET;
}
var menuPage = 0;

document.addEventListener('DOMContentLoaded', () => {
    function openMenu(numPage = 1) {
        //history.pushState(null, null, `?page=${numPage}`);
        function setValsToCards() {
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
        var x = new XMLHttpRequest();
        const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
        x.open("GET", `${linkToDish}?page=${numPage}`, true);
        x.onload = function () {
            menuPage = JSON.parse(x.responseText);
            setValsToCards();
            console.log(menuPage.dishes)
            console.log(menuPage.pagination)
        }
        x.send(null);

        // задаём значения для innerhtml тутъ
        //setPagHtmlVals(numPage);
        // конецтут
        return numPage;
    }
    function releasePagBtn (i, paginObj) {
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
            openMenu(paginObj.numPage);

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
            openMenu(paginObj.numPage);
        } else {
            paginObj.numPage = openMenu(Number(paginObj.page_buttons[i].textContent));
            paginObj.prev = i;
        }
        if (1 === Number(paginObj.page_buttons[1].textContent) && 1 === Number(paginObj.page_buttons[paginObj.prev].textContent)) {
            paginObj.page_buttons[0].classList.add("disabled");
        } else if (Number(menuPage.pagination.count) === Number(paginObj.page_buttons[paginObj.prev].textContent) && Number(menuPage.pagination.count) === Number(paginObj.page_buttons[3].textContent)) {
            paginObj.page_buttons[4].classList.add("disabled");
        } else {
            paginObj.page_buttons[0].classList.remove("disabled");
            paginObj.page_buttons[4].classList.remove("disabled");
        }
        return paginObj;
    }
    let GETParamsObj = parseGetParams();
    let numPage = 0
    if (GETParamsObj.page == null) {
        numPage = openMenu();
    } else {
        numPage = openMenu(Number(GETParamsObj.page));
    }
    let paginObj = {
        page_buttons: document.querySelectorAll(".page-link"),
        prev: 1,
        numPage: numPage
    };

    for (let i = 0; i < paginObj.page_buttons.length; i++) {

        paginObj.page_buttons[i].addEventListener("click", () => {
            paginObj = releasePagBtn(i, paginObj);
        });
    }
    document.querySelector(".menuLink").addEventListener("click", () => {
        numPage = openMenu();
    });
});