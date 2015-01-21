/** @jsx React.DOM */

var React = require('react');
var mdhtml = require('{{&RENDERED_PATH}}');
require('font-awesome/css/font-awesome.css');
require('highlight.js/styles/tomorrow-night.css');
require('{{&STYLESHEET_PATH}}');

var output = document.getElementById('output');
output.innerHTML = mdhtml;
var mousedown = false;
var splitter = document.getElementById('splitter');
var toc = document.getElementById('toc');
splitter.addEventListener('mousedown', () => mousedown = true);
window.addEventListener('mouseup', () => mousedown = false);
window.addEventListener('mousemove', e => {
  if (!mousedown) return;
  e.preventDefault();
  toc.style.width = e.pageX + 'px';
});


function tree(arr) {
  arr = arr.slice();
  var results = [];
  var car = arr[0];
  var level = car.level;
  var cdr = arr.slice(1);
  var subarr = [];
  var subtree = (car, subarr) => {
    var r = {label: car.label, anchor: car.anchor};
    if (subarr.length) {
      r.children = tree(subarr);
    }
    return r;
  }
  cdr.forEach(x => {
    if (x.level === level) {
      results.push(subtree(car, subarr));
      subarr = [];
      car = x;
      return;
    }
    subarr.push(x);
  });
  results.push(subtree(car, subarr));
  return results;
}

var Foo = React.createClass({
  getInitialState() {
    var arr = [].slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    arr = arr.map(x => {
      return {
        level: x.tagName.match('[1-6]')[0],
        label: x.textContent,
        anchor: x.querySelector('a').name
      };
    });
    return {toc: tree(arr)};
  },

  open(x) {
    x.isOpen = true;
    this.forceUpdate();
  },

  toggle(x) {
    x.isOpen = !x.isOpen;
    this.forceUpdate();
  },

  render() {
    var renderTree = toc => {
      return (
        <ul>
        {toc.map(x => {
          return (
            <li>
              {
                x.children ?
                  <a onClick={this.toggle.bind(this, x)}><i className={x.isOpen ? "fa fa-folder-open-o" : "fa fa-folder-o"}></i></a> :
                  <i className="fa fa-file-o"></i>
              }
              <a className={'md-toc ' + (x.isOpen ? 'md-toc-open' : '')} href={'#' + x.anchor} onClick={this.open.bind(this, x)}>{x.label}</a>
              {x.children ? renderTree(x.children) : null}
            </li>
          );
        })}
        </ul>
      );
    }

    return <div>{renderTree(this.state.toc)}</div>;
  }
});


React.render(<Foo/>, document.getElementById('toc'));