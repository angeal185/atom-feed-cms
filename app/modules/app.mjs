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
    tpl.base(win, doc)
  })

  win.onload = null;

}

/*
utils.atom_base({
  title: 'test',
  link: {
    title: ''
    href: 'test link',
    title: 'test link title'
  },

  author: {
    email: 'test email',
    name: 'test name',
    uri: 'test uri'
  },
  contributor: ['c1','c2'],
  entries:[]
})
*/
