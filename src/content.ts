import * as db from './db';
import * as steam from './steam';
import * as template from './templates';


(async () => {
    document.head.appendChild(template.styles);
    steam.appendPreviewToAllGames(await db.getMode());
})();
