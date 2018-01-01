jQuery.support.cors = true;
// 全局变量
var SECURECODE_HOST = "";
var COMPANY_HOST = "";
var PRODUCT_HOST="";
var ACTIVITY_HOST="";
var STATIS_HOST = "";
var M_HOST = "";
var DOMAIN = "";

var ERRORCODE = {
  SUCCESS: 0,
  UNKNOWN: 1,
  FAILED: 2,
  UPGRADING: 3,
  SERVER_TOO_BUSY: 4,
  NOT_IMPLEMENTED: 5,
  IN_BLACKLIST: 6,
  SIGN_ERROR: 7,
  REQUEST_TOO_OFTEN: 9,
  PERMISSION_DENIED: 10,
  PARAM_NOT_ENOUGH: 11,
  PARAM_ERROR: 12,
  NOT_FOUND: 13,
  NOT_LOGIN: 14,
  USER_DEACTIVE: 15,
  WEIXIN_NOT_LOGIN: 16,
  SUPERUSER_PERMISSION_DENIED: 17,
  ACCOUNT_INVALID_CAPTCHA: 10004,
  INVALID_PASSWORD: 30001,
  HAD_USED: 30002,
  INVALID_CODE: 30003,
  INVALID_CAPTCHA: 30004,
  SEND_VERIFICATION_OVER_RATE: 30005,
  NOT_AUDIT: 30006,
  NOT_REGISTER_MOBILE: 30007,
  PAY_FAILED: 45007,
  PRODUCT_ID_ERROR: 46010,
  AMOUNT_ERROR: 46013
};

function logout (){
  $.ajax({
    url : COMPANY_HOST + '/api/hera/account/logout',
    type : 'POST',
    processData: false,
    contentType: false,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success : function(data) {
      delCookie("hera_sid", DOMAIN);
      delCookie("user_info", DOMAIN);
      delCookie("audit_status", DOMAIN);
      window.location.href = "/pages/login.html"
    }
  });
}

function select_menu(){
  /*
   * 选择菜单,通过path进行匹配
   * 概述,匹配 / 或者 ""
   * 新手指导,匹配 product
   */
  var url = window.location.pathname || '/';

  if(url == "/" || url == "/pages/"|| url == "/pages/index" || url.indexOf("/pages/index") > -1){
    $("#sketch").addClass("active");
  }else if(url.indexOf("/pages/flow/") > -1){
    $("#sketch").addClass("active");
  }else if(url.indexOf("/pages/product/") > -1){
    $("#management").addClass("active");
  }else if(url.indexOf("/pages/account/") > -1) {
    $("#account").addClass("active");
  }else if(url.indexOf("/pages/codes/") > -1) {
    $("#qr-code").addClass("active");
  }else if(url.indexOf("/pages/address/") > -1){
    $("#address").addClass("active");
  }else if(url.indexOf("/pages/prizes/") > -1 ){
    $("#prize").addClass("active");
  }else if(url.indexOf("/pages/activity/") > -1){
    $("#activity").addClass("active");
  }else if(url.indexOf("/pages/weixin-settings.html") > -1){
    $("#weixin-settings").addClass("active");
  }else if(url.indexOf("/pages/data-center") > -1){
    $("#data-center").addClass("active");
  }else if(url.indexOf("/pages/trace/static/") > -1){
    $("#static").addClass("active");
    $('#trace').addClass("active");
  }else if(url.indexOf("/pages/trace/track/") > -1){
    $("#dynamic").addClass("active");
    $('#trace').addClass("active");
  }else if(url.indexOf("/pages/alarm-center") > -1){
    $("#early").addClass("active");
  }else if(url.indexOf("/pages/company-info/") > -1){
    $("#company-info").addClass("active");
  }else if(url.indexOf("/pages/product-recommend/") > -1){
    $("#product-recommend").addClass("active");
  }else if(url.indexOf("/pages/red-bag/") > -1){
    $("#red-bag").addClass("active");
  }
}
//日期转字符串 返回日期格式20080808
function dateToString(date) {
  if (date instanceof Date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var day = date.getDate();
    day = day < 10 ? '0' + day : day;
    return year + "" + month + "" + day;
  }
  return '';
}
function isIdCard(cardid) {
  //身份证正则表达式(18位)
  var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
  var stard = "10X98765432"; //最后一位身份证的号码
  var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
  var sum = 0;
  if (!isIdCard2.test(cardid)) {
    return false;
  }
  var year = cardid.substr(6, 4);
  var month = cardid.substr(10, 2);
  var day = cardid.substr(12, 2);
  var birthday = cardid.substr(6, 8);
  if (birthday != dateToString(new Date(year+'/'+month+'/'+day))) {//校验日期是否合法
    return false;
  }
  for (var i = 0; i < cardid.length - 1; i++) {
    sum += cardid[i] * first[i];
  }
  var result = sum % 11;
  var last = stard[result]; //计算出来的最后一位身份证号码
  if (cardid[cardid.length - 1].toUpperCase() == last) {
    return true;
  } else {
    return false;
  }
}

