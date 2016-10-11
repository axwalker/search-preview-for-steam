const SEARCH_RESULT_CONTAINER = 'search_result_container';

class GameContainer {
    constructor(private el: HTMLAnchorElement) {}

    static appendPreviewToAllGames(): void {
        let appendAllPreviews = () => {
            let games = GameContainer.gamesFromPage();
            games.forEach(g => g.appendPreview());
        };
        appendAllPreviews();

        let container = document.getElementById(`${SEARCH_RESULT_CONTAINER}`);
        let observer = new WebKitMutationObserver(appendAllPreviews);
        observer.observe(container, { childList: true });
        observer.observe(container.parentNode, { childList: true });
    }

    static gamesFromPage(): GameContainer[] {
        let anchors = document.querySelectorAll(`#${SEARCH_RESULT_CONTAINER} > div > a`);
        return [].slice.call(anchors).map(el => new GameContainer(el));
    }

    appendPreview() {
        if (this.el.getAttribute('has-gallery')) {
            return;
        }
        this.el.setAttribute('has-gallery', 'true');

        return this.getGameDetails().then(details => {
            if (!details) {
                return;
            }
            this.el.parentNode.insertBefore(preview(details), this.el.nextSibling);
        });
    }

    getGameDetails(): Promise<GameDetails> {
        return getHtml(this.el.href).then(html => {
            let container = document.createElement('div');
            container.innerHTML = html;
            let descriptionContainer = container.querySelector('.game_description_snippet');
            if (!descriptionContainer) {
                return;
            }
            let description = descriptionContainer.textContent.trim();
            let reviewDescription = container.querySelector('.responsive_reviewdesc').textContent.trim();
            let images = container.querySelectorAll('.highlight_strip_screenshot > img');
            let screenshots = [].slice.call(images).map(img => img.src);
            return { description, reviewDescription, screenshots };
        });
    }
}

interface GameDetails {
    description: string;
    reviewDescription: string;
    screenshots: string[];
}


/* TEMPLATES */
const IMAGES_WIDTH = '75%';
const DESCRIPTION_WIDTH = '21%';
const BG_COLOR = '#2a3f5a';
const PADDING = '5px';
const MARGIN_BETWEEN_GAMES = '30px';

let styles = document.createElement('style');
styles.innerHTML = `
    .ssp-container {
        background-color: ${BG_COLOR};
        padding: ${PADDING};
        margin-top: -5px;
        margin-bottom: ${MARGIN_BETWEEN_GAMES};
    }
    .ssp-item {
        vertical-align: top;
        padding: 5px;
        display: inline-block;
    }
    .ssp-screenshots {
        width: ${IMAGES_WIDTH};
    }
    .ssp-description {
        width: ${DESCRIPTION_WIDTH};
    }
    .muted { color: #aaa; }
    .positive { color: #90EE90; }
    .neutral { color: #FFA500; }
    .negative { color: #FF5050; }
`;
document.head.appendChild(styles);

function preview(details: GameDetails) {
    let preview = document.createElement('div');
    let screenshots = screenshotImages(details.screenshots);
    let review = reviewScore(details.reviewDescription);
    preview.className = 'ssp-container';
    preview.innerHTML = `
        <div class="ssp-item ssp-screenshots">${screenshots}</div>
        <div class="ssp-item ssp-description">
            <p>${details.description}</p>
            <br>
            ${review}
        </div>
    `;
    return preview;
}

function screenshotImages(srcs: string[]): string {
    return srcs.map(s => `<img src=${s}>`).join(' ');
}

function reviewScore(reviewDescription: string): string {
    let [_, scoreString, count] = reviewDescription.match(/(\d+)% of the (\d+[\d,]*)/);
    let score = parseFloat(scoreString);
    let ratingBracket =
        score >= 75 ? 'positive' :
        score >= 55 ? 'neutral' :
        'negative';
    return `<p class="muted">
        <span class="${ratingBracket}">${score}%</span> (${count})
    </p>`;
}


/* UTIL */
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


/* TS DECLARATIONS */
declare var WebKitMutationObserver: any;


/* MAIN */
GameContainer.appendPreviewToAllGames();
