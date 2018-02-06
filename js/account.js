$(document).ready(function () {
    
    $(".infomenu-item").on("click", function () {
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".accountinfo-item").eq(index).addClass("active").siblings().removeClass("active");
    });

    
    $(".changeBtn").on("click", function () {
        $("#submitChange").prop("disabled", false);
        switchStatus($(this));
        
    });
    $(".cancelBtn").on("click", function () {
        layer.closeAll();
        clearInterval(timer);
        getValicodeBtn.prop("disabled", false).text("发送手机验证码");
        switchStatus($(this));
        if ($("#personalInfo .column-second.changeActive").length == 0) {
            $("#submitChange").prop("disabled", true);
        }
    });

    // 切换修改状态的函数
    function switchStatus(ele) {
        var needChangeEle = ele.closest(".info-group").children(".column-second, .column-third"),
            changeInputs = needChangeEle.find("input");
        
        ele.removeAttr("style").siblings("button").css("display", "inline-block");                
        if (ele.hasClass("changeBtn")) {
            needChangeEle.addClass("changeActive");
        } else {
            needChangeEle.removeClass("changeActive");
            changeInputs.val("");

            $.contains(ele.parent().get(0), ele.siblings(".submitBtn").get(0)) && ele.siblings(".submitBtn").removeAttr("style");
        }
    }

    // 修改联系人信息
    var hasTip = false;
    $("#submitChange").on("click", function () {
        var catchErr = false,
            changeColumns = $("#personalInfo .column-second");

        var tipOption = {
            tips: [1, "#1767EC"],
            time: 1500,
            end: function () { hasTip = false; }
        }

        changeColumns.each(function () {
            var inputEle = $(this).children("input");
            
            if ($(this).hasClass("changeActive")) {
                var attr = inputEle.attr("data-role");
                if (attr) {
                    var role = eval(attr);
                    if (role && role.length > 0) {
                        if (inputEle.val() == "" || inputEle.val().length == 0) {
                            if (hasTip == false) {
                                layer.tips("请填写" + role[0].name, inputEle, tipOption);
                                hasTip = true;
                            }
                            catchErr = true;
                            inputEle.focus();
                            return false;
                        }
                    }
                }
                
            }
        });
        if (catchErr) {
            return false;
        }

        var personInfo = {
            name: $.trim($("#changeName").val()),
            job: $.trim($("#changeJob").val()),
            company: $.trim($("#changeCompany").val()),
            tel: $.trim($("#changeTel").val())
        }

        changeColumns.each(function () {
            var inputEle = $(this).children("input");
            var infoValue = $(this).children(".info-name");
            if (inputEle.val() == "" || inputEle.val().length == 0) {
                return;
            } else {
                infoValue.text(inputEle.val());
                inputEle.attr("placeholder", infoValue.text());
                inputEle.val("");
            }
        });
        $("#personalInfo .info-column").removeClass("changeActive");
        $("#personalInfo .cancelBtn").removeAttr("style");
        $("#personalInfo .changeBtn").css("display", "inline-block");
        layer.closeAll();
        $(this).prop("disabled", true);

        // if ($("#changeName").parent().hasClass("changeActive")) {
            //     needChange = true;
            //     if ($("#changeName").val() == "" || $("#changeName").val().length == 0) {
            //         alert("请填写姓名");
            //         $("#changeName").focus();
            //         return false;
            //     }
            // }
            // if ($("#changeJob").parent().hasClass("changeActive")) {
            //     needChange = true;
            //     if ($("#changeJob").val() == "" || $("#changeJob").val().length == 0) {
            //         alert("请填写职位");
            //         $("#changeJob").focus();
            //         return false;
            //     }
            // }
            // if ($("#changeCompany").parent().hasClass("changeActive")) {
            //     needChange = true;
            //     if ($("#changeCompany").val() == "" || $("#changeCompany").val().length == 0) {
            //         alert("请填写公司");
            //         $("#changeCompany").focus();
            //         return false;
            //     }
            // }
            // if ($("#changeTel").parent().hasClass("changeActive")) {
            //     needChange = true;
            //     if ($("#changeTel").val() == "" || $("#changeTel").val().length == 0) {
            //         alert("请填写电话");
            //         $("#changeTel").focus();
            //         return false;
            //     }
        // }
        
        
    });



    
    var mobileInput = $("#changeMobile"),
        emailInput = $("#changeEmail"),
        valicode = $("#valicode"),
        getValicodeBtn = $("#getValicode");

    var num = 59,
        timer = null;
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
    // 获取手机验证码
    getValicodeBtn.on("click", function () {
        var tipOption = {
            tips: [1, "#1767EC"],
            time: 1500,
            end: function () { hasTip = false; }
        }

        if ($(this).prop("disabled")) {
            return;
        }
        if (mobileInput.val() == "") {
            if (hasTip == false) {
                layer.tips("请填写新的手机号码", mobileInput, tipOption);
                hasTip = true;
            }
            mobileInput.focus();
            return false;
        } else if (!/(^(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$)|(^09\d{8}$)|(^[569]\d{7}$)|(^(66|62)\d{6}$)/.test(mobileInput.val())) {
            if (hasTip == false) {
                layer.tips("手机号码格式不对，请检查", mobileInput, tipOption);
                hasTip = true;
            }
            mobileInput.focus();
            return false;
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
            layer.closeAll();
            $(this).text(num + "s").prop("disabled", true);
            timer = setInterval(function () {
                countdown();
            }, 1000);
        }
    });
    // 修改账户信息（手机，邮箱）
    $("#securityInfo .submitBtn").on("click", function () {
        validate($(this));
    })

    function validate (btnEle) {
        var btn = btnEle.get(0),
            changeColumn = btnEle.closest(".info-group").children(".column-second, .column-third"),
            changeMobileEle = mobileInput.prev(".info-name"),
            changeEmailEle = emailInput.prev(".info-name");

        var tipOption = {
            tips: [1, "#1767EC"],
            time: 1500,
            end: function () { hasTip = false; }
        }
        
        if (changeColumn.hasClass("changeActive")) {
            switch (btn.id) {
                case "submitMobile":
                    if (mobileInput.val() == "" || mobileInput.length == 0) {
                        if (hasTip == false) {
                            layer.tips("请填写新的手机号码", mobileInput, tipOption);
                            hasTip = true;
                        }
                        mobileInput.focus();
                        return false;
        
                    } else if (!/(^(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$)|(^09\d{8}$)|(^[569]\d{7}$)|(^(66|62)\d{6}$)/.test(mobileInput.val())) {
                        if (hasTip == false) {
                            layer.tips("手机号码格式不正确，请检查", mobileInput, tipOption);
                            hasTip = true;
                        }
                        mobileInput.focus();
                        return false;
                    }
                    if (valicode.val() == "" || valicode.val().length == 0) {
                        layer.tips("请填写验证码", valicode, tipOption);
                        valicode.focus();
                        return false;
                    } else if ( !/^\d{6}$/.test( $.trim(valicode.val()) ) ) {
                        if (hasTip == false) {
                            layer.tips("验证码是6位数字哦。", valicode, tipOption);
                            hasTip = true;
                        }
                        valicode.focus();
                        return false;
                    }
                    var changeMobileObj = {
                        mobile: $.trim(mobileInput.val()),
                        valicode: $.trim(valicode.val())
                    }
                    
                    changeMobileEle.text(mobileInput.val());
                    mobileInput.val("");
                    valicode.val("");
                    num = 59;
                    clearInterval(timer);
                    getValicodeBtn.prop("disabled", false).text("发送手机验证码");
                    layer.closeAll();
                    break;
                case "submitEmail":
                    if (emailInput.val() == "" || emailInput.val().length == 0) {
                        if (hasTip == false) {
                            layer.tips("请填写邮箱", emailInput, tipOption);
                            hasTip = true;
                        }
                        emailInput.focus();
                        return false;
                    } else if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(emailInput.val())) {
                        if (hasTip == false) {
                            layer.tips("邮箱格式不正确，请检查", emailInput, tipOption);
                            hasTip = true;
                        }
                        emailInput.focus();
                        return false;
                    }
                    var changeEmailObj = {
                        email: $.trim(emailInput.val())
                    }
                    changeEmailEle.text(emailInput.val());
                    emailInput.val("");
                    layer.closeAll();
                    break;
            }
            changeColumn.removeClass("changeActive");
            btnEle.removeAttr("style").prev(".cancelBtn").removeAttr("style");
            btnEle.prevAll(".changeBtn").css("display", "inline-block");
        } else {
            return false;
        }
    }

});