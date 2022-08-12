/*
* library for storing and editing data
*
*/

// Dependencies
const fs = require('fs');
const path = require('path');


// Container for this module (to be exported)
let lib ={};

//base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/')

// write data to file
lib.create = function(dir,file,data,callback){
    // open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescripter){
        if(!err && fileDescripter){
            // convert data to string
            var stringData = JSON.stringify(data);
            // write data in file and close it
            fs.writeFile(fileDescripter,stringData,function(err){
                if(!err){
                    fs.close(fileDescripter,function(err){
                        if(!err){
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                }else {
                    callback('Error writing to new file');
                }
            });

        }else {
            callback('could not create new file, it may already exist');
        }
    });
};


// read data from a file

lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
        callback(err,data);
    });
};


// update existing file

lib.update = function(dir,file,data,callback){
    // open file for writing   
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescripter){
        if(!err && fileDescripter){
            // convert data to string
            var stringData =JSON.stringify(data);
            // truncate the file 
            fs.ftruncate(fileDescripter,function(err){
                if(!err){
                    //write to file and close it
                    fs.writeFile(fileDescripter,stringData,function(err){
                        if(!err){
                            fs.close(fileDescripter,function(err){
                                if(!err){
                                    callback(false);
                                } else {
                                    callback('error while closing the file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });

                } else {
                    callback('erreur truncating the file');
                }
            });
        } else {
            callback('could not open the file for update it may not exist');
        }
    });
};

//delete file

lib.delete = function(dir,file,callback){
    //unlinkind the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        } else {
            callback('error while deleting, file may not exist');
        }
    });
};

// export the module
module.exports = lib;
