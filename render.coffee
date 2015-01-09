marked = require 'marked'
hljs = require 'highlight.js'
renderer = new marked.Renderer
renderer.code = (code, language) ->
  result = switch language
    when undefined, 'yaml'
      hljs.highlightAuto(code).value
    else
      hljs.highlight(language, code).value
  """
  <pre>
    <code class="hljs #{language}">#{result}</code>
  </pre>
  """

headings = []
index = 0

renderer.heading = (text, level) ->
  encoded = encodeURIComponent(text) + ++index
  headings.push {text, level}
  """
  <h#{level}>
    <a name="#{encoded}" href="\##{encoded}" class="anchor"></a>
    #{text}
  </h#{level}>
  """


marked.setOptions
  renderer: renderer
  gfm: true
  tables: true
  breaks: false
  pedantic: false
  sanitize: false
  smartLists: true
  smartypants: false

render = (text) ->
  headings = []
  index = -1
  html = marked text
  toc = headings
  .map ({text, level}, i) ->
    return false if level > 3
    icon = switch level
      when 1, 2 then '<i class="fa fa-chevron-right"></i>'
      else '<i class="fa fa-plus"></i>'
    """
    <li id="$$#{i}" class="heading#{level}">
      #{icon}<a href="\##{encodeURIComponent(text) + i}">#{text}</a>
    </li>
    """
  .filter (x) -> x
  .join ''
  """
  <ul class="toc">#{toc}</ul>
  <div class="mdview">#{html}</div>
  """

module.exports = render
