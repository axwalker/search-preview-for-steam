import * as db from './db';


(async () => {
    let alwaysRadio = <HTMLInputElement>document.querySelector('input[value="always-on"]');
    let hoverRadio = <HTMLInputElement>document.querySelector('input[value="hover-only"]');

    alwaysRadio.onclick = () => db.setMode(db.PREVIEW_MODE.ALWAYS_ON);
    hoverRadio.onclick = () => db.setMode(db.PREVIEW_MODE.HOVER_ONLY);

    let mode = await db.getMode();
    if (mode === db.PREVIEW_MODE.HOVER_ONLY) {
        hoverRadio.checked = true;
    } else {
        alwaysRadio.checked = true;
    }
})();
