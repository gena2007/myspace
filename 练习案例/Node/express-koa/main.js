
//Babel是一个JavaScript编写的转码器，它可以把高版本的JavaScript代码转换成低版本的JavaScript代码，并保持逻辑不变，这样就可以在低版本的JavaScript环境下运行
//用Babel转码时，需要指定presets和plugins。presets是规则，我们stage-3规则，stage-3规则是ES7的stage 0~3的第3阶段规则
//为了让async语法能正常执行，我们只需要指定ES7的stage-3规则
var register = require('babel-core/register');
register({
    presets: ['stage-3']
});

require('./express.js');
