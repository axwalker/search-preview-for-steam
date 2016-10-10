const SEARCH_RESULT_CONTAINER = 'search_result_container';


class Game {
    constructor(el) {
        this.el = el;
    }

    static appendScreenshotsToAllGames(listenForNewGames) {
        let games = Game.gamesFromPage();
        games.forEach(g => g.appendScreenshots());

        if (!listenForNewGames) {
            return;
        }

        let observer = new WebKitMutationObserver(() => {
            let games = Game.gamesFromPage();
            games.forEach(g => g.appendScreenshots());
        });

        observer.observe(document.getElementById(`${SEARCH_RESULT_CONTAINER}`), { childList: true });
    }

    static gamesFromPage() {
        let gameAnchors = document.querySelectorAll(`#${SEARCH_RESULT_CONTAINER} > div > a`);
        let games = [];
        gameAnchors.forEach(el => games.push(new Game(el)));
        return games;
    }

    getScreenshots() {
        return new Promise(resolve => {
            $.get(this.el.href, data => {
                let container = document.createElement('div');
                container.innerHTML = data;
                let images = container.querySelectorAll('.highlight_strip_screenshot > img');
                let screens = [];
                images.forEach(img => screens.push(img.src));
                resolve(screens);
            });
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
            images.style.background = '#465668';
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


let andListenForNewGames = true;
Game.appendScreenshotsToAllGames(andListenForNewGames);
