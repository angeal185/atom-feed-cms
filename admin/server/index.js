global.cl = console.log;
global.js = JSON.stringify;
global.jp = JSON.parse;

const config = require('../config'),
https = require('https'),
fs = require('fs'),
rout = require('../rout/'),
path = require('path');

const sconfig = {
  cert: fs.readFileSync(config.server.cert),
  key: fs.readFileSync(config.server.key)
}

const server = https.createServer(sconfig)

server.on('request', function (req, res) {
    const method = req.method,
    url = req.url;

    if(url !== '/'){
      cl(url)
    }

    if(method === 'POST'){

      let dest = url.slice(1).split('/'),
      body = '';

      if(dest[0] !== 'api' || config.server.api.paths.indexOf(dest[1]) === -1){
        res.writeHead(404, { 'Content-Type': 'application/json;'});
        return res.end(js({status: '404 not found'}));
      }

      req.on('data', function(chunk) {
          body += chunk;
      });

      req.on('end', function(){
        req.body = body;
        rout[dest[1]](req,res);
      });

      req.on('error', function () {
        res.writeHead(500, { 'Content-Type': 'application/json;'});
        return res.end(js({status: '500 bad request'}));
      });
      // create


    } else if(method === 'GET'){

      let filePath = '.' + url,
      ext = path.extname(filePath),
      ctype = null;

      if (filePath === './'){
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(config.server.base_tpl.replace('CSS', config.server.css).replace('MJS', config.server.mjs), 'utf-8');
      }

      if(['.js','.mjs'].indexOf(ext) !== -1) {
        ctype = 'text/javascript';
      } else if(ext === '.css'){
        ctype = 'text/css';
      } else if(ext === '.json'){
        ctype = 'application/json';
      } else if(['.png', '.jpg', '.ico'].indexOf(ext) !== -1){
        ctype = 'image/'+ ext.slice(1);
      } else if(ext === '.xml'){
        ctype = 'text/xml'
      }

      fs.readFile(filePath, function(err, content) {
        if(err){
          res.writeHead(err.code);
          res.end(js({error: err.code}));
        }
        else {
          res.writeHead(200, {'Content-Type': ctype});
          res.end(content, 'utf-8');
        }
      });

    } else {
      res.writeHead(500, { 'Content-Type': 'application/json;'});
      return res.end(js({status: 'method not allowed'}));
    }


})
.listen(config.server.port, function(){
  console.log('Server listening at http://127.0.0.1:'+config.server.port);
});
