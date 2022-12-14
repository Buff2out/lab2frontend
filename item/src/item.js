// парсим получившуюся часть url (id блюда)
function parseGetParams() {
    var query = location.search.substr(1);
    if (query === "") {
        return "";
    } else {
        console.log("query");
        console.log(query);
        var params = query.split("&");
        console.log("params");
        console.log(params);
        var result = {};
        for (var i = 0; i < params.length; i++) {
            var item = params[i].split("=");

            const key = item[0].replace(/\[|\]/g, '')
            const value = item[1].toLowerCase();

            if (!result[key]) result[key] = [value]
            else result[key].push(value)

        }
        console.log("result");
        console.log(result);
        return result.id[0];
    }
}

// Обращаемся к серверу (где query - id блюда)
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


var mealId = parseGetParams();
console.log(mealId);



let getMealIdPromise = new Promise(function (resolve) {
    resolve(getMealId(mealId));
});

getMealIdPromise.then(function (value) {
    console.log(value);
});