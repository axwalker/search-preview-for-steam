import * as db from './db';
import { Game } from './steam';


const IMAGES_WIDTH = '75%';
const DESCRIPTION_WIDTH = '21%';
const BG_COLOR = '#2a3f5a';
const PADDING = '5px';
const MARGIN_BETWEEN_GAMES = '30px';


export const styles = document.createElement('style');
styles.innerHTML = `
    a:hover + .ssp-container, .ssp-container:hover {
        opacity: 1;
        height: auto;
    }
    .ssp-container {
        background-color: ${BG_COLOR};
        padding: ${PADDING};
        margin-top: -5px;
        margin-bottom: ${MARGIN_BETWEEN_GAMES};
    }
    .ssp-hover-only {
        transition: opacity 0.5s ease-in;
        opacity: 0; 
        height: 0;
        overflow: hidden;
        padding: 0px;
        margin-bottom: 0px;
    }
    .ssp-item {
        vertical-align: top;
        padding: ${PADDING};
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


export function preview(game: Game, mode: db.PREVIEW_MODE): HTMLDivElement {
    let preview = document.createElement('div');
    let screenshots = screenshotImages(game.screenshots);
    let review = reviewScore(game.reviewDescription);
    preview.className = `
        ssp-container
        ${mode === db.PREVIEW_MODE.HOVER_ONLY ? 'ssp-hover-only' : ''}
    `;
    preview.innerHTML = `
        <div class="ssp-item ssp-screenshots">${screenshots}</div>
        <div class="ssp-item ssp-description">
            <p>${game.description}</p>
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
    let pattern = /(\d+)% of the (\d+[\d,]*)/;
    let [, scoreString, count] = reviewDescription.match(pattern);
    let score = parseFloat(scoreString);
    let ratingBracket =
        score >= 75 ? 'positive' :
        score >= 55 ? 'neutral' :
                      'negative';
    return `<p class="muted">
        <span>Recent reviews:</span><br>
        <span class="${ratingBracket}">${score}%</span> (${count})
    </span>`;
}
