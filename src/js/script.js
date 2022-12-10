var page_buttons = document.querySelectorAll(".page-link");

var a = page_buttons[1];

page_buttons.forEach(element => {

    element.addEventListener("click", () => {
        a.classList.remove("active");
        a = element;
        a.classList.add("active");
    })

});