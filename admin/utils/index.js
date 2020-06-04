const fs = require('fs');

const utils = {
  create: function(req, cb){
    let body = jp(req.body),
    title = body.schema.title.replace(/ /g,'_');
    fs.writeFile('./app/data/feeds/'+ title +'.json', js(body.schema), function(err){
      if(err){return cb('unable to create feed schema')}

      fs.writeFile('./atom/'+ title +'.xml', body.xml, function(err){
        if(err){return cb('unable to create feed xml')}

        fs.readdir('./app/data/feeds', function(err, files){
          if(err){return cb('unable to check feed-list')}

          let arr = [];
          for (let i = 0; i < files.length; i++) {
            if(files[i] !== '.gitkeep'){
              arr.push(files[i].split('.')[0].replace(/ /g,'_'))
            }
          }
          fs.writeFile('./app/data/feed_list.json', js(arr), function(err){
            if(err){return cb('unable to update feed list')}
            return cb(false, title + ' feed created');
          })
        })
      })
    })
  },
  delete: function(req, cb){
    let body = jp(req.body),
    title = body.title.replace(/ /g,'_');

    fs.unlink('./app/data/feeds/'+ title +'.json', function(err){
      if(err){return cb('unable to delete feed')}

      fs.unlink('./atom/'+ title +'.xml', function(err){
        if(err){return cb('unable to delete ./atom/'+ title +'.xml')}

        fs.readdir('./app/data/feeds', function(err, files){
          if(err){return cb('unable to check feed-list')}

          let arr = [];
          for (let i = 0; i < files.length; i++) {
            if(files[i] !== '.gitkeep'){
              arr.push(files[i].split('.')[0].replace(/ /g,'_'))
            }
          }
          fs.writeFile('./app/data/feed_list.json', js(arr), function(err){
            if(err){return cb('unable to update feed list')}
            return cb(false, title + ' deleted');
          })
        })
      })
    })
  }
}

module.exports = utils;
