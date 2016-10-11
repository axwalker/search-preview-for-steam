declare var WebKitMutationObserver: any;


const SEARCH_RESULT_CONTAINER = 'search_result_container';


class GameContainer {
    el: HTMLAnchorElement;

    constructor(el) {
        this.el = el;
    }

    static appendScreenshotsToAllGames() {
        let appendScreenshots = () => {
            let games = GameContainer.gamesFromPage();
            games.forEach(g => g.appendScreenshots());
        };
        appendScreenshots();

        let container = document.getElementById(`${SEARCH_RESULT_CONTAINER}`);
        let observer = new WebKitMutationObserver(appendScreenshots);
        observer.observe(container, { childList: true });
        observer.observe(container.parentNode, { childList: true });
    }

    static gamesFromPage(): GameContainer[] {
        let anchors = document.querySelectorAll(`#${SEARCH_RESULT_CONTAINER} > div > a`);
        return [].slice.call(anchors).map(el => new GameContainer(el));
    }

    getScreenshots() {
        return getHtml(this.el.href).then(html => {
            let container = document.createElement('div');
            container.innerHTML = html;
            let images = container.querySelectorAll('.highlight_strip_screenshot > img');
            return [].slice.call(images).map(img => img.src);
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


function getHtml(url): Promise<string> {
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


GameContainer.appendScreenshotsToAllGames();
