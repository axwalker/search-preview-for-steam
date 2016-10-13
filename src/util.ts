export function getHtml(url): Promise<string> {
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


export class Signal<T> {
    handlers: ((T) => any)[] = [];

    add(f: (t: T) => any) {
        this.handlers.push(f);
    }

    dispatch(t?: T) {
        return Promise.all(this.handlers.map(f => Promise.resolve(f(t))));
    }
}
