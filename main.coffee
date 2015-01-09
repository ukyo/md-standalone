render = require './render.coffee'
require 'normalize.css/normalize.css'
require 'highlight.js/styles/tomorrow-night.css'
require 'font-awesome/css/font-awesome.css'
require './style.css'

# cancel = (e) ->
#   e.preventDefault()
#
# window.addEventListener 'dragenter', cancel
# window.addEventListener 'dragover', cancel
# window.addEventListener 'drop', (e) ->
#   console.log e
#   cancel e
#   file = e.dataTransfer.files[0]
#
#   lastModified = null
#   fn = ->
#     return if lastModified == file.lastModified
#     lastModified = file.lastModified
#     reader = new FileReader
#     reader.readAsText file
#     reader.onloadend = ->
#       document.getElementById('output').innerHTML = render reader.result
#       headings = [].slice.call(document.querySelectorAll('ul.toc > li'), 1).map (el) ->
#         {id: el.id, level: +el.className.match(/heading(\d)/)[1], el}
#       headings.forEach (h, i) ->
#         return if h.level != 2
#         h.el.classList.add 'open'
#         console.log
#         icon = h.el.querySelector 'i'
#         icon.addEventListener 'click', (e) ->
#           rest = headings.slice(i + 1)
#           icon.classList.toggle 'fa-chevron-right'
#           icon.classList.toggle 'fa-chevron-down'
#           rest.some (_h) ->
#             return true if _h.level == h.level
#             _h.el.classList.toggle 'open' if _h.level == h.level + 1
#             return
#   fn()
#   setInterval fn, 1000

document.getElementById('output').innerHTML = render document.getElementById('md').textContent

headings = [].slice.call(document.querySelectorAll('ul.toc > li'), 1).map (el) ->
  {id: el.id, level: +el.className.match(/heading(\d)/)[1], el}

headings.forEach (h, i) ->
  return if h.level != 2
  h.el.classList.add 'open'
  console.log
  icon = h.el.querySelector 'i'
  icon.addEventListener 'click', (e) ->
    rest = headings.slice(i + 1)
    icon.classList.toggle 'fa-chevron-right'
    icon.classList.toggle 'fa-chevron-down'
    rest.some (_h) ->
      return true if _h.level == h.level
      _h.el.classList.toggle 'open' if _h.level == h.level + 1
      return
