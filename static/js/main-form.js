//--成功提示页面
var tipsTextObj = {
    imgUrl: '/static/img/tips-icon.png',          // 提示页面的提示背景图
    imgWidth: 82,                                 // 提示图片的宽度
    imgHeight: 82,                                // 提示图片的高度
    firstText: '恭喜，登录密码找回成功！',         // 提示文案（较深字体）
    secondText: '您的注册手机号为：123****5598',   // 提示文案（较浅字体）
    buttonUrl: '/pages/index.html',               // 按钮的跳转链接
    buttonText: '立即登录',                       // 按钮文案
    buttonRadius: 'has-radius'                    // 按钮是否为圆角状态 默认有圆角 没有圆角时该字段为空-->''
};
function tipsBomb(tipsTextObj){
    if(tipsTextObj.secondText == ''){
        tipsTextObj.secondTextState = 'hidden';
    }
    return '<div class="form-tips-box">\
            <img src='+tipsTextObj.imgUrl+' alt="img" class="center-block" width='+tipsTextObj.imgWidth+' height='+tipsTextObj.imgHeight+'>\
            <p class="first-tips-text text-center">'+tipsTextObj.firstText+'</p>\
            <p class="second-tips-text text-center '+tipsTextObj.secondTextState+'">'+tipsTextObj.secondText+'</p>\
            <a href='+tipsTextObj.buttonUrl+' class="success-url text-center center-block '+tipsTextObj.buttonRadius+'">'+tipsTextObj.buttonText+'</a>\
          </div>'
}

