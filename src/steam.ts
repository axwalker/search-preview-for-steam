import * as db from './db';
import * as templates from './templates';
import * as util from './util';

const searchResultContainerId = 'search_result_container';


export interface Game {
    description: string;
    reviewDescription: string;
    screenshots: string[];
}


interface GameAnchorElement extends HTMLAnchorElement {
    previewAdded?: boolean;
    hasUngettableHref?: boolean;
}


export class SteamResult {
    static newResults: util.Signal<any> = new util.Signal<any>();

    static all(): SteamResult[] {
        const anchors = document.querySelectorAll(`#${searchResultContainerId} > div > a`);
        return [].slice.call(anchors).map(a => new SteamResult(a));
    }

    static listenForNewResults() {
        let container = document.getElementById(searchResultContainerId);
        let observer = new WebKitMutationObserver(() => this.newResults.dispatch());
        observer.observe(container, { childList: true });
        observer.observe(container.parentNode, { childList: true });
    }

    static appendPreviewToAll(mode: db.PREVIEW_MODE) {
        let steamResults = SteamResult.all();
        steamResults.forEach(sr => sr.appendPreview(mode));
    }

    constructor(private el: GameAnchorElement) {}

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
        let doesNotNeedPreview = this.el.hasUngettableHref || this.hasPreview();
        if (doesNotNeedPreview) {
            return;
        }

        let game = await this.game();
        if (!game) {
            this.el.hasUngettableHref = true;
            return;
        }
        let preview = await templates.preview(game, mode);
        this.el.parentNode.insertBefore(preview, this.el.nextSibling);
        this.el.previewAdded = true;
    }

    hasPreview() {
        return this.el.previewAdded && (<HTMLElement>this.el.nextSibling).tagName === 'DIV';
    }
}
