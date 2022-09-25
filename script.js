function callback(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            turnBgColor(entry.target);
        }
    });
}

let options = {
    root: document.querySelector('#scrollArea'),
    rootMargin: '-50%',
    threshold: 0
}

let observer = new IntersectionObserver(callback, options);

let targets = document.querySelectorAll("article");

targets.forEach(article => {
    observer.observe(article);
});

var BgColorArr = ["#FAFAFA", "#D5927C", "#8697B2", "#728991", "#A2BCC1"]
var ColorArr = ["#666666", "#FAFAFA", "#FAFAFA", "#FAFAFA", "#FAFAFA"]

function turnBgColor(element) {
    let idStr = element.id;
    document.body.style.backgroundColor = BgColorArr[Number(idStr)];
    document.body.style.color = ColorArr[Number(idStr)];
}