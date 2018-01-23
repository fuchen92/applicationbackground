$(document).ready(function () {
    // 未分配门票数量
    // var noAllotCount = $("#noallotCount").text(),
    var noAllotCount = 2,
        addAnother = $("#addAnother"),
        submitAllot = $("#submitAllot");

    var noAllotContainer = $("#noallot")
    var hasTip = false;
    
    noAllotCount - 1 <= 0 && addAnother.remove();

    // 添加下一个被分配人
    addAnother.on("click", function () {
        noAllotCount--;
        var tem = $(".addallot-form").eq(0).clone();
        addAnother.parent().before(tem);
        if (noAllotCount - 1 <= 0) {
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
    $(".addallot-form").on("click keyup",":input",function() {
        $(".form-tips").html("").removeAttr("style");
    });
    // 保存分配信息
    submitAllot.on("click", function () {
        var allotUsers = [], catchErr = false;        
        var allotForms = noAllotContainer.children(".addallot-form");

        allotForms.each(function () {
            var inputs = $(this).find(":input");
            inputs.each(function () {
                var currInput = $(this);
                if (!validate(currInput)) {
                    catchErr = true;
                }
            })
        });
    });


    // var arr = [
    //     [0,1,2],
    //     [3,4,5],
    //     [6,7,8]
    // ]
    // $(arr).each(function () {
    //     var currArr = $(this);

    //     currArr.each(function (index, val) {
    //         if (index == 2) {
    //             return false;
    //         }
    //         console.log("下标：" + index, "值：" + val)
    //     })
    // })
});