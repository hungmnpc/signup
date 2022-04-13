const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const toggleVisible = $('.toggle-visible');
const passWordField = $('.form-control[name="password"]');


toggleVisible.onclick = function() {
    toggleIconPassword();
}

function toggleIconPassword() {
    const type = passWordField.getAttribute("type") === "password" ? "text" : "password";
    passWordField.setAttribute("type", type);
    toggleVisible.classList.toggle('fa-eye-slash');
}