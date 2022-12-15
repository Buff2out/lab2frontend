var a = document.querySelector(".btn-success");
var b = document.querySelector("h1");

b.addEventListener("click", () => {
    setTimeout(() => {
        a.classList.toggle("visually-hidden");
    }, 100);

    setTimeout(() => {
        a.classList.toggle("visually-hidden");
    }, 3100);

});