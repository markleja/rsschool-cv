(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function rippleEffect() {
        document.addEventListener("click", (function(e) {
            const targetItem = e.target;
            if (targetItem.closest("[data-ripple]")) {
                const button = targetItem.closest("[data-ripple]");
                const ripple = document.createElement("span");
                const diameter = Math.max(button.clientWidth, button.clientHeight);
                const radius = diameter / 2;
                ripple.style.width = ripple.style.height = `${diameter}px`;
                ripple.style.left = `${e.pageX - (button.getBoundingClientRect().left + scrollX) - radius}px`;
                ripple.style.top = `${e.pageY - (button.getBoundingClientRect().top + scrollY) - radius}px`;
                ripple.classList.add("ripple");
                "once" === button.dataset.ripple && button.querySelector(".ripple") ? button.querySelector(".ripple").remove() : null;
                button.appendChild(ripple);
                const timeOut = getAnimationDuration(ripple);
                setTimeout((() => {
                    ripple ? ripple.remove() : null;
                }), timeOut);
                function getAnimationDuration() {
                    const aDuration = window.getComputedStyle(ripple).animationDuration;
                    return aDuration.includes("ms") ? aDuration.replace("ms", "") : 1e3 * aDuration.replace("s", "");
                }
            }
        }));
    }
    let addWindowScrollEvent = false;
    function stickyBlock() {
        addWindowScrollEvent = true;
        function stickyBlockInit() {
            const stickyParents = document.querySelectorAll("[data-sticky]");
            if (stickyParents.length) stickyParents.forEach((stickyParent => {
                let stickyConfig = {
                    media: stickyParent.dataset.sticky ? parseInt(stickyParent.dataset.sticky) : null,
                    top: stickyParent.dataset.stickyTop ? parseInt(stickyParent.dataset.stickyTop) : 0,
                    bottom: stickyParent.dataset.stickyBottom ? parseInt(stickyParent.dataset.stickyBottom) : 0,
                    header: stickyParent.hasAttribute("data-sticky-header") ? document.querySelector("header.header").offsetHeight : 0
                };
                stickyBlockItem(stickyParent, stickyConfig);
            }));
        }
        function stickyBlockItem(stickyParent, stickyConfig) {
            const stickyBlockItem = stickyParent.querySelector("[data-sticky-item]");
            const headerHeight = stickyConfig.header;
            const offsetTop = headerHeight + stickyConfig.top;
            const startPoint = stickyBlockItem.getBoundingClientRect().top + scrollY - offsetTop;
            document.addEventListener("windowScroll", stickyBlockActions);
            function stickyBlockActions(e) {
                const endPoint = stickyParent.offsetHeight + stickyParent.getBoundingClientRect().top + scrollY - (offsetTop + stickyBlockItem.offsetHeight + stickyConfig.bottom);
                let stickyItemValues = {
                    position: "relative",
                    bottom: "auto",
                    top: "0px",
                    left: "0px",
                    width: "auto"
                };
                if (!stickyConfig.media || stickyConfig.media < window.innerWidth) if (offsetTop + stickyConfig.bottom + stickyBlockItem.offsetHeight < window.innerHeight) if (scrollY >= startPoint && scrollY <= endPoint) {
                    stickyItemValues.position = `fixed`;
                    stickyItemValues.bottom = `auto`;
                    stickyItemValues.top = `${offsetTop}px`;
                    stickyItemValues.left = `${stickyBlockItem.getBoundingClientRect().left}px`;
                    stickyItemValues.width = `${stickyBlockItem.offsetWidth}px`;
                } else if (scrollY >= endPoint) {
                    stickyItemValues.position = `absolute`;
                    stickyItemValues.bottom = `${stickyConfig.bottom}px`;
                    stickyItemValues.top = `auto`;
                    stickyItemValues.left = `0px`;
                    stickyItemValues.width = `${stickyBlockItem.offsetWidth}px`;
                }
                stickyBlockType(stickyBlockItem, stickyItemValues);
            }
        }
        function stickyBlockType(stickyBlockItem, stickyItemValues) {
            stickyBlockItem.style.cssText = `position:${stickyItemValues.position};bottom:${stickyItemValues.bottom};top:${stickyItemValues.top};left:${stickyItemValues.left};width:${stickyItemValues.width};`;
        }
        stickyBlockInit();
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window["FLS"] = true;
    isWebp();
    menuInit();
    rippleEffect();
    stickyBlock();
})();