$(document).ready(function () {
    // var needChange = false;         // 是否需要修改的标识

    
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
            $(".submitBtn").removeAttr("style");
        }
    }

    // function validate (ele) {
    //     hasTip = false;
    //     var attr = ele.attr("data-role");
    //     var formTips = (ele.nextAll(".form-tips").length != 0) ? ele.nextAll(".form-tips") : $("#txtAddress").nextAll(".form-tips");
    //     if (attr) {
    //         var role = eval(attr);
    //         var val = ele.val();
    //         if (role && role.length > 0) {
    //             if (!val || val.length == 0 || val == "0") {
    //                 if (!hasTip) {
    //                     formTips.html( (ele.is("select") ? "请选择" : "请输入") + role[0].name ).show();
    //                     hasTip = true;
    //                 }
    //                 return false;
    //             }
    //             if (role[0].reg && !eval(role[0].reg).test(val)) {
    //                 if (!hasTip) {
    //                     formTips.html(role[0].name + "格式不正确，请检查").show();
    //                     hasTip = true;
    //                 }
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }

    function validate (ele) {
        var attr = ele.attr("data-role");
        if (attr) {
            var role = eval(attr);
            var eleValue = ele.val();
            if (role && role.length > 0) {
                if (!eleValue || eleValue.length == 0 || eleValue == "0") {
                    if (!hasTip) {
                        // formTips.html( (ele.is("select") ? "请选择" : "请输入") + role[0].name ).show();
                        alert( (ele.is("select") ? "请选择" : "请输入") + role[0].name )
                        hasTip = true;
                    }
                    return false;
                }
                if (role[0].reg && !eval(role[0].reg).test(eleValue)) {
                    if (!hasTip) {
                        // formTips.html(role[0].name + "格式不正确，请检查").show();
                        alert( role[0].name + "格式不正确，请检查" )
                        hasTip = true;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    $("#submitChange").on("click", function () {
        var catchErr = false,
            changeColumns = $("#personalInfo .column-second");

        changeColumns.each(function () {
            var inputEle = $(this).children("input");
            
            if ($(this).hasClass("changeActive")) {
                var attr = inputEle.attr("data-role");
                if (attr) {
                    var role = eval(attr);
                    if (role && role.length > 0) {
                        if (inputEle.val() == "" || inputEle.val().length == 0) {
                            alert("请填写" + role[0].name)
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
        
        var personInfo = {
            name: $.trim($("#changeName").val()),
            job: $.trim($("#changeJob").val()),
            company: $.trim($("#changeCompany").val()),
            tel: $.trim($("#changeTel").val())
        }

        console.log(personInfo);
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
        $(".info-column").removeClass("changeActive");
        $(".cancelBtn").removeAttr("style");
        $(".changeBtn").css("display", "inline-block");
        alert("提交成功，请等待审核");
        $(this).prop("disabled", true);
    });
});