try{
  //修改默认错误信息
  jQuery.extend(jQuery.validator.messages, {
    required:"请填写内容",
    equalTo:"请输入相同的密码",
    email:"请输入合法的邮箱"
  });

  //增加自定义校验属性
  $.validator.addMethod(
    "mobile",
    function(value, element, param){
      var re = new RegExp(/^[T1][34578]\d{9}$/);
      return this.optional(element) || re.test(value);
    },
    "手机号码格式不正确"
  );
  //带固话联系方式验证
  $.validator.addMethod(
    "mobile_tel",
    function(value, element, param){
      var re = new RegExp(/^[T1][34578]\d{9}$/);
      var reTel = new RegExp(/^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/);
      // 400、800企业电话
      var bReTel = new RegExp(/^(400|800)[0-9\-]{7,9}$/);
      return this.optional(element) || reTel.test(value) || re.test(value) || bReTel.test(value);
    },
    "联系方式不正确"
  );

  $.validator.addMethod(
    "code",
    function(value, element, param){
      var re = new RegExp(/^\d{6}$/);
      return this.optional(element) || re.test(value);
    },
    "请输入正确的短信验证码"
  );

  $.validator.addMethod(
    "img_code",
    function(value, element, param){
      var re = new RegExp(/^\d{4}$/);
      return this.optional(element) || re.test(value);
    },
    "请输入正确的验证码"
  );

  $.validator.addMethod(
    "password",
    function(value, element, param){
      /* */
      var re = new RegExp(/^(?!\D+$)(?![^a-zA-Z]+$)([\x20-\x7f]){8,32}$/);
      return this.optional(element) || re.test(value);
    },
    "请输入8-32位字符，须包含数字和字母"
  );

  //--身份证号
  $.validator.addMethod(
    "id_card",
    function(value, element, param){
      return this.optional(element) || isIdCard(value);
    },
    "请输入正确身份证号"
  );

  $.validator.addMethod(
    "business_license_id",
    function(value, element, param){
      return value.length == 15 || value.length == 18;
    },
    "请输入正确营业执照号"
  );

  $.validator.addMethod(
    "corporation_name",
    function(value, element, param){
      return value.length <= 10 && value.length >= 2;
    },
    "请输入正确姓名"
  );
  var noSelectProvince = '1100',noSelectAdcode = '1101';
  $.validator.addMethod(
    "address_select",
    function(value, element, param){
      return value !== noSelectProvince && value !== noSelectAdcode;
    },
    "请选择完整的地区信息"
  );
  $.validator.addMethod(
    "ten_thousand_multi",
    function(value, element, param){
      var re = new RegExp(/^\d{1,}0{4}$/);
      return this.optional(element) || re.test(value);;
    },
    "必须是10000的倍数"
  );
  $.validator.addMethod(
    "greater_than_time",
    function(value, element, params) {
      if (!/Invalid|NaN/.test(new Date(value))) {
          return new Date(value) > new Date($(params).val());
      }

      return isNaN(value) && isNaN($(params).val())
          || (Number(value) > Number($(params).val()));
    },
    "大于"
  );
  $.validator.addMethod(
    "checkSize",
    function(value,element,size) {
      var fileElement;
      //区分上传图片的两种校验-->账户管理与商品
      if($(element).attr('type') == 'text'){
        fileElement = $(element).siblings(':input[type=file]');
      }else{
        fileElement = $(element);
      }
      if(fileElement.length > 0){
        try{  // ie10以下没有files[0]属性
          var fileSize= fileElement[0].files[0].size;
        }catch(err){
          return true;
        }
        var maxSize = size*1024*1024;
        if(fileSize > maxSize){
          return false;
        }else{
          return true;
        }
      }else{
        return true;
      }
    },
    "文件大小超出限制"
  );
  $.validator.addMethod(
    "check_format",
    function(value, element,format) {
      var fileName=value.split('\\').pop();
      if(fileName == ''){return true}
      var fileTArr=fileName.toLowerCase().split(".");
      var filetype=fileTArr[fileTArr.length-1];
      if(filetype != format){
        return false;
      }else{
        return true;
      }
    },
    "上传格式不适合"
  );

}catch(err){}
 /*表单验证
  *error-tips为错误提示信息的class
  *error-input输入错误时输入框的类名
  */
