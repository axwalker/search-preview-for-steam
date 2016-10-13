import * as db from './db';
import { SteamResult } from './steam';
import * as template from './templates';


(async () => {
    document.head.appendChild(template.styles);
    let mode = await db.getMode();
    SteamResult.appendPreviewToAll(mode);
    SteamResult.newResults.add(() => SteamResult.appendPreviewToAll(mode));
    SteamResult.listenForNewResults();
})();
