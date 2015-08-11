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
  input: 'paht/to/doc.md',
  stylesheetPath: 'path/to/stylesheet.css',
  level: {
    top: 1,
    bottom: 6
  }
}, function(err, result) {
  // ...
});
```