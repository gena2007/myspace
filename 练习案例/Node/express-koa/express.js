//Express是第一代最流行的web框架，它对Node.js的http进行了封装

// var express = require('express');
// var app = express();
// app.get('/', function (req, res) {
//     res.send('hello');
// });


//Express的API很简单，但是它是基于ES5的语法，要实现异步代码，只有一个方法：回调。如果异步嵌套层次过多，代码写起来就非常难看
// var fs = require('fs');
// app.get('/', function (req, res) {
//     fs.readFile('../node.txt', function (err, data) {
//         if (err) {
//             res.status(500).send('read file1 error');
//         }
//         fs.readFile('../hello.txt', function (err, data) {
//             if (err) {
//                 res.status(500).send('read file2 error');
//             }
//             res.type('text/plain');
//             res.send(data);
//         });
//     });
// });

//koa 1.0 新版Node.js开始支持ES6，Express的团队又基于ES6的generator重新编写了下一代web框架koa。和Express相比，koa 1.0使用generator实现异步，代码看起来像同步的
// var koa = require('koa');
// var app = koa();
// app.use(function *() {  
//   this.body = 'Hello World';
// });

//和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
//为了让async语法能正常执行，我们只需要用Babel转码时,指定ES7的stage-3规则(main.js)
//const Koa = require('koa');
//const app = new Koa(); // 创建一个Koa对象表示web app本身
//app.use(async(ctx, next) => { //参数ctx是由koa传入的封装了request和response的变量, next是koa传入的将要处理的下一个异步函数
    //await next(); //首先用await next();处理下一个异步函数
    //ctx.response.type = 'text/html';
    //ctx.response.body = '<h1>Hello, koa2!</h1>';
//});

//koa请求逻辑
//每收到一个http请求，koa就会调用通过app.use()注册的async函数，并传入ctx和next参数
//为什么要调用await next()
//原因是koa把很多async函数组成一个处理链，每个async函数都可以做一些自己的事情，然后用await next()来调用下一个async函数。我们把每个async函数称为middleware，这些middleware可以组合起来，完成很多有用的功能
//可以用以下3个middleware组成处理链，依次打印日志，记录处理时间，输出HTML
//调用app.use()的顺序决定了middleware的顺序
//如果一个middleware没有调用await next() 后续的middleware将不再执行了
// app.use(async (ctx, next) => {
//     console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
//     await next(); // 调用下一个middleware
// });
// app.use(async (ctx, next) => {
//     const start = new Date().getTime();
//     await next(); // 调用下一个middleware
//     const ms = new Date().getTime() - start; // 耗费时间
//     console.log(`Time: ${ms}ms`); // 打印耗费时间
// });
// app.use(async (ctx, next) => {
//     await next();
//     ctx.response.type = 'text/html';
//     ctx.response.body = '<h1>Hello, koa2!</h1>';
// });

//对不同的URL调用不同的处理函数，这样才能返回不同的结果
// app.use(async (ctx, next) => {
//     if (ctx.request.path === '/') {
//         ctx.response.body = 'index page';
//     } else {
//         await next();
//     }
// });

// app.use(async (ctx, next) => {
//     if (ctx.request.path === '/test') {
//         ctx.response.body = 'TEST page';
//     } else {
//         await next();
//     }
// });

// app.use(async (ctx, next) => {
//     if (ctx.request.path === '/error') {
//         ctx.response.body = 'ERROR page';
//     } else {
//         await next();
//     }
// });

// //为了处理URL，我们需要引入koa-router这个middleware，让它负责处理URL映射
// const router = require('koa-router')(); //注意require('koa-router')返回的是函数
// app.use(async (ctx, next) => {
//     console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
//     await next();
// });
// router.get('/hello/:name', async (ctx, next) => {
//     var name = ctx.params.name;
//     ctx.response.body = `<h1>Hello, ${name}!</h1>`;
// });
// //get请求
// router.get('/', async (ctx, next) => {
//     ctx.response.body = `<h1>Index</h1>
//         <form action="/signin" method="post">
//             <p>Name: <input name="name" value="koa"></p>
//             <p>Password: <input name="password" type="password"></p>
//             <p><input type="submit" value="Submit"></p>
//         </form>`;
// });
// //处理post请求，可以用router.post('/path', async fn)
// //post请求通常会发送一个表单，或者JSON，它作为request的body发送，但无论是Node.js提供的原始request对象，还是koa提供的request对象，都不提供解析request的body的功能
// //需要引入另一个middleware来解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中
// const bodyParser = require('koa-bodyparser');
// app.use(bodyParser());
// router.post('/signin', async (ctx, next) => {
//     var
//         name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signin with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="/">Try again</a></p>`;
//     }
// });
// app.use(router.routes());


