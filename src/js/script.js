

document.addEventListener('DOMContentLoaded', () => {
    var x = new XMLHttpRequest();
    const linkToDish = "https://food-delivery.kreosoft.ru/api/dish";
    x.open("GET", `${linkToDish}`, true);
    x.onload = function () {
        const page = JSON.parse(x.responseText);
        console.log(page.dishes)
        console.log(page.pagination)
    }
    x.send(null);
});