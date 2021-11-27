const el = document.getElementById("logoutA");
el.addEventListener("click", () => {
    confirm("Ви дійсно хочете вийти з акаунту?") ?
        fetch("http://localhost:8082/auth/login/logout", {method: "POST"}) : ''; /* location.href = window.location.href;:*/
        
});