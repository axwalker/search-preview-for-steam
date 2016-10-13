enum MODE {
    ALWAYS_ON,
    HOVER_ONLY,
}

let alwaysRadio: HTMLInputElement = <HTMLInputElement>document.querySelector('input[value="always-on"]');
let hoverRadio: HTMLInputElement = <HTMLInputElement>document.querySelector('input[value="hover-only"]');

chrome.storage.sync.get(['mode'], ({mode}) => {
    if (mode === MODE.HOVER_ONLY) {
        hoverRadio.checked = true;
    } else {
        alwaysRadio.checked = true;
    }
});

alwaysRadio.onclick = () => setMode(MODE.ALWAYS_ON);
hoverRadio.onclick = () => setMode(MODE.HOVER_ONLY);


function setMode(mode: MODE) {
    chrome.storage.sync.set({mode});
}

declare var chrome: any;