function getInputTitle($element){ // 只找3级
  var $selectP = $element.parent();
  if($selectP.find("p.input-title").length > 0){
    return $selectP.find("p.input-title");
  }
  $selectP = $selectP.parent();
  if($selectP.find("p.input-title").length > 0){
    return $selectP.find("p.input-title");
  }
  $selectP = $selectP.parent();
  return $selectP.find("p.input-title");
}

var jquery_valid_errorPlacement = function (error, element) {
  //--controls 为错误提示信息的父元素
  var controls = getInputTitle($(element));
  controls.find(".error-tips").remove();
  $(error).addClass('pull-right error-tips');
  $(error).appendTo(controls)
};

var jquery_valid_success = function (element) {
  $(element).parent().parent().find('.input-in').removeClass("error-input");
};

var jquery_valid_highlight = function (element) {
  return true;
};

var jquery_valid_onfocusout = function (element) {
  var valid = $(element).valid();
  var controls = getInputTitle($(element));
  if(!valid){
    if(controls.length > 0){
      $(element).addClass("error-input");
      controls.find('span[class*="error-tips"]').removeClass("hidden");
    }else{
      $(element).siblings('span.upload-error-tips').addClass('hidden');
    }
  }else{
    $(element).parent().parent().siblings('.verify-show').css('border', '1px solid #e7e7e7');
    controls.find('span[class*="error-tips"]').addClass("hidden");
  }
};

var jquery_valid_invalidHandler= function(event, validator){
  $.each(validator.errorList, function(index, error){
    //---上传证件时的校验
    if($(error.element).attr('verify')){
      $(error.element).parent().parent().siblings('.verify-show').css('border', '1px solid #ef5a50');
      if($(error.element).siblings('span.upload-error-tips').length == 0){
        $('<span class="upload-error-tips red-text">请选择证件图片</span>').appendTo($(error.element).parent());
      }
    }else{
      $(error.element).addClass("error-input");
      var controls = getInputTitle($(error.element));
      controls.find('span[class*="error-tips"]').removeClass("hidden");
    }
  });
};
var jquery_valid_onfocusin = function(element){
  var controls = getInputTitle($(element));
  //---上传证件时的校验
  if(controls.length > 0){
    controls.find('span[class*="error-tips"]').addClass("hidden");
  }else{
    $(element).parent().find('span[class*="upload-error-tips"]').addClass('hidden');
  }
};

var add_errors = function (element, error) {
  /**
   * form校验时，指定字段，增加错误提示
   * */
  var controls = getInputTitle($('input[name="'+element+'"]'));
  controls.find(".error-tips").remove();
  var error_ele = $("<span>").addClass('error pull-right error-tips').text(error);
  $(error_ele).appendTo(controls);
};

//获取input file的url
//建立一個可存取到該file的url
function getObjectURL(file) {
  var url = null ;
  if (window.createObjectURL!=undefined) { // basic
    url = window.createObjectURL(file) ;
  } else if (window.URL!=undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file) ;
  } else if (window.webkitURL!=undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file) ;
  }
  return url ;
}

function renderCompanyName(){
  /**
   * 渲染企业名称
   * */
  try{
    $(".render-company-name").text(getUserInfo()["company_name"])
  }catch(err){}
}

//  判断是否登录
function is_login(){
  if( getCookie("hera_sid") && getCookie("user_info")) return getCookie("mobile");
  return false
}

