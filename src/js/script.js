var x = new XMLHttpRequest();
x.open("GET", "https://food-delivery.kreosoft.ru/api/dish", true);
x.onload = function () {
    alert(x.responseText);
}
x.send(null);