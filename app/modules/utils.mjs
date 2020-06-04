import { h } from './h.mjs';
import { tpl } from './tpl.mjs';
import { config } from './config.mjs';
import { ls,ss } from "./storage.mjs";
import { cnsl } from './cnsl.mjs';

const utils = {
  uuid: function() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c){
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    });
  },
  pre: function(doc, win, cb){

    utils.fetchJSON('./app/data/fonts.json', function(err,res){
      if(err){return cb(err)}

      for (let i = 0; i < res.length; i++) {
        utils.add_font(res[i], doc);
      }
      cb(false)
      /*
      utils.add_styles(doc, 'main', function(){
        cb(false)
      });
      */
    })
  },
  decode_64: function(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  },
  add_font: function(obj, doc){

    let buff = utils.decode_64(obj.data).buffer;
    new FontFace(obj.name, buff, {
      style: obj.style,
      weight: obj.weight
    }).load().then(function(res) {
      doc.fonts.add(res);
    }).catch(function(err) {
      cnsl(['[task:fonts] ', obj.name +' failed to load.'], ['red','cyan']);
    });
  },
  shuffle: function(arr) {
    return arr.sort(() => Math.random() - 0.5);
  },
  fetchJSON: function(url, cb){

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    })
    .then(function(res){
      if (res.status >= 200 && res.status < 300) {
        //let auth = res.headers.get('Digest').slice(9);
        res.json().then(function(data) {
          cb(false,data)
        });
      } else {
        return Promise.reject(new Error(res.statusText))
      }
    })
    .catch(function(err){
      cb(err)
    })
  },
  fix_date: function(i){
    return i.replace('T', ' ').split('.')[0];
  },
  emptySync: function(i){
    while (i.firstChild) {
      i.removeChild(i.firstChild);
    }
  },
  empty: function(i, cb){
    while (i.firstChild) {
      i.removeChild(i.firstChild);
    }
    cb()
  },
  totop: function(i){
    window.scroll({
      top: i,
      left: 0,
      behavior: 'smooth'
    });
  },
  toast: function(i, msg){
    const toast = h('div#toast.alert.alert-'+ i, {
        role: "alert"
    }, msg);
    document.body.append(toast);
    setTimeout(function(){
      toast.classList.add('fadeout');
      setTimeout(function(){
        toast.remove();
      },1000)
    },3000)
    return;
  },
  date2ts: function(x){
    return Date.parse(x);
  },
  format_date: function(i){
    let date = new Date(i),
    dd = date.getDate(),
    mm = date.getMonth()+1,
    yyyy = date.getFullYear();

    if(dd < 10){
      dd = '0' + dd
    }

    if(mm < 10){
      mm = '0' + mm
    };

    return [yyyy, mm, dd].join('-')
  },
  get_time: function(){
    return new Date().toTimeString().split(' ')[0];
  },
  get_year: function(){
    let d = new Date();
    return d.getFullYear();
  },
  debounce: function(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  },
  capitalize: function(str) {
   try {
     let x = str[0] || str.charAt(0);
     return x  ? x.toUpperCase() + str.substr(1) : '';
   } catch (err) {
     if(err){return str;}
   }
  },
  formatBytes: function(bytes, decimals) {
    if (bytes === 0){
      return '0 Bytes';
    }
    const k = 1024,
    dm = decimals < 0 ? 0 : decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
  snake_case: function(str){
    try {
      return str.replace(/ /g, '_');
    } catch (err) {
      if(err){return str;}
    }
  },
  un_snake_case: function(str){
    try {
      return str.replace(/_/g, ' ');
    } catch (err) {
      if(err){return str;}
    }
  },
  atom_base(obj){

    let base = '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">'

    let arr = ['title', 'subtitle', 'icon', 'logo', 'updated', 'id', 'generator', 'rights']

    for (let i = 0; i < arr.length; i++) {
      if(obj[arr[i]] && obj[arr[i]] !== ''){
        base += '<'+ arr[i] +'>'+ obj[arr[i]] +'</'+ arr[i] +'>'
      }
    }

    // build link
    if(obj.link.href !== ''){
      let lnk = '<link ';
      if(obj.link.rel !== ''){
        lnk += 'rel="'+ obj.link.rel +'" ';
      }

      if(obj.link.title && obj.link.title !== ''){
        lnk += 'title="'+ obj.link.title +'" ';
      }

      if(obj.link.hreflang !== ''){
        lnk += 'hreflang="'+ obj.link.hreflang +'" ';
      }

      if(obj.link.type !== ''){
        lnk += 'type="'+ obj.link.type +'" ';
      }

      lnk += 'href="'+ obj.link.href +'" />';

      base += lnk;
      lnk = null;
    }

    // build category
    if(obj.category.term !== ''){
      let cat = '<category ';

      if(obj.category.label !== ''){
        cat += 'title="'+ obj.category.label +'" ';
      }

      if(obj.category.scheme !== ''){
        cat += 'scheme="'+ obj.category.scheme +'" ';
      }

      cat += 'term="'+ obj.category.term +'" />';

      base += cat;
      cat = null;
    }

    if(obj.author.name !== '' || obj.author.email !== '' || obj.author.uri !== ''){
      base += '<author>'
      for (let i in obj.author) {
        if(obj.author[i] !== ''){
          base += '<'+ i +'>'+ obj.author[i] +'</'+ i +'>'
        }
      }
      base += '</author>'
    }

    if(obj.contributor.length > 0 && obj.contributor[0] !== ''){
      base += '<contributor>'
      for (let i = 0; i < obj.contributor.length; i++) {
        if(obj.contributor[i] !== ''){
          base += '<name>'+ obj.contributor[i] +'</name>'
        }
      }
      base += '</contributor>'
    }

    for (let i = 0; i < obj.entries.length; i++) {
      base += utils.atom_entry(obj.entries[i])
    }

    base += '</feed>'

    return base

  },
  atom_entry: function(obj){
    let entry = '<entry>';

    let arr = ['title','updated', 'id', 'summary', 'published', 'rights']

    for (let i = 0; i < arr.length; i++) {
      if(obj[arr[i]] && obj[arr[i]] !== ''){
        entry += '<'+ arr[i] +'>'+ obj[arr[i]] +'</'+ arr[i] +'>'
      }
    }

    if(obj.author.name !== '' || obj.author.email !== '' || obj.author.uri !== ''){
      entry += '<author>'
      for (let i in obj.author) {
        if(obj.author[i] !== ''){
          entry += '<'+ i +'>'+ obj.author[i] +'</'+ i +'>'
        }
      }
      entry += '</author>'
    }

    // build content
    if(obj.content.type !== '' || obj.content.data !== '' || obj.content.src !== ''){
      let data = '<content';

      if(obj.content.type !== ''){
        data += ' type="'+ obj.content.type +'"';
      }

      if(obj.content.src !== ''){
        data += ' src="'+ obj.content.src +'" />';
      } else {
        data += '>'+ obj.content.data +'</content>';
      }

      entry += data;
      data = null;
    }

    // build link
    if(obj.link.href !== ''){
      let lnk = '<link ';
      if(obj.link.rel !== ''){
        lnk += 'rel="'+ obj.link.rel +'" ';
      }

      if(obj.link.title !== ''){
        lnk += 'title="'+ obj.link.title +'" ';
      }

      if(obj.link.hreflang !== ''){
        lnk += 'hreflang="'+ obj.link.hreflang +'" ';
      }

      if(obj.link.type !== ''){
        lnk += 'type="'+ obj.link.type +'" ';
      }

      lnk += 'href="'+ obj.link.href +'" />';

      entry += lnk;
      lnk = null;
    }

    // build category
    if(obj.category.term !== ''){
      let cat = '<category ';

      if(obj.category.label !== ''){
        cat += 'title="'+ obj.category.label +'" ';
      }

      if(obj.category.scheme !== ''){
        cat += 'scheme="'+ obj.category.scheme +'" ';
      }

      cat += 'term="'+ obj.category.term +'" />';

      entry += cat;
      cat = null;
    }

    if(obj.contributor.length > 0 && obj.contributor[0] !== ''){
      entry += '<contributor>'
      for (let i = 0; i < obj.contributor.length; i++) {
        if(obj.contributor[i] !== ''){
          entry += '<name>'+ obj.contributor[i] +'</name>'
        }
      }
      entry += '</contributor>'
    }

    //build source
    if(obj.source.id !== '' || obj.source.title !== '' || obj.source.updated !== ''){
      entry += '<source>'
      for (let i in obj.source) {
        if(obj.source[i] !== ''){
          entry += '<'+ i +'>'+ obj.source[i] +'</'+ i +'>'
        }
      }
      entry += '</source>'
    }

    entry += '</entry>';
    return entry
  }
}


Object.freeze(utils);


export { utils }