//所有的URL处理函数都放到app.js里显得很乱，而且，每加一个URL，就需要修改app.js。随着URL越来越多，app.js就会越来越长
//修改app.js，让它自动扫描controllers目录，找到所有js文件，导入，然后注册每个URL
// const bodyParser = require('koa-bodyparser');
// app.use(bodyParser());
// var fs = require('fs');
// var files = fs.readdirSync(__dirname + '/controllers'); //可以用sync是因为启动时只运行一次，不存在性能问题
// var js_files = files.filter((f)=>{ // 过滤出.js文件
//     return f.endsWith('.js');
// }, files);
// for (var f of js_files) { // 处理每个js文件
//     console.log(`process controller: ${f}...`);
//     // 导入js文件:
//     var mapping = require(__dirname + '/controllers/' + f);
//     for (var url in mapping) {
//         if (url.startsWith('GET ')) {
//             var path = url.substring(4);
//             router.get(path, mapping[url]);
//             console.log(`register URL mapping: GET ${path}`);
//         } else if (url.startsWith('POST ')) {
//             // 如果url类似"GET xxx":
//             var path = url.substring(5);
//             router.post(path, mapping[url]);
//             console.log(`register URL mapping: POST ${path}`);
//         } else {
//             // 无效的URL:
//             console.log(`invalid URL: ${url}`);
//         }
//     }
// }
// app.use(router.routes());

var express = require('express');
var app = express();
var nunjucks = require('nunjucks');
// nunjucks.configure('views', {
//     autoescape: true,
//     express: app
// });
// app.get('/', function(req, res) {
//     //res.render('test.html',{name: 'surong'});
//     //res.render('test.html',{fruits: ['apple','pear','banner']});
//     //res.render('test.html', {body: 'bla bla bla...', header: 'Hello'});
// }); 

// function createEnv(path, opts) {
//     var
//         autoescape = opts.autoescape && true,
//         noCache = opts.noCache || false,
//         watch = opts.watch || false,
//         throwOnUndefined = opts.throwOnUndefined || false,
//         env = new nunjucks.Environment(
//             new nunjucks.FileSystemLoader('views', { //创建一个文件系统加载器,从views目录读取模板
//                 noCache: noCache,
//                 watch: watch,
//             }), {
//                 autoescape: autoescape,
//                 throwOnUndefined: throwOnUndefined
//             });
//     if (opts.filters) {
//         for (var f in opts.filters) {
//             env.addFilter(f, opts.filters[f]);
//         }
//     }
//     return env;
// }
// //变量env就表示Nunjucks模板引擎对象，它有一个render(view, model)方法，正好传入view和model两个参数，并返回字符串
// var env = createEnv('views', {
//     watch: true,
//     filters: {
//         hex: function (n) {
//             return '0x' + n.toString(16);
//         }
//     }
// });
// app.get('/', function(req, res) {
//     //res.render('test.html',{name: 'surong'});
//     //res.render('test.html',{fruits: ['apple','pear','banner']});
//     env.render('test.html', {body: 'bla bla bla...', header: 'Hello'});
// }); 

//首页URL
async (ctx, next) => {
    ctx.render('index.html', {
        title: 'Welcome'
    });
}
//signin
async (ctx, next) => {
    var
        email = ctx.request.body.email || '',
        password = ctx.request.body.password || '';
    if (email === 'admin@example.com' && password === '123456') {
        // 登录成功:
        ctx.render('signin-ok.html', {
            title: 'Sign In OK',
            name: 'Mr Node'
        });
    } else {
        // 登录失败:
        ctx.render('signin-failed.html', {
            title: 'Sign In Failed'
        });
    }
}
//处理静态文件的middleware
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));
//集成Nunjucks实际上也是编写一个middleware，这个middleware的作用是给ctx对象绑定一个render(view, model)的方法
const isProduction = process.env.NODE_ENV === 'production';
app.use(templating('view', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.listen(3000, function(){
    console.log('listening on port 3000!');
});
