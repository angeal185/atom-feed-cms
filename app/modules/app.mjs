window.js = JSON.stringify;
window.jp = JSON.parse;
window.cl = console.log;
window.ce = console.error;

import { config } from './config.mjs';
import { h } from './h.mjs';
import { utils } from './utils.mjs';
import { tpl } from "./tpl.mjs";


window.onload = function(){
  let win = window,
  doc = document;
  utils.pre(doc, win, function(err){
    if(err){return ce(err)}
    tpl.base(win, doc);
    doc.scripts[0].remove();
    win.onload = null;
  })
}
