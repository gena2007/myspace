/**
 * Created by MS on 16-8-25.
 */
define(["jquery"], function($){
    var uploadContext = {
        global_main_arr: [],
        global_main_str: ""
    };
    var upload = function(){
        uploadContext.global_main_arr.push("bbbbbbbb");
        uploadContext.global_main_str = "bbbbbbb";
    };
    return {
        uploadContext: uploadContext,
        upload: upload
    };
});