$(document).ready(function () {
    var addInvoice = $("#addInvoice"),              // 添加发票信息的整体容器
        invoicePanel = $("#invoicePanel");          // 发票信息面板


    var invoiceForm = $("#invoiceForm"),            // 发票表单容器
        invoiceType = $("#invoiceType"),            // 发票类型
        invoiceContent = $("#invoiceContent"),      // 发票内容
        province = $("#province"),                  // 发票邮寄省份
        city = $("#city"),                          // 城市
        postCode = $("#postCode");                  // 邮政编码

    var submitInvoice = $("#submitInvoice"),
        changeInvoiceBtn = $("#changeInvoiceBtn");


    var allInputs = invoiceForm.find(":input"),
        inputs = invoiceForm.find(":input:not(select)"),
        selects = invoiceForm.find("select:not(#invoiceType)");
        canDisableInputs = invoiceForm.find(".candisable");

    var isNeedInvoice = true,                       // 是否需要发票
        isChange = false;                           // 是在第一次填写的状态还是在修改的状态

    var invoiceTable = $("#invoiceTable"),
        invoiceVals = invoiceTable.find(".invoice-itemval");

    console.log(allInputs)
    console.log(invoiceVals)
    // 不需要发票
    invoiceType.change(function () {
        var currVal = $(this).val();
        switch (currVal) {
            case "0":
                isNeedInvoice = false;
                inputs.val("").prop("disabled", true);
                selects.val(0).prop("disabled", true);
                submitInvoice.prop("disabled", true);
                break;
            case "1":
                isNeedInvoice = true;
                isChange ? inputs.prop("disabled", false) : inputs.val("").prop("disabled", false);
                isChange ? selects.prop("disabled", false) : selects.val(0).prop("disabled", false);
                canDisableInputs.prop("disabled", true).css("display", "none").closest(".form-group").addClass("hide");
                submitInvoice.prop("disabled", false);
                break;
            case "2":
                isNeedInvoice = true;
                allInputs.prop("disabled", false).removeAttr("style").closest(".form-group").removeClass("hide");
                isChange ? null : inputs.val("");
                isChange ? null : selects.val(0);
                submitInvoice.prop("disabled", false);
                break;
        }
        
    });

    // province.on("change", function () {
        // 	var vl = parseInt($(this).val());
        // 	if (vl == 0) {
        // 		invoiceCity.find("option").remove().end().append("<option value='0'>城市</option>");
        // 	} else {
        // 		$.post("/Api/GetCityList", { parentId: vl }, function (json) {
        // 			if (json.Code == 0) {
        // 				var opts = "";
        // 				for (var i = 0; i < json.Data.length; i++) {
        // 					opts += '<option value="' + json.Data[i].Id + '"data-zip="' + json.Data[i].PostCode + '">' + json.Data[i].Name + '</option>';
        // 				}
        // 				invoiceCity.find("option").remove().end().append(opts);
        // 				postCode.val(invoiceCity.children(":selected").attr("data-zip"));
        // 			}
        // 		}, "json");
        // 	}
        // });
        // city.on("change", function () {
        // 	postCode.val($(this).children(":selected").attr("data-zip"));
    // }).change();

    invoiceForm.on("click keyup",":input",function() {
        $(".form-tips").html("").removeAttr("style");
    });

    var catchErr = false,
        hasTip = false;
    
    // 验证函数
    function validate (ele) {
        hasTip = false;
        var attr = ele.attr("data-role");
        var formTips = ele.next(".form-tips");
        if (attr && isNeedInvoice) {
            var role = eval(attr);
            var currVal = ele.val();
            if (role && role.length > 0 && !ele.prop("disabled")) {
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


    // 提交发票信息
    submitInvoice.on("click", function () {
        var invoiceInfo = {},
            changedInvoice = [];
        
        catchErr = false;

        allInputs.each(function () {
            var currInput = $(this);
            var inputVal = "";
            if (!validate(currInput)) {
                catchErr = true;
                currInput.focus();
                return false;
            } else {
                if (currInput.is("input[type=text]") && currInput.prop("disabled")) {
                    inputVal = "无";
                } else {
                    inputVal = currInput.val();
                }
                changedInvoice.push({
                    "invoiceLabel": currInput.is("select") ? currInput.children(":selected").text() : inputVal
                })
            }
        })

        if (catchErr) {
            return false;
        }
        invoiceVals.each(function (index, item) {
            var _this = $(item);
            if (index < 8) {
                _this.text(changedInvoice[index].invoiceLabel)
            } else if (index == 8) {
                _this.text(changedInvoice[8].invoiceLabel + changedInvoice[9].invoiceLabel + changedInvoice[10].invoiceLabel);
                return;
            }
        });
        invoiceInfo = {
            invoiceType: $("#invoiceType").val(),
            invoiceContent: $("#invoiceContent").val(),
            invoiceTitle: $.trim(allInputs.eq(2).val()),
            invoiceId: $.trim(allInputs.eq(3).val()),
            companyAddr: $.trim(allInputs.eq(4).val()),
            companyTel: $.trim(allInputs.eq(5).val()),
            bankName: $.trim(allInputs.eq(6).val()),
            bankAccount: $.trim(allInputs.eq(7).val()),
            province: $("#province").val(),
            city: $("#city").val(),
            street: $.trim(allInputs.eq(10).val()),
            postCode: $("#postCode").val()
        }
        invoiceTable.attr("data-invoicetype", $("#invoiceType").val());
        invoiceTable.attr("data-invoicecontent", $("#invoiceContent").val());
        invoiceTable.attr("data-province", $("#province").val());
        invoiceTable.attr("data-city", $("#city").val());
        invoiceTable.attr("data-street", $.trim(allInputs.eq(10).val()));
        invoiceTable.attr("data-postcode", $.trim(allInputs.eq(11).val()));
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

        inputs.val("");
        selects.val(0);
        addInvoice.css("display", "none");
        invoicePanel.removeAttr("style");
        console.log("提交成功啦")
    });

    // 修改发票信息
    changeInvoiceBtn.on("click", function () {
         
        var invoiceType = invoiceTable.attr("data-invoicetype"),
            invoiceContent = invoiceTable.attr("data-invoicecontent"),
            invoiceProvince = invoiceTable.attr("data-province"),
            invoiceCity = invoiceTable.attr("data-city"),
            invoiceStreet = invoiceTable.attr("data-street"),
            postCode = invoiceTable.attr("data-postcode");

        var invoiceInfo = [];

        isChange = true;

        submitInvoice.text("确认修改");

        invoiceVals.each(function (index, item) {
            var _this = $(item);
            if (index < 8) {
                invoiceInfo.push($.trim(_this.text()));
            }            
        });
        invoiceInfo.push(invoiceProvince, invoiceCity, invoiceStreet, postCode);

        for (var i = 0; i < invoiceInfo.length; i++) {
            if (i == 0 || i == 1 || i == 8 || i == 9) continue;
            if (invoiceInfo[i] == "无") {
                allInputs.eq(i).val("");
            } else {
                allInputs.eq(i).val(invoiceInfo[i])
            }
        }   
        
        $("#invoiceType option[value=" + invoiceType + "]").prop("selected", true);
        $("#invoiceContent option[value=" + invoiceContent + "]").prop("selected", true);
        $("#province option[value=" + invoiceProvince + "]").prop("selected", true);
        $("#city option[value=" + invoiceCity + "]").prop("selected", true);
        $("#street").val(invoiceStreet);
        $("#postCode").val(postCode);
        addInvoice.removeAttr("style");
        invoicePanel.css("display", "none");
        console.log("1111")
    });
});