///设置cookie
function setCookie(NameOfCookie, value, expires) {
  //@参数:三个变量用来设置新的cookie:
  //cookie的名称,存储的Cookie值,
  // 以及Cookie过期的时间.
  var ExpireDate = new Date ();
  ExpireDate.setTime(ExpireDate.getTime() + (expires * 1000));
  // 获取根域名
  // 下面这行是用来存储cookie的,只需简单的为"document.cookie"赋值即可.
  // 注意日期通过toGMTstring()函数被转换成了GMT时间。
  document.cookie = NameOfCookie + "=" + escape(value) + "; path=/; domain=" + DOMAIN +
    ((expires == null) ? "" : "; expires=" + ExpireDate.toGMTString());
}

///获取cookie值
function getCookie(NameOfCookie) {
  // 首先我们检查下cookie是否存在.
  // 如果不存在则document.cookie的长度为0
  if (document.cookie.length > 0) {
    // 接着我们检查下cookie的名字是否存在于document.cookie
    // 因为不止一个cookie值存储,所以即使document.cookie的长度不为0也不能保证我们想要的名字的cookie存在
    //所以我们需要这一步看看是否有我们想要的cookie
    //如果begin的变量值得到的是-1那么说明不存在
    var begin = document.cookie.indexOf(NameOfCookie+"=");
    if (begin != -1) {
      // 说明存在我们的cookie.
      begin += NameOfCookie.length+1;//cookie值的初始位置
      var end = document.cookie.indexOf(";", begin);//结束位置
      if (end == -1) end = document.cookie.length;//没有;则end为字符串结束位置
      return unescape(document.cookie.substring(begin, end));
    }
  }
  return null;
  // cookie不存在返回null
}

///删除cookie
function delCookie (NameOfCookie, domain) {
  // 该函数检查下cookie是否设置，如果设置了则将过期时间调到过去的时间;
  //剩下就交给操作系统适当时间清理cookie啦
  if (domain) document.cookie = NameOfCookie + "=null; Domain=" + domain + "; expires=Thu, 01-Jan-70 00:00:01 GMT; Path=/";
  else document.cookie = NameOfCookie + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
}

function require_login(direct) {
  /* 检查是否登录
   * direct 为 true 时，直接跳到登录页，不进行检查
   * */
  if (!direct && getCookie("hera_sid") && getCookie("user_info")) return false;
  window.location.assign("/pages/login.html?next=" + encodeURIComponent(window.location.href));
  return true;
}
$.ajaxSetup({
  cache: false,
  beforeSend: function(xhr, settings) {
    if(settings.context){
      //先消除交互弹框
      $('.mask-box').addClass('hidden');
      if(settings.context.data("is_submit") == true){
        return false;
      }else{
        $('<div class="mask-loading" id="ajax-loading">\
            <img class="loading-img" src="/static/img/loding.gif" alt="" width="128" height="128">\
         </div>').appendTo('body');
        settings.context.data("is_submit", true);
      }
    }
  }
});
$(document).bind("ajaxComplete", function(event, request, settings){
  if(settings.context){
    $('#ajax-loading').remove();
    settings.context.data("is_submit", false);
  }
});
$(document).on('ajaxSuccess',function(event, request){
  var responseJson = {};
  if (request.status == 200)
    try {
      responseJson = JSON.parse(request.responseText);
    } catch(error) {}

  if(responseJson != {} && responseJson.code == ERRORCODE.NOT_LOGIN){
    delCookie("hera_sid", DOMAIN);
    delCookie("user_info", DOMAIN);
    delCookie("audit_status", DOMAIN);
    require_login(true);
  }
});

function getUserInfo(){
  var user_info = getCookie("user_info");
  if(user_info){
    user_info = user_info.replace(/\\054/g, ',');
    user_info = JSON.parse(user_info);
    return JSON.parse(user_info);
  }else{
    return null
  }
}

// 获取query string参数
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function msg_info(msg, type, timeout) {
  if (!type) type = 'info';
  if (!timeout) timeout = 3000;
  var id = (new Date).getTime() + '' + parseInt(Math.random() * 100);
  var msg_html = '<div class="pad margin no-print" id="' + id + '">' +
    '<div class="callout callout-' + type + '" style="margin-bottom: 0!important;">' +
    '<h4><i class="fa fa-info"></i>&nbsp;&nbsp;' + msg + '</h4>' +
    '</div>' +
    '</div>';
  $('.content-header').after(msg_html);
  setTimeout(function () {
    $("#" + id).fadeOut();
  }, timeout);
}

