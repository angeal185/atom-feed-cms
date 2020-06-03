const fs = require('fs');

const rout = {
  create: function(req,res){
    let body = jp(req.body),
    title = body.title.replace(/ /g,'_');

    fs.writeFile('./app/data/feeds/'+ title +'.json', req.body, function(err){
      if(err){
        res.writeHead(500, { 'Content-Type': 'application/json;'});
        return res.end(js({status: 'unable to create new feed'}));
      }
      fs.readdir('./app/data/feeds', function(err, files){
        if(err){
          res.writeHead(500, { 'Content-Type': 'application/json;'});
          return res.end(js({status: 'unable to check feed-list'}));
        }
        let arr = [];
        for (let i = 0; i < files.length; i++) {
          if(files[i] !== '.gitkeep'){
            arr.push(files[i].split('.')[0].replace(/ /g,'_'))
          }
        }
        fs.writeFile('./app/data/feed_list.json', js(arr), function(err){
          if(err){
            res.writeHead(500, { 'Content-Type': 'application/json;'});
            return res.end(js({status: 'unable to update feed list'}));
          }
          res.writeHead(200, { 'Content-Type': 'application/json;'});
          return res.end(js({status: title + ' feed created'}));
        })
      })
    })
  },
  delete: function(req,res){
    let body = jp(req.body),
    title = body.title.replace(/ /g,'_');

    fs.unlink('./app/data/feeds/'+ title +'.json', function(err){
      if(err){
        res.writeHead(500, { 'Content-Type': 'application/json;'});
        return res.end(js({status: 'unable to delete feed'}));
      }
      fs.readdir('./app/data/feeds', function(err, files){
        if(err){
          res.writeHead(500, { 'Content-Type': 'application/json;'});
          return res.end(js({status: 'unable to check feed-list'}));
        }
        let arr = [];
        for (let i = 0; i < files.length; i++) {
          if(files[i] !== '.gitkeep'){
            arr.push(files[i].split('.')[0].replace(/ /g,'_'))
          }
        }
        fs.writeFile('./app/data/feed_list.json', js(arr), function(err){
          if(err){
            res.writeHead(500, { 'Content-Type': 'application/json;'});
            return res.end(js({status: 'unable to update feed list'}));
          }
          res.writeHead(200, { 'Content-Type': 'application/json;'});
          return res.end(js({status: title + ' deleted'}));
        })
      })
    })

  }
}

module.exports = rout;
