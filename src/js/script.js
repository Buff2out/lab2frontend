

document.addEventListener('DOMContentLoaded', () => {
    var x = new XMLHttpRequest();
    const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
    var numPage = 2;
    x.open("GET", `${linkToDish}?page=${numPage}`, true);
    x.onload = function () {
        const page = JSON.parse(x.responseText);
        console.log(page.dishes)
        console.log(page.pagination)
    }
    x.send(null);
});