(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const translate = document.querySelectorAll(".translate");
    window.addEventListener("scroll", (() => {
        let scroll = window.pageYOffset;
        translate.forEach((element => {
            let speed = element.dataset.speed;
            element.style.transform = `translateY(${scroll * speed}px)`;
        }));
    }));
    const mainTextBlock = document.querySelector(".wrapper-header");
    const infoBlock = document.querySelector(".info");
    if (window.matchMedia("(max-width: 767.98px)").matches) infoBlock.before(mainTextBlock);
    window["FLS"] = true;
    isWebp();
})();