function get_duration(time1, time2){
  var duration = (time2 - time1) / 1000;
  if (duration > 0){
    expire_hour = parseInt(duration / 3600);
    var remain_seonds = duration - 3600 * expire_hour;
    expire_minute = parseInt(remain_seonds / 60);
    expire_second = remain_seonds - 60 * expire_minute;
    return [expire_hour, expire_minute, expire_second]
  }
  return [0, 0, 0]
}

function get_audit_status(refresh){
  var audit_status = getCookie("audit_status");
  if(!audit_status || refresh == 1){  // cookie没有或者需要强制刷新
    $.ajax({
      url : COMPANY_HOST + '/api/hera/company/audit-status/',
      type : 'GET',
      processData: false,
      contentType: false,
      crossDomain: true,
      async: false,//使用同步的方式,true为异步方式
      xhrFields: {
        withCredentials: true
      },
      success : function(data) {
        audit_status = data["company_status"] + "," + data["brand_status"];
        setCookie("audit_status", audit_status);
      }
    });
  }
  if(audit_status){
    return {"company_status": parseInt(audit_status.split(",")[0]), "brand_status": parseInt(audit_status.split(",")[1])}
  }else{
    return {"company_status": "", "brand_status": ""}
  }
}

function getTraceTipsUse(){  // 静态溯源 tips是否主动弹出过
  var traceTips = getCookie("trace_tips");
  if(traceTips){
    return 1
  }else{
    setCookie("trace_tips", 1);
    return 0;
  }
}

function getCompanyTipsUse(){  // 企业信息 tips是否主动弹出过
  var companyTips = getCookie("company_tips");
  if(companyTips){
    return 1
  }else{
    setCookie("company_tips", 1);
    return 0;
  }
}

function no_need_template() {
  //如果页面不需要template模板时，需在页面中加入<div class="hidden" id="not-need-template"></div>
  if($('#not-need-template').length < 1){
    require_login();
    renderCompanyName();
    var audit_status = get_audit_status();
    var html = template('nav', {});
    $("#navbar").append(html);
    try{
      var username = getUserInfo()["user_name"];
    }catch(e){
      var username = "";
    }
    if(audit_status["company_status"] == 10 && audit_status["brand_status"] == 5){
      username = getUserInfo()["company_name"];
    }
    var html = template('header', {
      username: username,
      company_status: audit_status["company_status"],
      brand_status: audit_status["brand_status"],
    });
    $("#header").append(html);
  }
}

function set_meiqia() {
  try {
    //设置美洽
    (function(m, ei, q, i, a, j, s) {
      m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments)
      };
      j = ei.createElement(q),
        s = ei.getElementsByTagName(q)[0];
      j.async = true;
      j.charset = 'UTF-8';
      j.src = '//static.meiqia.com/dist/meiqia.js';
      s.parentNode.insertBefore(j, s);
    })(window, document, 'script', '_MEIQIA');
    _MEIQIA('entId', 49234);
  } catch(error) {}
}

function auditCompayBrandNotPass(msg){
  tipsBombObj = {
    tipsKinds: '认证提示',         // 提示框类型
    tipsText: msg , //提示框文案
    btnLeftUrl: 'javascript:;',   // 左按钮跳转链接
    btnLeftFunction: closeDialog,          // 左按钮触发函数
    btnLeftText: '取消',          // 左按钮文案
    btnRightUrl: '/pages/account/account.html',  // 右按钮跳转链接
    btnRightFunction: '',         // 右按钮触发函数
    btnRightText: '查看',         // 右按钮文案
    btnState: '',                 //非居中btn状态
    closePageText: ''             //倒计时时长
  };
  tipsBombSmall(tipsBombObj);
}

function audit_status_tips(msg){
  var data = get_audit_status();
    // 公司品牌判断
  if(data["company_status"] != 10 || data["brand_status"] != 5){
    auditCompayBrandNotPass('公司或品牌尚未完成实名认证，完成认证后方可'+msg+"。");
  }
  return data;
}

var cropper;

