



let result = new Promise((resolve) => {
    const pizdec = JSON.parse(testFunc());
    console.log(pizdec)

});

console.log(testFunc)


async function testFunc() {

    const linkToDishId = "https://food-delivery.kreosoft.ru/api/dish/";
    const response = await fetch(`${linkToDishId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }

    });

    return await response.json();
}