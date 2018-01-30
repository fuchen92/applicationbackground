$(document).ready(function () {
    var allotedContainer = $("#alloted");

    var noAllotCount = Number($("#noallotCount").text()),               // 未分配数量
        alreadyAllotCount = Number($("#alreadyAllot").text()),          // 已分配数量
        addAnother = $("#addAnother"),
        submitAllot = $("#submitAllot");

    var noAllotContainer = $("#noallot")
    var hasTip = false;
    
    noAllotCount - 1 <= 0 && addAnother.remove();

    // 添加下一个被分配人
    var canAddCount = noAllotCount;
    addAnother.on("click", function () {
        canAddCount--;
        var tem = $(".addallot-form").eq(0).clone();
        tem.find(":input[type=text]").val("");
        tem.find("select").val(0);
        tem.find(".form-tips").removeAttr("style");
        addAnother.parent().before(tem);
        if (canAddCount - 1 <= 0) {
            addAnother.remove();
        }
    });

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
    $("#noallot, #changeDialog").on("click keyup",":input",function() {
        $(".form-tips").html("").removeAttr("style");
    });

    // var isRepeat = false;  
    var catchErr = false;  
    // 保存分配信息
    submitAllot.on("click", function () {
        var allotUsers = [];

        var allotForms = noAllotContainer.children(".addallot-form");

        var mobileArr = [],
            emailArr = [];

        catchErr = false;

        allotForms.each(function () {
            var inputs = $(this).find(":input");
            inputs.each(function () {
                var currInput = $(this);
                if (!validate(currInput)) {
                    catchErr = true;
                    currInput.focus();
                    return false;
                }
            })
            if (catchErr) {
                return false;
            }
            allotUsers.push({
                NameCn: $.trim(inputs.eq(0).val()),
                NameEn: $.trim(inputs.eq(1).val()),
                CompanyCn: $.trim(inputs.eq(2).val()),
                CompanyEn: $.trim(inputs.eq(3).val()),
                JobTitleCn: $.trim(inputs.eq(4).val()),
                JobTitleEn: $.trim(inputs.eq(5).val()),
                Mobile: $.trim(inputs.eq(6).val()),
                Tel: $.trim(inputs.eq(7).val()),
                Mail: $.trim(inputs.eq(8).val()),
                Industry: $.trim(inputs.eq(9).val()),
                JobFunction: $.trim(inputs.eq(10).val()),
                Sex: $.trim(inputs.eq(11).val()),
            })
        });
        if (catchErr) {
            return false;
        }
        

        $(".mobile").each(function () {
            var currVal = $(this).is("input") ? $.trim($(this).val()) : $(this).text()
            mobileArr.push(currVal)
        })
        $(".email").each(function () {
            var currVal = $(this).is("input") ? $.trim($(this).val()) : $(this).text()
            emailArr.push(currVal)
        })
        valiRepeat(mobileArr, $(".mobile"), "手机号码");
        if (catchErr) {
            return false;
        }
        valiRepeat(emailArr, $(".email"), "邮箱地址");
        if (catchErr) {
            return false;
        }
        
        var order = { UserList: allotUsers };
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
        generateAlloted(allotUsers);
        noAllotCount -= allotUsers.length;
        noAllotCount - 1 <= 0 && addAnother.remove();
        if (noAllotCount < 0) {
            noAllotCount = 0;
        }
        alreadyAllotCount += allotUsers.length;
        $(".noallot-count").eq(0).text(noAllotCount);
        $(".noallot-count").eq(1).text(noAllotCount);
        $(".already-allot").eq(0).text(alreadyAllotCount);
        $(".already-allot").eq(1).text(alreadyAllotCount);
        noAllotCount - allotUsers.length < 0 && $("#noallotWrapper").remove();
        console.log(noAllotCount)
        // alert("提交成功啦")
        noAllotContainer.find(":input[type=text]").val("");
        noAllotContainer.find("select").val(0);
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

    // 生成已分配信息
    function generateAlloted (objArr) {
        var str = "";
        for (var i = 0; i < objArr.length; i++) {
            str += "<ul class='alloted' data-industry='" + objArr[i].Industry + "'data-function='" + objArr[i].JobFunction + "'data-sex='" + objArr[i].Sex + "'>" + 
                        "<li class='alloted-item'>" +
                            "<span class='allot-name allotVal'>" + objArr[i].NameCn +"</span>" +
                            "<b class='divide'></b>" + 
                            "<span class='allot-nameEN allotVal'>" + objArr[i].NameEn + "</span>" +
                        "</li>" +
                        "<li class='alloted-item'>" + 
                            "<span class='allot-company allotVal'>" + objArr[i].CompanyCn + "</span>" + 
                            "<b class='divide'></b>" + 
                            "<span class='allot-companyEN allotVal'>" + objArr[i].CompanyEn + "</span>" + 
                        "</li>" +
                        "<li class='alloted-item'>" + 
                            "<span class='allot-job allotVal'>" + objArr[i].JobTitleCn + "</span>" + 
                            "<b class='divide'></b>" + 
                            "<span class='allot-jobEN allotVal'>" + objArr[i].JobTitleEn + "</span>" + 
                        "</li>" +
                        "<li class='alloted-item'>" + 
                            "<span class='allot-industry allotVal'>" + $(".allot-select").eq(0).children("option[value=" + objArr[i].Industry + "]").text() + "</span>" + 
                            "<b class='divide'></b>" + 
                            "<span class='allot-function allotVal'>" + $(".allot-select").eq(1).children("option[value=" + objArr[i].JobFunction + "]").text() + "</span>" + 
                            "<b class='divide'></b>" + 
                            "<span class='allot-sex allotVal'>" + $(".allot-select").eq(2).children("option[value=" + objArr[i].Sex + "]").text() + "</span>" +
                        "</li>" +
                        "<li class='alloted-item'>" + 
                            "<span class='allot-mobile mobile allotVal'>" + objArr[i].Mobile + "</span>" + 
                            "<b class='divide'></b>" + 
                            "<span class='allot-tel tel allotVal'>" + objArr[i].Tel + "</span>" + 
                            "<b class='divide'></b>" + 
                            "<span class='allot-email email allotVal'>" + objArr[i].Mail + "</span>" + 
                            "<button class='changeAllotBtn rt'>修改</button>" +
                        "</li>" +
                    "</ul>"
        }
        allotedContainer.append(str)
    }


    var changeDialog = $("#changeDialog"),
        submitChangeAllot = $("#submitChangeAllot");

    var allotIndex = 0;                 // 修改的是哪一个分配信息的下标

    var changeLis = changeDialog.find(".form-group");
    // 修改分配信息
    allotedContainer.on("click", ".changeAllotBtn", function () {
        
        var alloted = $(this).closest(".alloted");
        var lis = alloted.children("li");

        allotIndex = alloted.index(".alloted");
        console.log(allotIndex)

        lis.each(function (index, item) {
            var item = $(item);
            var allotVals = item.children(".allotVal");
            
            if (index < 3) {
                allotVals.each(function (idx) {
                    changeLis.eq(index).find(":input").eq(idx).val(item.children(".allotVal").eq(idx).text())
                })
                return;
            }
            
        });

        $("#changeMobile").val(lis.eq(4).find(".mobile").text());
        $("#changeTel").val(lis.eq(4).find(".tel").text());
        $("#changeEmail").val(lis.eq(4).find(".email").text());

        // $("#changeIndustry option[value=" + alloted.attr("data-industry") + "]").prop("selected", true);
        $("#changeIndustry").val(alloted.attr("data-industry"));

        // $("#changeFunction option[value=" + alloted.attr("data-function") + "]").prop("selected", true);
        $("#changeFunction").val(alloted.attr("data-function"));

        // $("#changeSex option[value=" + alloted.attr("data-sex") + "]").prop("selected", true);
        $("#changeSex").val(alloted.attr("data-sex"));
        
        changeDialog.css("display", "block");
    });
    $(".changeAllot-close").on("click", function () {
        changeDialog.find(".form-tips").removeAttr("style");
        changeDialog.find(":input:not(select)").val("");
        changeDialog.find("select").val(0);
        changeDialog.removeAttr("style");
    });

    // 保存修改的分配信息
    submitChangeAllot.on("click", function () {
        var inputs = changeDialog.find(":input:not(button)"),
            changedInfo = {};

        var mobileArr = [],
            emailArr = [];

        var alloteds = allotedContainer.children(".alloted"),
            alloted = alloteds.eq(allotIndex),
            lis = alloted.children("li");

        catchErr = false;

        inputs.each(function () {
            var currInput = $(this);
            if (!validate(currInput)) {
                catchErr = true;
                currInput.focus();
                return false;
            }
        });
        if (catchErr) {
            return false;
        }

        alloteds.each(function (index, item) {
            var currItem = $(item);
            if (index != allotIndex) {
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

        lis.each(function (index, item) {
            var item = $(item);
            var allotVals = item.children(".allotVal");
            
            if (index < 3) {
                allotVals.each(function (idx) {
                    lis.eq(index).find(".allotVal").eq(idx).text( $.trim( changeLis.eq(index).find(":input").eq(idx).val() ) )
                })
                return;
            }
        });
        lis.eq(3).find(".allot-industry").text($("#changeIndustry option:selected").text());
        lis.eq(3).find(".allot-function").text($("#changeFunction option:selected").text());
        lis.eq(3).find(".allot-sex").text($("#changeSex option:selected").text());

        lis.eq(4).find(".mobile").text( $.trim($("#changeMobile").val()) )
        lis.eq(4).find(".tel").text( $.trim($("#changeTel").val()) )
        lis.eq(4).find(".email").text( $.trim($("#changeEmail").val()) )

        alloted.attr("data-industry", $("#changeIndustry").val());
        alloted.attr("data-function", $("#changeFunction").val());
        alloted.attr("data-sex", $("#changeSex").val());

        $(".changeAllot-close").trigger("click");

        // alert("修改成功啦")
        
    });
});