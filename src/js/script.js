var page_buttons = document.querySelectorAll(".page-link");

var a = page_buttons[1];

page_buttons.forEach(element => {

    element.addEventListener("click", () => {
        a.classList.remove("active");
        a = element;
        a.classList.add("active");
    })

});



document.addEventListener('DOMContentLoaded', () => {
    function openMenu(numPage = 1) {
        function setPagHtmlVals (numPage, sizeOfPag) {
            let backPag = document.getElementsByClassName("backPag")[0];
            let ftPag = document.getElementsByClassName("ftPag")[0];
            let scPag = document.getElementsByClassName("scPag")[0];
            let tdPag = document.getElementsByClassName("tdPag")[0];
            let frontPag = document.getElementsByClassName("frontPag")[0];
            if (numPage == 1) {
                backPag.disabled = true;
            } else if (numPage == sizeOfPag - 1) {
                console.log("numPage == sizeOfPag - 1");
            }
        }

        var x = new XMLHttpRequest();
        const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
        x.open("GET", `${linkToDish}?page=${numPage}`, true);
        x.onload = function () {
            const menuPage = JSON.parse(x.responseText);
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
    document.querySelector(".menuLink").addEventListener("click", () => {
        numPage = openMenu();
    });
});