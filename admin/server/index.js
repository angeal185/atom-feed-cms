global.cl = console.log;
global.js = JSON.stringify;
global.jp = JSON.parse;
global.cc = function(x,y){
  return cl('\x1b[92m[\x1b[94mCMS\x1b[92m:\x1b[94m'+x[0]+'\x1b[92m] \x1b['+y+'m'+ x[1] +' \x1b[0m');
}

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

cc(['init', 'atom-feed-cms starting...'],96);

server.on('listening', function(err,res,next){
  cc(['init', 'Server listening at https:\/\/localhost:'+config.server.port],96);
  cl()
})

process.on('SIGINT', function (){
  cl()
  cc(['exit', 'Server https:\/\/localhost:'+ config.server.port + ' ended'],95);
  process.exit(2);
  process.exit(1);
})

server.on('request', function (req, res) {
    const method = req.method,
    url = req.url;

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

    } else if(method === 'GET'){

      try {
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
            cc([method, url + ' 404'],91);
            res.writeHead(404);
            res.end(js({error: 404}));
          }
          else {
            cc([method, url + ' 200'],92);
            res.setHeader('Content-Length', Buffer.byteLength(content));
            res.writeHead(200, {'Content-Type': ctype});
            res.end(content, 'utf-8');
          }
        });
      } catch (err) {

      }


    } else {
      res.writeHead(500, { 'Content-Type': 'application/json;'});
      return res.end(js({status: 'method not allowed'}));
    }


}).listen(config.server.port);
