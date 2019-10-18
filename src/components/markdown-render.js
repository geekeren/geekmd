import * as MarkdownIt from 'markdown-it';
import { highlightAuto } from 'highlight.js';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
// 上标
import sup from 'markdown-it-sup';
// <dl/>
import deflist from 'markdown-it-deflist';
// <abbr/>
import abbr from 'markdown-it-abbr';
// footnote
import footnote from 'markdown-it-footnote';
// insert 带有下划线 样式 ++ ++
// import insert from 'markdown-it-ins';
// mark
import mark from 'markdown-it-mark';
// taskLists
import taskLists from 'markdown-it-task-lists';
import toc from 'markdown-it-toc';
import imagePreview from 'markdown-it-images-preview';
import implicitFigures from '@geekeren/markdown-it-implicit-figures';

const markdownRender = MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  langPrefix: 'language-',
  linkify: true,
  typographer: true,
  highlight: code => highlightAuto(code).value,

});

markdownRender.use(emoji)
  .use(sup)
  .use(sub)
  .use(deflist)
  .use(abbr)
  .use(footnote)
  // .use(insert)
  .use(mark)
  .use(taskLists)
  .use(imagePreview)
  .use(implicitFigures, {
    dataType: false,
    figcaption: true,
    tabindex: false,
    link: true,
    figcaption_open: "div class='figcaption'",
    figure_open: "div class='figure'",
    figcaption_close: 'div',
    figure_close: 'div',
  })
  .use(toc);
markdownRender.renderer.rules.table_open = function () {
  return '<table class="table">';
};
export default markdownRender;
