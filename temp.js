// sendToBasket[i].addEventListener("click", () => {
//     let basketPromise = new Promise(function (resolve) {
//         resolve(sendData(menuPage.dishes[i].id));
//     });
//     basketPromise.then(function (response) {
//         console.log(response);
//     });
// });

// async function sendData(dishId) {
//     const linkToBasket = "https://food-delivery.kreosoft.ru/api/basket/dish/";
//     const response = await fetch(`${linkToBasket}${dishId}`, {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         method: 'POST',
//         body: (JSON.stringify(dishId)),
//     });
//     return response.json();
// };