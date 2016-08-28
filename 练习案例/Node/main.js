'use strict'

var greet = require('./test');
//greet("surong");

//传入process.nextTick()的函数不是立刻执行，而是要等到下一次事件循环
process.nextTick(function () {
    //console.log('nextTick callback!');
});

//程序即将退出时执行某个回调函数
process.on('exit', function (code) {
    //console.log('about to exit with code: ' + code);
});

//判断JavaScript执行环境
if (typeof(window) === 'undefined') {
    //console.log('node.js');
} else {
    //console.log('browser');
}

//fs模块就是文件系统模块，负责读写文件,fs模块同时提供了异步和同步的方法
//异步读取一个文本文件
var fs = require('fs');
fs.readFile('./node.txt','utf-8',function(err,data){
    if(err){
        //console.log(err);
    }
    else{
        //console.log(data);
    }
});

//读取的文件不是文本文件，而是二进制文件, 读取一个图片文件
//当读取二进制文件时，不传入文件编码时，回调函数的data参数将返回一个Buffer对象
fs.readFile('./1.jpg', function (err, data) {
    if (err) {
        console.log(err);
    } else {
        //console.log(data);
        //console.log(data.length + ' bytes');
        //console.log(data.toString('utf-8')); //Buffer对象可以和String作转换
        //console.log(new Buffer(data,'utf-8');  //把一个String转换成Buffer
    }
});

//同步读取的函数和异步函数相比，多了一个Sync后缀，并且不接收回调函数，函数直接返回结果, 如果同步读取文件发生错误，则需要用try...catch捕获该错误
var data = fs.readFileSync('node.txt', 'utf-8');
//console.log(data);

//写文件 如果传入的数据是String，默认按UTF-8编码写入文本文件，如果传入的参数是Buffer，则写入的是二进制文件
var data = 'Hello, Node.js';
fs.writeFile('hello.txt', data, function (err) {
    if (err) {
        console.log(err);
    } else {
        //console.log('ok.');
    }
});
fs.writeFileSync('hello.txt', data); //同步写文件

//获取文件大小，创建时间等信息，可以使用fs.stat()
//stat()也有一个对应的同步函数statSync()，请试着改写上述异步代码为同步代码
fs.stat('node.txt', function (err, stat) {
    if (err) {
        console.log(err);
    } else {
        //console.log('isFile: ' + stat.isFile()); // 是否是文件:\
        //console.log('isDirectory: ' + stat.isDirectory()); // 是否是目录:
        if (stat.isFile()) {            
            //console.log('size: ' + stat.size); // 文件大小:
            //console.log('birth time: ' + stat.birthtime); // 创建时间, Date对象:
            //console.log('modified time: ' + stat.mtime); // 修改时间, Date对象:
        }
    }
});

//stream是Node.js提供的又一个仅在服务区端可用的模块，目的是支持“流”这种数据结构
//标准输出流（stdout）。流的特点是数据是有序的，而且必须依次读取，或者依次写入，不能像Array那样随机定位
var rs = fs.createReadStream("node.txt",'utf-8');
rs.on("data", function(chunk){ //data事件表示流的数据已经可以读取,data事件可能会有多次，每次传递的chunk是流的一部分数据
    //console.log('DATA:'+chunk);
});
rs.on('end', function () { //end事件表示这个流已经到末尾
    //console.log('END');
});
rs.on('error', function (err) { //error事件表示出错
    //console.log('ERROR: ' + err);
});
//要以流的形式写入文件，只需要不断调用write()方法，最后以end()结束
var ws1 = fs.createWriteStream('hello.txt', 'utf-8');
//ws1.write('使用Stream写入文本数据...\n');
//ws1.write('END.');
ws1.end();

var ws2 = fs.createWriteStream('hello.txt');
//ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
//ws2.write(new Buffer('END.', 'utf-8'));
ws2.end();

//所有可以读取数据的流都继承自stream.Readable，所有可以写入的流都继承自stream.Writable

//pipe 一个Readable流和一个Writable流串起来后，所有的数据自动从Readable流进入Writable流
var rs = fs.createReadStream('node.txt');
var ws = fs.createWriteStream('hello.txt');
rs.pipe(ws); //默认情况下，当Readable流的数据读取完毕，end事件触发后，将自动关闭Writable流。如果我们不希望自动关闭Writable流，需要传入参数 readable.pipe(writable, { end: false });


//HTTP协议 
//要开发HTTP服务器程序，从头处理TCP连接，解析HTTP是不现实的。这些工作实际上已经由Node.js自带的http模块完成了
var http = require('http');
//var server = http.createServer(function(request, response){
    //console.log(request.method+":"+request.url);
    //response.writeHead(200, {'Content-Type':'text/html'}); //将HTTP响应200写入response, 同时设置Content-Type: text/html
    //response.end("<h1>hello world!</h1>"); //将HTTP响应的HTML内容写入response
//});
//server.listen(3000);
//console.log('Server is running at http://127.0.0.1:3000/');

//文件服务器
//可以设定一个目录，然后让Web程序变成一个文件服务器,只需要解析request.url中的路径，然后在本地找到对应的文件，把文件内容发送出去就可以了
var url = require('url');
//console.log(url.parse('http://192.168.31.148'));
//处理本地文件目录需要使用Node.js提供的path模块
var path = require('path');
var workDir = path.resolve('.'); // 解析当前目录
var filePath = path.join(workDir, 'pub', 'index.html'); //组合出完整的路径

//实现一个文件服务器
var root = path.resolve(process.argv[2] || '.');
var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname; // 获得URL的path:http://127.0.0.1:3000/1.jpg
    var filepath = path.join(root, pathname); // 获得对应的本地文件路径
    fs.stat(filepath, function (err, stats) { // 获取文件状态
        if (!err && stats.isFile()) {
            response.writeHead(200); // 发送200响应:
            fs.createReadStream(filepath).pipe(response); // 将文件流导向response,没有必要手动读取文件内容。由于response对象本身是一个Writable Stream，直接用pipe()方法就实现了自动读取文件内容并输出到HTTP响应
        } else {
            // 出错了或者文件不存在:
            console.log('404 ' + request.url);
            // 发送404响应:
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});
//server.listen(3000);
//console.log('Server is running at http://127.0.0.1:3000/');

//crypto 提供通用的加密和哈希算法
const crypto = require('crypto');
const hash = crypto.createHash('md5'); //sha1|sha256|sha512
//hash.update('123456'); //update()方法默认字符串编码为UTF-8，也可以传入Buffer
//hash.update('hello'); //123456hello
//console.log(hash.digest('hex'));

//Hmac算法也是一种哈希算法，它可以利用MD5或SHA1等哈希算法。不同的是，Hmac还需要一个密钥
//只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把Hmac理解为用随机数“增强”的哈希算法
const hmac = crypto.createHmac('sha256', 'secret-key');
hash.update('123456');
hash.update('hello');
console.log(hmac.digest('hex'));

//AES是一种常用的对称加密算法，加解密都用同一个密钥。crypto模块提供了AES支持，但是需要自己封装好函数，便于使用