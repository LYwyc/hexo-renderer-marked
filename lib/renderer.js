var marked = require('marked');
var _ = require('lodash');
var stripIndent = require('strip-indent');
var util = require('hexo-util');
var highlight = util.highlight;
var stripHTML = util.format.stripHTML;
var MarkedRenderer = marked.Renderer;

function Renderer(){
  MarkedRenderer.apply(this, arguments);

  this._headingId = {};
}

require('util').inherits(Renderer, MarkedRenderer);

// Add id attribute to headings
Renderer.prototype.heading = function(text, level){
  var id = anchorId(stripHTML(text));
  var headingId = this._headingId;

  // Add a number after id if repeated
  if (headingId[id]){
    id += '-' + headingId[id]++;
  } else {
    headingId[id] = 1;
  }

  return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>';
};

function anchorId(str){
  return str
    .replace(/\s+/g, '_')
    .replace(/\./g, '-')
    .replace(/-{2,}/g, '-');
}

marked.setOptions({
  langPrefix: '',
  highlight: function(code, lang){
    return highlight(stripIndent(code), {
      lang: lang,
      gutter: false,
      wrap: false
    });
  }
});

module.exports = function(data, options){
  return marked(data.text, _.extend({
    renderer: new Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true
  }, this.config.marked, options));
};