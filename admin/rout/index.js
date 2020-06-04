const fs = require('fs'),
utils = require('../utils');

const rout = {
  create: function(req,res){

    utils.create(req, function(err, msg){
      if(err){
        cc([req.method, url + ' 500'],91);
        res.writeHead(500, { 'Content-Type': 'application/json;'});
        return res.end(js({status: err}));
      } else {
        cc([req.method, url + ' 200'],92);
        res.writeHead(200, { 'Content-Type': 'application/json;'});
        return res.end(js({status: msg}));
      }
    })

  },
  delete: function(req,res){

    utils.delete(req, function(err, msg){
      if(err){
        cc([req.method, url + ' 500'],91);
        res.writeHead(500, { 'Content-Type': 'application/json;'});
        return res.end(js({status: err}));
      } else {
        cc([req.method, url + ' 200'],92);
        res.writeHead(200, { 'Content-Type': 'application/json;'});
        return res.end(js({status: msg}));
      }
    })
  }
}

module.exports = rout;
