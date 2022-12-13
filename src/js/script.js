var menuPage = 0;

document.addEventListener('DOMContentLoaded', () => {
    function openMenu(numPage = 1) {
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
    let numPage = openMenu();
    var page_buttons = document.querySelectorAll(".page-link");
    var curr = page_buttons[numPage];
    var prev = 1;
    for (let i = 0; i < page_buttons.length; i++) {

        page_buttons[i].addEventListener("click", () => {

            page_buttons[prev].classList.remove("active");
            page_buttons[i].classList.add("active");
            // случаи:
            // 1 !2! 3 click << (станет !1! 2 3)
            // 1 2 !3! click >> (станет: 2 3 !4!)
            // 3 !4! 5 click >> (станет 3 4 !5!) нужно учесть size
            if ("«" === page_buttons[i].textContent) {
                page_buttons[i].classList.remove("active");
                if (prev === 1) {
                    page_buttons[1].textContent = String(Number(page_buttons[1].textContent) - 1);
                    page_buttons[2].textContent = String(Number(page_buttons[2].textContent) - 1);
                    page_buttons[3].textContent = String(Number(page_buttons[3].textContent) - 1);

                    page_buttons[prev].classList.add("active");
                    // prev = prev;
                } else {
                    page_buttons[prev - 1].classList.add("active");
                    prev--;
                }
                numPage--;
                openMenu(numPage);

            } else if ("»" === page_buttons[i].textContent) {
                page_buttons[i].classList.remove("active");
                if (prev === 3) {
                    page_buttons[1].textContent = String(Number(page_buttons[1].textContent) + 1);
                    page_buttons[2].textContent = String(Number(page_buttons[2].textContent) + 1);
                    page_buttons[3].textContent = String(Number(page_buttons[3].textContent) + 1);

                    page_buttons[prev].classList.add("active");
                    // prev = prev;
                } else {
                    page_buttons[prev + 1].classList.add("active");
                    prev++;
                }
                numPage++;
                openMenu(numPage);
            } else {
                numPage = openMenu(Number(page_buttons[i].textContent));
                prev = i;
            }
            if (1 === Number(page_buttons[1].textContent) && 1 === Number(page_buttons[prev].textContent)) {
                page_buttons[0].classList.add("disabled");
            } else if (Number(menuPage.pagination.count) === Number(page_buttons[prev].textContent) && Number(menuPage.pagination.count) === Number(page_buttons[3].textContent)) {
                page_buttons[4].classList.add("disabled");
            } else {
                page_buttons[0].classList.remove("disabled");
                page_buttons[4].classList.remove("disabled");
            }
        });
    }
    document.querySelector(".menuLink").addEventListener("click", () => {
        numPage = openMenu();
    });
});
