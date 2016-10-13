import * as db from './db';
import * as templates from './templates';
import * as util from './util';

const searchResultContainerId = 'search_result_container';


export interface Game {
    description: string;
    reviewDescription: string;
    screenshots: string[];
}


class SteamResult {
    static all(): SteamResult[] {
        const anchors = document.querySelectorAll(`#${searchResultContainerId} > div > a`);
        return [].slice.call(anchors).map(a => new SteamResult(a));
    }

    constructor(private el: HTMLAnchorElement) {}

    async game(): Promise<Game> {
        let html = await util.getHtml(this.el.href);
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
    }

    async appendPreview(mode: db.PREVIEW_MODE): Promise<void> {
        if (this.el.getAttribute('has-gallery')) {
            return;
        }
        this.el.setAttribute('has-gallery', 'true');

        let game = await this.game();
        if (!game) {
            return;
        }
        let container = document.createElement('div');
        this.el.parentNode.insertBefore(container, this.el.nextSibling);
        container.appendChild(this.el);
        container.appendChild(await templates.preview(game, mode));
    }
}


export function appendPreviewToAllGames(mode: db.PREVIEW_MODE): void {
    let appendAllPreviews = () => {
        let steamResults = SteamResult.all();
        steamResults.forEach(sr => sr.appendPreview(mode));
    };
    appendAllPreviews();

    let container = document.getElementById(searchResultContainerId);
    let observer = new WebKitMutationObserver(appendAllPreviews);
    observer.observe(container, { childList: true });
    observer.observe(container.parentNode, { childList: true });
}
