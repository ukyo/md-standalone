module.exports = function(html) {
  document.body.innerHTML = '<div id="md">' +html + '</div>';
  document.title = document.querySelector('h1,h2,h3,h4,h5,h6').textContent;
};
