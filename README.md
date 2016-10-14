View screenshots for games within the Steam search page with this browser extension.

# Install

[Chrome Web Store](https://chrome.google.com/webstore/developer/edit/nlhhngcbflcbkhnljkcmagnfkeinngnh);
Firefox - Coming soon
Opera - coming soon

![screenshot](/examples/screenshot.png?raw=true)

## Known issues

- Does not currently work for games requiring an age check.


## Coming soon

- Game videos included in preview.


# Building from source

## Setup

`npm install`

## Build

`npm run build`

Then you can load the unpacked extension that is in the newly created `build` directory.

Alternatively, use `npm run watch` if you want this build to run any time file changes are detected.

## Deploy

`npm run package`

Produces a zip file that can be uploaded to Chrome, Firefox or Opera.