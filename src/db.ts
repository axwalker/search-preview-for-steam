export enum PREVIEW_MODE {
    ALWAYS_ON,
    HOVER_ONLY,
}


export function getMode(): Promise<PREVIEW_MODE> {
    return new Promise(resolve => {
        chrome.storage.local.get(['mode'], ({mode}) => resolve(mode));
    });
}


export function setMode(mode: PREVIEW_MODE): Promise<void> {
    return new Promise(resolve => {
        chrome.storage.local.set({mode}, () => resolve());
    });
}
