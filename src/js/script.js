document.addEventListener('DOMContentLoaded', () => {
    function openMenu(numPage = 1) {
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
    var page_buttons = document.querySelectorAll(".page-link");
    var a = page_buttons[numPage];
    page_buttons.forEach(element => {
        element.addEventListener("click", () => {
            a.classList.remove("active");
            a = element;
            a.classList.add("active");
            // случаи:
            // 1 !2! 3 click << (станет !1! 2 3)
            // 1 2 !3! click >> (станет: 2 3 !4!)
            // 3 !4! 5 click >> (станет 3 4 !5!) нужно учесть size
            if ("«" === a.textContent) {
                numPage--;
                openMenu(numPage);

            } else if ("»" === a.textContent) {
                if (a.) {
                    numPage++;
                    page_buttons[1].textContent = String(Number(page_buttons[1].textContent) + 1);
                    page_buttons[2].textContent = String(Number(page_buttons[2].textContent) + 1);
                    page_buttons[3].textContent = String(Number(page_buttons[3].textContent) + 1);
                    openMenu(numPage);
                } else {

                }
            }
            else {
                numPage = openMenu(Number(a.textContent));
            }
        })
    });
    document.querySelector(".menuLink").addEventListener("click", () => {
        numPage = openMenu();
    });
});