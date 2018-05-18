# Dow 30 Grid

A fun little Electron app I built for a friend which displays the current stock prices of the dow 30 companies powered by the [IEX trading API](https://iextrading.com/developer/docs/).

![Look at how exciting these squares are! 😁](https://raw.githubusercontent.com/Autre31415/dow30Grid/master/images/dow30Grid.png "Look how exciting these squares are! 😁")

## Download

- [macOS](https://github.com/Autre31415/dow30Grid/releases/download/v0.1.7/Dow.30.Grid-darwin-x64.zip)
- [Windows 64-bit](https://github.com/Autre31415/dow30Grid/releases/download/v0.1.7/Dow.30.Grid-win32-x64.zip)
- [Linux 64-bit](https://github.com/Autre31415/dow30Grid/releases/download/v0.1.7/Dow.30.Grid-linux-x64.zip)

## Running from source

Be sure to have [Node.js](https://nodejs.org) and [git](https://git-scm.com) installed.

Clone the repo with your favorite git ui or

```
git clone https://github.com/autre31415/dow30Grid
```

Then:

```
cd dow30Grid
npm i
npm start
```

And you're off to the races!

## Build

Builds are constructed with [electron-packager](https://github.com/maxogden/electron-packager) and programmatically zipped with [node-archiver](https://github.com/archiverjs/node-archiver).

Be sure to have [Node.js](https://nodejs.org) and [git](https://git-scm.com) installed.

First, be sure to run:

```
git clone https://github.com/autre31415/dow30Grid
cd dow30Grid
npm i
```

Then:

```
npm run package -- [--mac | --win | --linux]
```

You can leave the OS argument out to package for them all.

