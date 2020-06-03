const LS = localStorage,
SS = sessionStorage;

const ls = {
  get: function(i){
    return jp(LS.getItem(i))
  },
  set: function(i,e){
    LS.setItem(i, js(e))
    return;
  },
  del: function(i){
    LS.removeItem(i);
  }
}

Object.freeze(ls);

const ss = {
  get: function(i){
    return jp(SS.getItem(i))
  },
  set: function(i,e){
    SS.setItem(i, js(e))
    return;
  },
  del: function(i){
    SS.removeItem(i);
  }
}
Object.freeze(ss);

export { ls, ss }
