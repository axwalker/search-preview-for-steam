const SEARCH_RESULT_CONTAINER = 'search_result_container';


class Game {
    constructor(el) {
        this.el = el;
    }

    static appendScreenshotsToAllGames(listenForNewGames) {
        let appendScreenshots = () => {
            let games = Game.gamesFromPage();
            games.forEach(g => g.appendScreenshots());
        };
        appendScreenshots();

        if (!listenForNewGames) {
            return;
        }

        let container = document.getElementById(`${SEARCH_RESULT_CONTAINER}`);
        let observer = new WebKitMutationObserver(appendScreenshots);
        observer.observe(container, { childList: true });
        observer.observe(container.parentNode, { childList: true });

    }

    static gamesFromPage() {
        let gameAnchors = document.querySelectorAll(`#${SEARCH_RESULT_CONTAINER} > div > a`);
        let games = [];
        gameAnchors.forEach(el => games.push(new Game(el)));
        return games;
    }

    getScreenshots() {
        return getHtml(this.el.href).then(html => {
            let container = document.createElement('div');
            container.innerHTML = html;
            let images = container.querySelectorAll('.highlight_strip_screenshot > img');
            let screens = [];
            images.forEach(img => screens.push(img.src));
            return screens;
        });
    }

    appendScreenshots() {
        if (this.el.getAttribute('has-gallery')) {
            return;
        }

        return this.getScreenshots().then(srcs => {
            if (!srcs) {
                return;
            }
            let images = document.createElement('div');
            images.style.background = '#2a3f5a';
            images.style.margin = '10px';
            images.style.marginBottom = '30px';
            images.innerHTML = srcs
                .map(s => `<img src=${s}>`)
                .join(' ');
            this.el.parentNode.insertBefore(images, this.el.nextSibling);
            this.el.setAttribute('has-gallery', 'true');
        });
    }
}


function getHtml(url) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState !== 4 || xmlHttp.status !== 200) {
                return;
            }
            resolve(xmlHttp.responseText);
        };
        xmlHttp.open('GET', url, true);
        xmlHttp.send(null);
    });
}


let andListenForNewGames = true;
Game.appendScreenshotsToAllGames(andListenForNewGames);
