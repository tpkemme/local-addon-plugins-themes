<img align="left" src="https://cloud.githubusercontent.com/assets/3424234/23081445/72ca3f7c-f51a-11e6-9859-cf0dcdfb6577.png" width="100" />
# Plugins and Themes Addon for Local By Flywheel
![Travis CI Build Status](https://travis-ci.org/tpkemme/local-addon-plugins-themes.svg?branch=master)
### [Changelog](./CHANGELOG.md)

## Description

Add this addon to Local By Flywheel to see the active and inactive plugins for each site.  This addon currently lists active and inactive themes/plugins.

## Installation

### Installation for Non-Developers

 1. Download the latest release as a zip
 2. Extract contents of zip to desired location
 3. Open Local by Flywheel and go to Settings
 4. Click 'Addons' and 'Install Addon' and choose the location from step 2. 

### Installation for Developers

 1. Clone this repo: `git clone git@github.com:JRGould/local-addon-plugins-themes.git local-addon-plugins-themes`
 2. Run `npm install`
 3. Run initial build: `npm run-script build`
 4. Link into Local's `addon` directory: `ln -s "$(pwd)" ~/Library/Application Support/Local by Flywheel/addons`
 5. Restart Local and activate addon from Settings > Addons

## Notes for Developers

 - To automatically transpile your JS while developing, just start watch task: `npm run-script watch`.
 - The only thing this starter addon currently does is open dev tools in Local and add a `reload()` function to the window object, type `reload()` into the dev tools console after you've saved/transpiled to see your changes.
 - I've noticed that using the symbolic link described in step 4. of the Quick Start can cause ridiculously long loading times.  It's probably easier to develop directory inside the addon folder.


### Installing Dev Dependencies

`npm install`

### Folder Structure

All files in `/src` will be transpiled to `/lib` using [Babel](https://github.com/babel/babel/). Anything in `/lib` will be overwritten.

### Transpiling

`npm run-script build` or `npm run-script watch` to transpile when source files are saved

### Babel, transpiling, ES6, Node.js, what?

Not familiar with some or any of these terms? Here are a few resources to get you up to speed.

- Node.js
  - [The Art of Node](https://github.com/maxogden/art-of-node#the-art-of-node)
- Babel
  - [Babel Introduction](https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/user-handbook.md#toc-introduction)
  - [Source-to-source compiler (Wikipedia)](https://en.wikipedia.org/wiki/Source-to-source_compiler)
- ES6/ES2015
  - [Learn ES2015](https://babeljs.io/docs/learn-es2015/)
  - [JavaScript — Just another introduction to ES6](https://medium.com/sons-of-javascript/javascript-an-introduction-to-es6-1819d0d89a0f#.a11ayxe2p)

## Dev Dependencies

- [babel](https://github.com/babel/babel/tree/master/packages): Turn ES6 code into readable vanilla ES5 with source maps
- [babel-cli](https://github.com/babel/babel/tree/master/packages): Babel command line.
- [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages): Babel preset for all es2015 plugins.
- [babel-preset-react](https://github.com/babel/babel/tree/master/packages): Babel preset for all React plugins.
- [babel-preset-stage-0](https://github.com/babel/babel/tree/master/packages): Babel preset for stage 0 plugins
- [auto-changelog](https://github.com/CookPete/auto-changelog): auto generates a changelog from git tags and commit history

## License

MIT
