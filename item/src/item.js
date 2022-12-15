// достаем id из url-адреса
// удаляем всё лишнее
// получаем объект с 1 массивом из 1 элемента
// возвращаем из функции только элемент массива

function parseGetParams() {
    var query = location.search.substr(1);
    if (query === "") {
        return "";
    } else {
        var params = query.split("&");
        var result = {};
        for (var i = 0; i < params.length; i++) {
            var item = params[i].split("=");

            const key = item[0].replace(/\[|\]/g, '')
            const value = item[1].toLowerCase();

            if (!result[key]) result[key] = [value]
            else result[key].push(value)

        }
        return result.id[0];
    }
}

// mealId - получившийся id из верхней функции
// вбиваем его в запрос на сервер
// с целью получить по id остальную информацию о блюде
async function getMealId(mealId) {

    const linkToDish = "https://food-delivery.kreosoft.ru/api/dish/";
    const response = await fetch(`${linkToDish}${mealId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    return await response.json();

}

// результат функции parseGetParams() (чистый id)
var mealId = parseGetParams();

// выполняем обращение к серверу 
let getMealIdPromise = new Promise(function (resolve) {
    resolve(getMealId(mealId));
});

// в случае успеха выполняем следующий код:
getMealIdPromise.then(function (mealInfo) {
    let mealImage = document.querySelector(".meal-image");
    let mealTitle = document.querySelector(".meal-title");
    let mealCategory = document.querySelector(".meal-category");
    let mealVeg = document.querySelector(".veg-boolean");
    let mealRating = document.querySelector(".meal-rating");
    let mealText = document.querySelector(".meal-text");
    let mealPrice = document.querySelector(".meal-price");

    mealImage.src = mealInfo.image;
    mealTitle.textContent = mealInfo.name;
    mealCategory.textContent = mealInfo.category;
    mealRating.textContent = Math.round(mealInfo.rating);
    mealText.textContent = mealInfo.description;
    mealPrice.textContent = mealInfo.price;

    if (mealInfo.vegetarian) {
        mealVeg.textContent = "Вегетарианское";
    } else {
        mealVeg.textContent = "Не вегетарианское";
    }
});