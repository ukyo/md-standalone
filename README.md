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