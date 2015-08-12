## install

```
npm install -g md-standalone
```

## usage

```
mdst foo.md > doc.html
```

## help

```
mdst -h
Usage: mdst [options] path/to/doc.md

Options:
  -s, --style   Stylesheet path(css, scss or less).  [default: "/path/to/md-standalone/lib/style/style.scss"]
  -o, --output  Output path(default STDOUT).
  -l, --level   Headings level                       [default: "1-6"]
  -c, --code    Code Theme                           [default: "tomorrow-night-eighties"]
  -m, --minify  Minify
  -t, --toc     Toc Tree
  -j, --js      Js Path                              [default: "/path/to/md-standalone/lib/defaultRenderer.js"]
```

## API

local install

```
npm install md-standalone
```

usage

```js
var mdst = require('md-standalone');

mdst({
  mdPath: 'paht/to/doc.md',
  jsPath: 'path/to/renderer.js',
  styleSheetPath: 'path/to/stylesheet.css',
  codeTheme: 'tomorrow-night-eighties',
  toc: true,
  minify: true,
  level: {
    top: 1,
    bottom: 6
  }
}, function(err, result) {
  // ...
});
```

## Custom Renderer

```
mdst foo.md > doc.html --js path/to/renderer.js
```

example

```js
var html = require('mdHelper').getHtml();
var options = require('options');
var tocHelper = require('tocHelper');

module.exports = function() {
	document.body.innerHTML = '<div id="md">' +html + '</div>';
	document.title = '（＾ω＾ ≡ ＾ω＾）おっおっおっ';

  console.log(options);
  var tocTree = tocHelper.getTocTree();
  console.log(tocTree);
  var tocTree2 = tocHelper.trimTocTree(tocTree, 2, 3);
  console.log(tocTree, tocTree2);
  console.log(tocHelper.renderTocTree(tocTree2));
};
```

### Helper modules

A custom renderer can use some helpers.

#### mdHelper

##### mdHelper.getHtml()

return a rendered markdown file.

#### tocHelper

##### tocHelper.getTocTree()

return a toc tree as json.

```js
[
  {
    heading: {level: 1, text: foo, anchor: foo},
    children: [...]
  },
  ...
]
```

##### tocHelper.trimTocTree(tocTree, top, bottom)

trim a toc tree.

```js
// generate a toc tree range of h2-h4
tocHelper.trimTocTree(tocTree, 2, 4)
```

##### tocHelper.renderTocTree(tocTree)

render a html string from a toc tree.

#### options

parts of cli options.

```js
{
  toc: true,
  level: {
    top: 1,
    bottom: 6
  },
  codeTheme: 'tomorrow-night-eighties'
}
```