function deal_cropper(width){
  // 图片裁剪
  if (!width) {width = 300;}
  var options = {
    thumbBox: '.thumbBox',
    spinner: '.spinner',
    onloadFunction: loadFunction,
    width: width,
    imgSrc: ''
  };
  cropper = $('.imageBox').cropbox(options);
  function loadFunction(){
    var img = cropper.getDataURL();
    $("img.show-img").attr("src", img);
  }

  $('.upload-file-cropper').on('change', function () {
    var reader = new FileReader();
    reader.onload = function (e) {
      options.imgSrc = e.target.result;
      cropper = $('.imageBox').cropbox(options);
      // $("img.show-img").attr("src", e.target.result);
    };
    if(this.files[0]){
      reader.readAsDataURL(this.files[0]);
    }
  });
  $('#btnCrop').on('click', function () {
    var img = cropper.getDataURL();
    $("img.show-img").attr("src", img);
  });
  $('#btnZoomIn').on('click', function () {
    cropper.zoomIn();
    var img = cropper.getDataURL();
    $("img.show-img").attr("src", img);
  });
  $('#btnZoomOut').on('click', function () {
    cropper.zoomOut();
    var img = cropper.getDataURL();
    $("img.show-img").attr("src", img);
  });
  //图片裁剪end
}

function imgFormCheck(){
  if(!($("#upload-file-img").val() || $("#upload-file").val())){
    $(".img-error-tips").removeClass("hidden");
  }
}

//TODO 有空并到分页插件里面
$("#page_size").on("change", function(){
  var page_size = $("#page_size").val();
  $("#show_list_id").paginator("change_data", [{"page_size": page_size}]);
});


function cutString(str, len) {
 if(str.length*2 <= len) {
  return str;
 }
 var strlen = 0;
 var s = "";
 for(var i = 0;i < str.length; i++) {
  s = s + str.charAt(i);
  if (str.charCodeAt(i) > 128) {
   strlen = strlen + 2;
   if(strlen >= len){
    return s.substring(0,s.length-1) + "..."+ str.substring(str.length-6,str.length);
   }
  } else {
   strlen = strlen + 1;
   if(strlen >= len){
    return s.substring(0,s.length-2) + "..."+ str.substring(str.length-6,str.length);
   }
  }
 };
 return s;
}

function fen_to_yuan(val, fixed_num) {
  if(fixed_num == null){
    fixed_num = 0;
  }
  return Decimal.div(val, 100).toFixed(fixed_num);
};
function yuan_to_fen(val) {
  return Decimal.mul(Number(val).toFixed(2), 100).toNumber();
};
//概率转换 *100
function chance_to_per(val){
  return Decimal.mul(val, 100).toNumber();
}
//概率转换 /100
function chance_to_dec(val){
  return Decimal.div(val, 100).toNumber();
}
//判断
function isIE() { //ie?
  if (!!window.ActiveXObject || "ActiveXObject" in window)
    return true;
  else
    return false;
}

function isNull(val) {
  return val == null || val == undefined || val == '';
}

function b64ImgToBlob(base64) {
  /*base64图片转换为blob*/
  // 解码base64
  var byteString = atob(base64.split(',')[1]);
  var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  // 类型数组
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ia], {
    type: mimeString,
  });
  return {'blob': blob, 'mine': mimeString}
}

