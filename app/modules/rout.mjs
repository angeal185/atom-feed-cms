import { h } from './h.mjs';
import { config } from './config.mjs';
import { tpl } from './tpl.mjs';
import { utils } from './utils.mjs';
import { ls,ss } from "./storage.mjs";

const rout = {
  dashboard: function(dest){
    let base = h('div.columns',
      h('div.column.col-12',
        h('h4.mt-4', 'Atom feeds')
      )
    )

    utils.fetchJSON('./app/data/feed_list.json',function(err,items){
      if(err){return cl(err)}
      for (let i = 0; i < items.length; i++) {
        utils.fetchJSON('./app/data/feeds/'+ items[i] +'.json',function(err,data){
          if(err){return cl(err)}
          base.append(tpl.item_card(data))
        })
      }
      dest.append(base)
    })
  },
  feed: function(dest){

    let schema,
    cschema = ls.get('schema_active');
    if(!cschema || typeof cschema !== 'object'){
      schema = config.new_schema;
    } else {
      schema = cschema;
    }

    let base = h('div.columns'),
    schema_id = h('input.form-input', {
      value: schema.id,
      readOnly: true
    }),
    schema_updated = h('input.form-input', {
      value: schema.updated,
      readOnly: true
    })

    base.append(
      h('div.column.col-12',
        h('h4.mt-4', 'Base items')
      ),
      h('div.column.col-6.col-md-12',
        h('div.form-group',
          h('label.form-label.w-100', 'id',
            h('span.cp.float-right',{
              onclick: function(){
                let newId = 'urn:uuid:'+ utils.uuid()
                schema_id.value = newId;
                schema.id = newId;
                ls.set('schema_active', newId);
              }
            },'new')
          ),
          schema_id,
        )
      ),
      h('div.column.col-6.col-md-12',
        h('div.form-group',
          h('label.form-label.w-100', 'updated',
            h('span.cp.float-right',{
              onclick: function(){
                let newDate = new Date().toISOString()
                schema_updated.value = newDate;
                schema.updated = newDate;
                ls.set('schema_active', schema);
              }
            },'update')
          ),
          schema_updated,
        )
      )
    )

    var arr = ['title','subtitle','icon','logo','rights','generator'];

    for (let i = 0; i < arr.length; i++) {
      base.append(h('div.column.col-6.col-md-12',
        h('div.form-group',
          h('label.form-label', arr[i]),
          h('input.form-input', {
            value: schema[arr[i]],
            onkeyup: function(evt){
              schema[arr[i]] = this.value;
              ls.set('schema_active', schema);
            }
          })
        )
      ))
    }

    let arr2 = ['link', 'author', 'category'];

    for (let j = 0; j < arr2.length; j++) {

      base.append(
        h('div.column.col-12',
          h('h4.mt-8', utils.capitalize(arr2[j])+ ' items')
        )
      )

      for (let k in schema[arr2[j]]) {
        base.append(h('div.column.col-6.col-md-12',
          h('div.form-group',
            h('label.form-label', k),
            h('input.form-input', {
              value: schema[arr2[j]][k],
              onkeyup: function(evt){
                schema[arr2[j]][k] = evt.target.value;
                ls.set('schema_active', schema);
              }
            })
          )
        ))
      }
    }

    base.append(
      h('div.column.col-12',
        h('h4.mt-8', 'contributor/s')
      ),
      h('div.column.col-12',
        h('div.form-group',
          h('label.form-label', 'contributor names seperated by comma'),
          h('input.form-input', {
            title: 'names seperated by comma',
            value: schema.contributor.join(','),
            onkeyup: function(evt){
              schema.contributor = evt.target.value.split(',');
              ls.set('schema_active', schema);
            }
          })
        )
      ),
      h('div.column.col-12',
        h('button.btn.mt-8', {
          onclick: function(){
            let xml_final = utils.atom_base(schema);
            cl(xml_final)
            ls.set('schema_active', schema);
            fetch('/api/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
              },
              body: js({xml: xml_final, schema: schema})
            })
            .then(function(res){
              if (res.status >= 200 && res.status < 300) {
                res.json().then(function(data) {
                  cl(data)
                  utils.toast('success', data.status)
                });
              } else {
                return Promise.reject(new Error(res.statusText))
              }
            })
            .catch(function(err){
              ce(err)
            })
          }
        },'Commit')
      )
    )


    dest.append(
      h('h3', 'Atom feed'),
      base
    )


  },
  entry: function(dest){

    let active = ls.get('schema_active');
    if(active === null){
      location.hash = '/dashboard';
      return utils.toast('danger', 'no feed loaded');
    }

    let schema,
    cschema = ls.get('schema_entry');
    if(!cschema || typeof cschema !== 'object'){
      schema = config.new_entry;
    } else {
      schema = cschema;
    }

    let base = h('div.columns'),
    schema_id = h('input.form-input', {
      value: schema.id,
      readOnly: true
    }),
    schema_updated = h('input.form-input', {
      value: schema.updated,
      readOnly: true
    })

    base.append(
      h('div.column.col-12',
        h('h4.mt-4', 'Base items')
      ),
      h('div.column.col-6.col-md-12',
        h('div.form-group',
          h('label.form-label.w-100', 'id',
            h('span.cp.float-right',{
              onclick: function(){
                let newId = 'urn:uuid:'+ utils.uuid()
                schema_id.value = newId;
                schema.id = newId;
                ls.set('schema_entry', newId);
              }
            },'new')
          ),
          schema_id,
        )
      ),
      h('div.column.col-6.col-md-12',
        h('div.form-group',
          h('label.form-label.w-100', 'updated',
            h('span.cp.float-right',{
              onclick: function(){
                let newDate = new Date().toISOString()
                schema_updated.value = newDate;
                schema.updated = newDate;
                ls.set('schema_entry', schema);
              }
            },'update')
          ),
          schema_updated,
        )
      )
    )

    var arr = config.entry_singles;

    for (let i = 0; i < arr.length; i++) {
      base.append(h('div.column.col-6.col-md-12',
        h('div.form-group',
          h('label.form-label', arr[i]),
          h('input.form-input', {
            value: schema[arr[i]],
            onkeyup: function(evt){
              schema[arr[i]] = this.value;
              ls.set('schema_entry', schema);
            }
          })
        )
      ))
    }

    let arr2 = config.entry_groups;

    for (let j = 0; j < arr2.length; j++) {

      base.append(
        h('div.column.col-12',
          h('h4.mt-8', utils.capitalize(arr2[j])+ ' items')
        )
      )

      for (let k in schema[arr2[j]]) {
        if(k === 'data'){
          let ta = h('textarea.form-input', {
            value: schema[arr2[j]][k],
            rows: 6,
            onkeyup: function(evt){
              schema[arr2[j]][k] = evt.target.value;
              ls.set('schema_entry', schema);
            }
          });
          base.append(h('div.column.col-6.col-md-12',
            h('div.form-group',
              h('label.form-label.w-100', k,
                h('span.float-right.cp', {
                  onclick: function(){
                    ta.value = utils.escapeHTML(ta.value);
                    schema[arr2[j]][k] = ta.value;
                    ls.set('schema_entry', schema);
                  }
                }, 'escape'
              )),
              ta
            )
          ))
        } else {
          base.append(h('div.column.col-6.col-md-12',
            h('div.form-group',
              h('label.form-label', k),
              h('input.form-input', {
                value: schema[arr2[j]][k],
                onkeyup: function(evt){
                  schema[arr2[j]][k] = evt.target.value;
                  ls.set('schema_entry', schema);
                }
              })
            )
          ))
        }

      }
    }

    base.append(
      h('div.column.col-12',
        h('h4.mt-8', 'contributor/s')
      ),
      h('div.column.col-12',
        h('div.form-group',
          h('label.form-label', 'contributor names seperated by comma'),
          h('input.form-input', {
            title: 'names seperated by comma',
            value: schema.contributor.join(','),
            onkeyup: function(evt){
              schema.contributor = evt.target.value.split(',');
              ls.set('schema_entry', schema);
            }
          })
        )
      ),
      h('div.column.col-12',
        h('button.btn.mt-8', {
          onclick: function(){
            ls.set('schema_entry', schema);
            let final = ls.get('schema_active', schema);
            final.entries.unshift(schema);
            final.entries = final.entries.slice(0, config.max_entries);

            ls.set('schema_active', final);

            let xml_final = utils.atom_base(final);

            fetch('/api/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
              },
              body: js({xml: xml_final, schema: final})
            })
            .then(function(res){
              if (res.status >= 200 && res.status < 300) {
                res.json().then(function(data) {
                  cl(data)
                  utils.toast('success', data.status)
                });
              } else {
                return Promise.reject(new Error(res.statusText))
              }
            })
            .catch(function(err){
              ce(err)
            })
          }
        },'Commit')
      )
    )


    dest.append(
      h('h3', 'Atom feed entry'),
      base
    )

  },
  edit: function(dest){
    ls.del('schema_edit');
    ls.del('schema_index');

    let active = ls.get('schema_active');
    if(active === null){
      location.hash = '/dashboard';
      return utils.toast('danger', 'no feed loaded');
    }

    let base = h('div.columns');

    function edit_entry(schema){

      utils.emptySync(base);

      let schema_id = h('input.form-input', {
        value: schema.id,
        readOnly: true
      }),
      schema_updated = h('input.form-input', {
        value: schema.updated,
        readOnly: true
      })

      base.append(
        h('div.column.col-12',
          h('h4.mt-4', 'Base items')
        ),
        h('div.column.col-6.col-md-12',
          h('div.form-group',
            h('label.form-label.w-100', 'id'),
            schema_id,
          )
        ),
        h('div.column.col-6.col-md-12',
          h('div.form-group',
            h('label.form-label.w-100', 'updated',
              h('span.cp.float-right',{
                onclick: function(){
                  let newDate = new Date().toISOString()
                  schema_updated.value = newDate;
                  schema.updated = newDate;
                  ls.set('schema_edit', schema);
                }
              },'update')
            ),
            schema_updated,
          )
        )
      )

      var arr = config.entry_singles;

      for (let i = 0; i < arr.length; i++) {
        base.append(h('div.column.col-6.col-md-12',
          h('div.form-group',
            h('label.form-label', arr[i]),
            h('input.form-input', {
              value: schema[arr[i]],
              onkeyup: function(evt){
                schema[arr[i]] = this.value;
                ls.set('schema_edit', schema);
              }
            })
          )
        ))
      }

      let arr2 = config.entry_groups;

      for (let j = 0; j < arr2.length; j++) {

        base.append(
          h('div.column.col-12',
            h('h4.mt-8', utils.capitalize(arr2[j])+ ' items')
          )
        )

        for (let k in schema[arr2[j]]) {
          base.append(h('div.column.col-6.col-md-12',
            h('div.form-group',
              h('label.form-label', k),
              h('input.form-input', {
                value: schema[arr2[j]][k],
                onkeyup: function(evt){
                  schema[arr2[j]][k] = evt.target.value;
                  ls.set('schema_edit', schema);
                }
              })
            )
          ))
        }
      }

      base.append(
        h('div.column.col-12',
          h('h4.mt-8', 'contributor/s')
        ),
        h('div.column.col-12',
          h('div.form-group',
            h('label.form-label', 'contributor names seperated by comma'),
            h('input.form-input', {
              title: 'names seperated by comma',
              value: schema.contributor.join(','),
              onkeyup: function(evt){
                schema.contributor = evt.target.value.split(',');
                ls.set('schema_edit', schema);
              }
            })
          )
        ),
        h('div.column.col-12',
          h('button.btn.mt-8', {
            onclick: function(){
              ls.set('schema_edit', schema);
              let final = ls.get('schema_active');
              final.entries[ls.get('schema_index')] = schema;

              ls.set('schema_active', final);

              let xml_final = utils.atom_base(final);

              fetch('/api/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept-Encoding': 'gzip'
                },
                body: js({xml: xml_final, schema: final})
              })
              .then(function(res){
                if (res.status >= 200 && res.status < 300) {
                  res.json().then(function(data) {
                    utils.toast('success', 'entry updated')
                  });
                } else {
                  return Promise.reject(new Error(res.statusText))
                }
              })
              .catch(function(err){
                ce(err)
              })
            }
          },'Commit')
        )
      )
    }

    let entry_id = h('input.form-input');

    dest.append(
      h('h3', 'Atom feed entry edit'),
      h('div.columns',
        h('div.column.col-6.col-md-12',
          h('div.form-group',
            h('label.form-label.w-100', 'id of entry to edit'),
            entry_id
          ),
          h('div.columns',
            h('div.column.col-6',
              h('button.btn.btn-block', {
                onclick: function(evt){

                  let arr = ls.get('schema_active').entries,
                  exists = false,
                  sel;

                  for (let i = 0; i < arr.length; i++) {
                    if(arr[i].id === entry_id.value){
                      ls.set('schema_edit', arr[i]);
                      ls.set('schema_index', i);
                      edit_entry(arr[i]);
                      exists = true;
                    }
                  }

                  if(exists){
                    utils.toast('success', 'entry found');
                  } else {
                    utils.toast('danger', 'entry not found');
                  }

                }
              }, 'Load')
            ),
            h('div.column.col-6',
              h('button.btn.btn-block', {
                onclick: function(){
                  let arr = ls.get('schema_active').entries,
                  newArr = [],
                  exists = false;

                  for (let i = 0; i < arr.length; i++) {
                    if(arr[i].id !== entry_id.value){
                      newArr.push(arr[i]);
                      exists = true;
                    }
                  }

                  let final = ls.get('schema_active');
                  final.entries = newArr;

                  ls.set('schema_active', final);

                  let xml_final = utils.atom_base(final);

                  fetch('/api/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept-Encoding': 'gzip'
                    },
                    body: js({xml: xml_final, schema: final})
                  })
                  .then(function(res){
                    if (res.status >= 200 && res.status < 300) {
                      res.json().then(function(data) {
                        cl(data)
                        utils.toast('success', 'entry deleted')
                      });
                    } else {
                      return Promise.reject(new Error(res.statusText))
                    }
                  })
                  .catch(function(err){
                    ce(err)
                  })

                }
              }, 'Delete')
            )
          )
        ),
        h('div.column.col-6.col-md-12',

        )

      ),
      base
    )

  },
  settings: function(dest){
    dest.append('settings')
  }
}

Object.freeze(rout);

export { rout }
