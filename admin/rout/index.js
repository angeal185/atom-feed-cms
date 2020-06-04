const fs = require('fs'),
utils = require('utils');

const rout = {
  create: function(req,res){

    utils.create(req, function(err, msg){
      if(err){
        res.writeHead(500, { 'Content-Type': 'application/json;'});
        return res.end(js({status: err}));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json;'});
        return res.end(js({status: msg}));
      }
    })

  },
  delete: function(req,res){

    utils.delete(req, function(err, msg){
      if(err){
        res.writeHead(500, { 'Content-Type': 'application/json;'});
        return res.end(js({status: err}));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json;'});
        return res.end(js({status: msg}));
      }
    })
  }
}

module.exports = rout;