function uploadFile(file, callback, is_public, is_base64) {
  /**
   * 上传文件到服务器
   * */
  if(isNull(is_public)){is_public="0";}
  var formData = new FormData();
  formData.append("is_public", is_public);
  if(is_base64){
    var blob_dict = b64ImgToBlob(file);
    formData.append("file", blob_dict.blob, "blob." + blob_dict.mine.split("/")[1]);
  }else{
    formData.append('file', file);
  }
  $.ajax({
    url : COMPANY_HOST + '/api/hera/company/upload_file',
    type : 'POST',
    data : formData,
    processData: false,
    contentType: false,
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    success : function(data) {
      callback(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      noticeMsg("上传图片失败，请重新上传！");
    },
  });
}

function init_ueditor() {
  //ueditor实例化
  ue = UE.getEditor('cms-bar', {
    toolbars: [
      ['undo', 'redo', '|', 'fontsize', '|', 'blockquote', 'horizontal', 'simpleupload', 'drafts'],
      ['bold', 'italic', 'underline', 'forecolor', '|',
      'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
      'insertorderedlist', 'insertunorderedlist']
    ],
    serverUrl: PRODUCT_HOST + '/api/code/ueditor/controller/',
    autoFloatEnabled: true,
    elementPathEnabled: false,
    maximumWords: 20000,
    saveInterval: 30000,  // 30s
    autoHeightEnabled: false,
    initialContent: ''  // 初始内容
  });

  return ue;
}
//活动页面关联商品接口
function getProductId(fun){
  $.ajax({
    url: ACTIVITY_HOST + "/api/activity/project/manager/fetch-project-create-info/",
    timeout : 5000,
    type: "GET",
    crossDomain: true,
    data: {
      status: 10
    },
    xhrFields: {
      withCredentials: true
    },
    success: function (data){
      switch (data.code){
        case ERRORCODE.SUCCESS:
          if(typeof fun == 'function'){
            fun(data);
          }
          var html = template('activity/product_list', data);
          $("#product-list-tpl").html(html);

          break;
        default :
          var tipsBombObj = {
            tipsKinds: '请求失败',
            tipsText: '请刷新页面后重试。',
            btnLeftUrl: 'javascript:;',
            btnLeftFunction: closeDialog,
            btnLeftText: '取消',
            btnRightUrl: "",
            btnRightFunction: "",
            btnRightText: '认证',
            btnState: 'hidden',
            closePageText: 3,
            redirectUrl: ''
          };
          tipsBombSmall(tipsBombObj);
      }
    }
  });
}
/*活动期限 时间选择*/
function activity_period(star_id,end_id){
  var endPackTime;
  $(star_id).datetimepicker({format: 'yyyy-mm-dd hh:ii', language: 'zh-CN', autoclose: true}).on('changeDate',function(ev){
    endPackTime = $(this).val();
    $(star_id).removeClass('error-input');
    $(end_id).removeClass('error-input');
    $('#start-time-error').addClass('hidden');

    if($(end_id).val()){
      if($(star_id).val() > $(end_id).val()){
        $('<span class="error pull-right error-tips">结束时间必须大于开始时间</span>').appendTo('#date-limit');
        $(star_id).addClass('error-input');
        $(end_id).addClass('error-input');
      }
    }

    $(end_id).datetimepicker({format: 'yyyy-mm-dd hh:ii', language: 'zh-CN', autoclose: true, startDate:endPackTime}).on('changeDate',function(ev){
      $(star_id).removeClass('error-input');
      $(end_id).removeClass('error-input');
      $('#end-time-error').addClass('hidden');
    });
  });
};
/*活动期限 修改页面 时间选择*/
function activity_period_modify(star_id,end_id){
  var endPackTime;
  $(star_id).datetimepicker({format: 'yyyy-mm-dd hh:ii', language: 'zh-CN', autoclose: true}).on('changeDate',function(ev){
    endPackTime = $(this).val();
    $(star_id).removeClass('error-input');
    $(end_id).removeClass('error-input');
    $('#start-time-error').addClass('hidden');
    if($(end_id).val()){
      if($(star_id).val() > $(end_id).val()){
        $('<span class="error pull-right error-tips">结束时间必须大于开始时间</span>').appendTo('#date-limit');
        $(star_id).addClass('error-input');
        $(end_id).addClass('error-input');
      }
    }
  });
  $(end_id).datetimepicker({format: 'yyyy-mm-dd hh:ii', language: 'zh-CN', autoclose: true, startDate:moment().format('YYYY-MM-DD HH:mm')}).on('changeDate',function(ev){
    $(star_id).removeClass('error-input');
    $(end_id).removeClass('error-input');
    $('#end-time-error').addClass('hidden');
  });

};

// 页面加载成功后执行，放到文件末尾!!!
$(function (){

  //如果页面不需要template模板
  no_need_template();
  //菜单选中
  select_menu();
  //所有关闭按钮
  $('body').on('click', '.close-btn', function(){
    $(this).closest('.mask-box').addClass('hidden');
  });

  //退出处理
  $('body').on('click', '.logout-btn', function () {
    logout();
  });

  // 设置美洽
  set_meiqia();

  function nav_arrow(){
    if($('#trace').hasClass('active')){
      $('.iconfont.arrow-jiantou').removeClass('icon-qianjin1').addClass('icon-xiangxia');
    }else{
      $('.iconfont.arrow-jiantou').removeClass('icon-xiangxia').addClass('icon-qianjin1');
    }
  }
  nav_arrow();
  //nav 二级菜单箭头
  $('#side-menu li').click(function (){
    nav_arrow();
  });
}); //end of $(function)
