$(document).ready(function () {
    var allotTable = $("#allotTable"),
        changeDialog = $("#changeDialog"),
        closeDialog = $("#closeDialog");

    var inputs = $("#changeForm :input"),
        submitChangeAllot = $("#submitChangeAllot");

    var changeTR = null,
        changeIndex = 0;            // 修改的是哪一个参会人信息的下标

    var changedInfo = [];           // 保存修改后的信息

    var hasTip = false;
    // 验证函数
    function validate (ele) {
        hasTip = false;
        var attr = ele.attr("data-role");
        var formTips = ele.next(".form-tips");
        if (attr) {
            var role = eval(attr);
            var currVal = ele.val();
            if (role && role.length > 0) {
                if (!currVal || currVal.length == 0 || currVal == "0") {
                    if (!hasTip) {
                        formTips.html( (ele.is("select") ? "请选择" : "请输入") + role[0].name ).show();
                        hasTip = true;
                    }
                    return false;
                }
                if (role[0].reg && !eval(role[0].reg).test(currVal)) {
                    if (!hasTip) {
                        formTips.html(role[0].name + "格式不正确，请检查").show();
                        hasTip = true;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // 修改参会人员信息
    allotTable.on("click", ".changeBtn", function () {
        changeTR = $(this).closest("tr");
        changeIndex = changeTR.index(".alloted");
        var originalInfo = [
                changeTR.children(".nameCN").text(),
                changeTR.attr("data-nameen"),
                changeTR.children(".companyCN").text(),
                changeTR.attr("data-companyen"),
                changeTR.children(".jobCN").text(),
                changeTR.attr("data-joben"),
                changeTR.children(".mobile").text(),
                changeTR.attr("data-tel"),
                changeTR.children(".email").text(),
                changeTR.attr("data-industry"),
                changeTR.attr("data-function"),
                changeTR.attr("data-sex")
            ];

        inputs.each(function (index, item) {
            var currItem = $(item);
            if (index < 9) {
                currItem.val($.trim(originalInfo[index]))
            } else {
                return;
            }
        });
        $("#changeIndustry").val(originalInfo[9]);
        $("#changeFunction").val(originalInfo[10]);
        $("#changeSex").val(originalInfo[11]);
        changeDialog.css("display", "block");
    });

    // 关闭对话框
    closeDialog.on("click", function () {
        changeDialog.find(":input:not(select)").val("");
        changeDialog.find("select").val(0);
        changeDialog.find(".form-tips").removeAttr("style");
        changeDialog.removeAttr("style");
    });

    changeDialog.on("click keyup",":input",function() {
        $(".form-tips").html("").removeAttr("style");
    });

    var catchErr = false;
    // 保存修改的参会人信息
    submitChangeAllot.on("click", function () {
        var mobileArr = [],
            emailArr = [];

        var allotedsTR = allotTable.find(".alloted");

        changedInfo = [];
        catchErr = false;

        inputs.each(function () {
            var currInput = $(this);
            if (!validate(currInput)) {
                catchErr = true;
                currInput.focus();
                return false;
            } else {
                changedInfo.push(currInput.val())
            }
        });
        if (catchErr) {
            return false;
        }
        
        allotedsTR.each(function (index, item) {
            var currItem = $(item);
            if (index != changeIndex) {
                mobileArr.push( $.trim( currItem.find(".mobile").text() ) );
                emailArr.push( $.trim( currItem.find(".email").text() ) )
            }
        });
        mobileArr.push( $.trim( $("#changeMobile").val() ) );
        emailArr.push( $.trim( $("#changeEmail").val() ) );

        valiRepeat(mobileArr, $("#changeMobile"), "手机号码");
        if (catchErr) {
            return false;
        }
        valiRepeat(emailArr, $("#changeEmail"), "邮箱地址");
        if (catchErr) {
            return false;
        }

        changeTR.attr("data-nameen", changedInfo[1]);
        changeTR.attr("data-companyen", changedInfo[3]);
        changeTR.attr("data-joben", changedInfo[5]);
        changeTR.attr("data-tel", changedInfo[7]);
        changeTR.attr("data-industry", changedInfo[9]);
        changeTR.attr("data-function", changedInfo[10]);
        changeTR.attr("data-sex", changedInfo[11]);

        changeTR.children(".nameCN").text(changedInfo[0]);
        changeTR.children(".sex").text( $("#changeSex option[value=" + changedInfo[11] + "]").text() == "先生" ? "男" : "女" );
        changeTR.children(".companyCN").text(changedInfo[2]);
        changeTR.children(".jobCN").text(changedInfo[4]);
        changeTR.children(".mobile").text(changedInfo[6]);
        changeTR.children(".email").text(changedInfo[8]);
        
        console.log(changeTR[0]);
        console.log("修改成功啦")
        closeDialog.trigger("click");

        // $.ajax({
        //     url: "OrderCreate",
        //     type: "POST",
        //     dataType: "json",
        //     contentType: "application/json; charset=utf-8",
        //     data: JSON.stringify({ "order": order }),
        //     cache: false,
        //     success: function (js) {
        //         if (js.Code == 0) {
        //             alert("提交成功")
        //         } else {
        //             alert("提交失败，请稍后再试")
        //         }
        //     },
        //     error: function (error) {
        //         console.log(error)
        //     }
        // });
    });

    // 验证手机和邮箱重复的函数
    function valiRepeat (objArr, elem, type) {
        for (var i = 0; i < objArr.length; i++) {
            var objValue = objArr[i];
            for (var j = 0; j < objArr.length; j++) {
                if (objArr[j] == objValue && j != i) {
                    if (elem[0].id == "changeMobile" || elem[0].id == "changeEmail") {
                        $(elem[0]).focus();
                        $(elem[0]).next(".form-tips").text(type + "重复，请检查").show();
                    } else {
                        elem.eq(j).focus();
                        elem.eq(j).next().text(type + "重复，请检查").show();
                    }
                    
                    catchErr = true;
                    return false;
                }
            }
            if (catchErr) {
                return false;
            }
        }
    }
});