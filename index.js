#!/usr/bin/env node

"use strict";

var request = require('request'),
    cheerio = require('cheerio'),
    fs      = require('fs'),
    http    = require('http'),
    argv    = require('yargs').argv,
    url = argv._[0];

    var argvType = ('%s', argv.type);

    var contentTypes = ['jpg','jpeg','png','gif','bmp'];
    if (contentTypes.indexOf(argvType)== -1)  {
        console.log("Error: file extension not valid!");
        return;
    };

    function isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i');
        return pattern.test(str);
    }
    
    var download = function(uri, filename, callback){
       
      request.head(uri, function(err, res, body){
           
            var file = fs.createWriteStream(filename);
            var request = http.get(uri, function(response) {
                
                response.pipe(file);
                
                file.on('finish', function() {
                    file.close();  // close() is async, call cb after close completes. //TODO move file to path
                });
            });
        
        });
    };

    var init = request(url, function(err, response, html){
        if(err){ return };

        var $ = cheerio.load(html);
        
        var sources = [];
        var images = $('img').attr('src'); 
        
        if (images && isURL(image) && typeof images !== "undefined") {
            
            for (var i = 0; i < images.length; i++) {
                var image = $('img').eq(i).attr('src');
               
                var extension = image.split('.').pop();
                if (argv.type){  
                    if (extension === ('%s', argv.type) ) {
                        sources.push(image)    
                    };
                };
            
            };
        
            for (var i = 0; i < sources.length; i++) { 
                var filename = sources[i].split('/').pop();
                download( sources[i], filename);
            };  
        
        };

    });
    
    
    
    
    
    