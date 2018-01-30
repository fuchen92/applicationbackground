$(document).ready(function () {
    var mobileInput = $("#mobile"),
        validateInput = $("#valicode"),
        autologin = $("#autologin"),
        tips = $("#tips");

    var getValicodeBtn = $("#getValicode"),
        loginBtn = $("#loginBtn"),
        autoLoginBtn = $("#autologin");

    var num = 59,
        timer = null,
        isAutoLogin = false;

    

    mobileInput.on("input", function () {
        tips.removeAttr("style");
    });
    validateInput.on("input", function () {
        tips.removeAttr("style");
    });

    autoLoginBtn.on("click", function () {
        $(this).prop("checked") ? isAutoLogin = true : isAutoLogin = false;
    });


    // 获取手机验证码
    getValicodeBtn.on("click", function () {
        if ($(this).prop("disabled")) {
            return;
        }
        if (mobileInput.val() == "") {
            tips.text("手机号码不能为空").css("display", "block");
            mobileInput.focus();
        } else if (!/(^(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$)|(^09\d{8}$)|(^[569]\d{7}$)|(^(66|62)\d{6}$)/.test(mobileInput.val())) {
            tips.text("手机号码格式不对哟").css("display", "block");
        } else {
            // 请求获取登录验证码
            // $.ajax({
            //     type: "POST",
            //     url: "/NetWorking/ApiSendCode",
            //     data: { mobile: mobileInput.val() },
            //     dataType: "json",
            //     success: function (data) {
            //         if (data.Code == 0) {
            //             valicodeMobile.css("display", "block");
            //             getValicode.css("display", "none");
            //             validateTips.css("display", "none");
            //             signInMobile.css("display", "block");
            //             sendValicode.text(num + "s");
            //             timer = setInterval(function () {
            //                 countdown();
            //             }, 1000);
            //         } else {
            //             alert(data.Message);
            //         }
            //     }
            // });

            $(this).text(num + "s").prop("disabled", true);
            timer = setInterval(function () {
                countdown();
            }, 1000);
        }
    });

    // 倒计时
    function countdown() {
        num--;
        if (num <= 0) {
            num = 59;
            getValicodeBtn.prop("disabled", false).text("重新发送");
            clearInterval(timer);
            timer = null;
            return;
        }
        getValicodeBtn.text(num + "s").prop("disabled", true);
    }

    loginBtn.on("click", function () {
        
    });
    
    // 登录按钮
    loginBtn.on("click", function () {
        if (mobileInput.val() == "") {
            tips.text("手机号码不能为空").css("display", "block");
            mobileInput.focus();
            return false;
        } else if (!/(^(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$)|([0][9]\d{8}$)|(([6|9])\d{7}$)|([6]([8|6])\d{5}$)/.test(mobileInput.val())) {
            tips.text("手机号码格式不对哟").css("display", "block");
            mobileInput.focus();
            return false;
        }
        if (validateInput.val() == "") {
            tips.text("请填写验证码").css("display", "block");
            validateInput.focus();
            return false;
        } else if (!/\d{6}/.test(validateInput.val())) {
            tips.text("验证码是6位数字").css("display", "block");
            validateInput.focus();
            return false;
        }
        tips.removeAttr("style");
        // $.ajax({
        //     type: "POST",
        //     url: "/NetWorking/ApiLogin",
        //     data: { mobile: mobileInput.val(), code: validateInput.val() },
        //     dataType: "json",
        //     success: function (data) {
        //         if (data.Code == 0) {
        //             alert("登陆成功");
        //         } else {
        //             alert(data.Message);
        //         }
        //     }
        // });
        alert("恭喜你登录成功")
    });
});