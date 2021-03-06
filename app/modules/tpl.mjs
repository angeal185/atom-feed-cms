import { h } from './h.mjs';
import { utils } from './utils.mjs';
import { ls,ss } from "./storage.mjs";
import { config } from './config.mjs';
import { rout } from './rout.mjs';

const tpl = {
  app_main: function(){

    let sb_main = tpl.sb_main(),
    nav_right = h('div.navbar-section.hide-md')

    let arr = ['dashboard', 'feed', 'entry', 'edit'];

    for (let i = 0; i < arr.length; i++) {
      nav_right.append(tpl.nav_link(arr[i]))
    }

    return h('app-main',
      sb_main,
      h('header.navbar.navbar-main',
        h('section.navbar-section',
          h('div.icon-bars.mr-4.cp.flik',{
             onclick: function(){
               sb_main.firstChild.classList.toggle('active');
               sb_main.lastChild.classList.toggle('hidden')
             }
           }),
          h('div.mr-2', 'Atom feed cms')
        ),
        nav_right
      ),
      h('div.container')
    )
  },
  nav_link: function(i){
    return h('div.nav-lnk.ml-4.sh-95', {
        title: i,
        onclick: function(evt){
          location.hash = '/'+ i.replace(/ /g, '_')
        }
      },i)
  },
  sb_link: function(i, sb, mask){
    return h('div.sb-lnk', {
        onclick: function(){
          sb.classList.toggle('active');
          mask.classList.toggle('hidden');
          location.hash = '/'+ i.replace(/ /g, '_')
        }
      },
      utils.capitalize(i),
      h('span.icon-chevron-right.lnk-r')
    )
  },
  sb_main: function(){
    let sb_content = h('div.off-canvas-content'),
    mask = h('div.off-canvas-mask.hidden', {
      onclick: function(){
        this.parentNode.firstChild.classList.toggle('active');
        this.classList.toggle('hidden');
      }
    }),
    sb_main = h('div.off-canvas',
      h('div.off-canvas-sidebar',
        sb_content,
      ),
      mask
    ),
    arr = config.nav_items;

    for (let i = 0; i < arr.length; i++) {
      sb_content.append(tpl.sb_link(arr[i], sb_main.firstChild, mask))
    }

    return sb_main
  },
  app_sub: function(){
    return h('app-sub',
      tpl.to_top(),
    )
  },
  to_top: function(){

      let item = h('div.to-top.hidden.sh-9', {
        onclick: function(){
          utils.totop(0);
        }
      });

      window.addEventListener('scroll', utils.debounce(function(evt){
        let top = window.pageYOffset || document.scrollTop;

        if(top === NaN || !top){
          item.classList.add('hidden')
        } else if(item.classList.contains('hidden')){
          item.classList.remove('hidden');
        }
        top = null;
        return;
      }, 250))

      item.append(
        h('i.icon-chevron-up')
      )
      return item;
  },
  base: function(win,doc){

    let app_main = tpl.app_main(),
    main_content = app_main.lastChild,
    lhash = location.hash.split('/');

    win.onhashchange = function(){
      let dest = location.hash.slice(2);
      doc.title = dest

      utils.empty(main_content, function(){
        rout[dest](main_content);
      })
    }

    doc.body.append(
      h('app-content',
        app_main,
        tpl.app_sub()
      )
    )

    if(lhash.length > 1 && config.nav_items.indexOf(lhash[1]) !== -1){
      doc.title = lhash[1]
      rout[lhash[1]](main_content);
    } else {
      location.hash = '/'+ config.nav_items[config.nav_base]
    }

  },
  create_inp: function(i,e){
    return h('div.column.col-6.col-md-12',
      h('div.form-group',
        h('label.form-label', i),
        h('input.form-input', {
          onkeyup: function(evt){
            e = evt.target.value;
          }
        })
      )
    )
  },
  item_card: function(obj){
    let card = h('div.column.col-6.col-md-12',
      h('div.card.dark-card')
    )

    card.firstChild.append(
      h('div.card-header',
        h('div.card-title.h4.btxt.flik', obj.title),
        h('div.card-subtitle.h5.text-gray', obj.id),
        h('div.card-subtitle.h5.text-gray', obj.updated)
      ),
      h('div.card-body',

      ),
      h('div.card-footer',
        h('div.columns',
          h('div.column.col-4',
            h('button.btn.btn-block.sh-95', {
              onclick: function(){
                fetch('/api/delete', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip'
                  },
                  body: js({title: obj.title})
                })
                .then(function(res){
                  if (res.status >= 200 && res.status < 300) {
                    res.json().then(function(data) {

                      utils.toast('success', obj.title + ' deleted');
                      card.remove()
                      cl(data)
                    });
                  } else {
                    return Promise.reject(new Error(res.statusText))
                  }
                })
                .catch(function(err){
                  utils.toast('danger', obj.title + ' not deleted');
                  ce(err)
                })
              }
            }, 'delete')
          ),
          h('div.column.col-4',
            h('button.btn.btn-block.sh-95', {
              onclick: function(){
                ls.set('schema_active', obj);
                ls.del('schema_entry');
                utils.toast('success', obj.title + ' active')
              }
            }, 'load')
          ),
          h('div.column.col-4',
            h('button.btn.btn-block.sh-95', {
              onclick: function(){
                let title = obj.title.replace(/ /g, '_');
                window.open('./atom/'+ title + '.xml')
              }
            }, 'view')
          )
        )
      )
    )

    return card
  }
}

Object.freeze(tpl);


export { tpl }
