

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
    }
    document.querySelector(".menuLink").addEventListener("click", () =>{
        openMenu();
    });
});