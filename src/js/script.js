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
        });
    }
    // page_buttons.forEach(element => {
    //     element.addEventListener("click", () => {
    //
    //         curr.classList.remove("active");
    //         prev = curr;
    //         curr = element;
    //         curr.classList.add("active");
    //         // случаи:
    //         // 1 !2! 3 click << (станет !1! 2 3)
    //         // 1 2 !3! click >> (станет: 2 3 !4!)
    //         // 3 !4! 5 click >> (станет 3 4 !5!) нужно учесть size
    //         if ("«" === curr.textContent) {
    //             numPage--;
    //             openMenu(numPage);
    //
    //         } else if ("»" === curr.textContent) {
    //             curr.classList.remove("active");
    //             if (prev.textContent === page_buttons[3].textContent) {
    //                 page_buttons[1].textContent = String(Number(page_buttons[1].textContent) + 1);
    //                 page_buttons[2].textContent = String(Number(page_buttons[2].textContent) + 1);
    //                 page_buttons[3].textContent = String(Number(page_buttons[3].textContent) + 1);
    //             } else {
    //
    //             }
    //             numPage++;
    //             openMenu(numPage);
    //         }
    //         else {
    //             numPage = openMenu(Number(curr.textContent));
    //         }
    //     });
    // });
    document.querySelector(".menuLink").addEventListener("click", () => {
        numPage = openMenu();
    });
});