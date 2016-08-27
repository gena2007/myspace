/**
 * Created by MS on 16-8-25.
 */
require(['jquery', 'config'], function($, config){
    var arr = ["aaaaaaaaaaa"];
    var str = "aaaaaaaaaaaa";
    //上传
    document.querySelector("#uploadImg").onclick = function(){
        config.uploadContext.global_main_arr = arr;
        config.uploadContext.global_main_str = str;
        config.upload();
        console.log(config.uploadContext.global_main_arr);
        console.log(config.uploadContext.global_main_str);
    }
});