$(function () {
    var $addSpecBtn = $('.js-addSpec');//添加规格值按钮
    var $createSpecTableBtn = $('.js-createSpecTable');//更新规格详细表
    var $fvWrapper = $('.js-fvWrapper');//商品规格表的父元素
    var isSpecChoose = false; //是否有未选择的规格
    var $submitBtn = $('.js-submitBtn');//提交按钮
    var $spec = $('.js-spec');//生成的表格插入到这个dom的同级后面

    var arrSpec = [];//详细规格表格提交数组
    var submitData = {};//表单提交数据


    //添加规格名的输入框
    $addSpecBtn.on('click', function () {
        var str = '';
        str += '<div class="fv-specList">';
        str += '    <div class="fv-specName clearfix">';
        str += '        <div class="pull-left fv-specName_name">规格名：</div>';
        str += '        <input class="form-control pull-left fv-specName_input" type="text" placeholder="规格名">';
        str += '        <button type="button" class="close fv-specName_close">';
        str += '            <span>&times;</span>';
        str += '        </button>';
        str += '    </div>';
        str += '    <div class="fv-specValue clearfix">';
        str += '        <div class="pull-left fv-specValue-name">规格值：</div>';
        str += '        <div class="pull-left fv-specValue-content">';
        str += '            <div class="clearfix js-specValWrapper">';
        str += '                <button type="button" class="btn btn-link fv-specName_btn hidden js-addSpecValue">添加规格值</button>';
        str += '            </div>';
        str += '        </div>';
        str += '    </div>';
        str += '</div>';

        $fvWrapper.append(str);
    });

    //添加规格值按钮显示判断
    $fvWrapper.on('keyup', '.fv-specName_input', function () {
        var $specValBtnDom = $(this).parents('.fv-specName').siblings('.fv-specValue').find('.js-addSpecValue');
        var $specValDom = $(this).parents('.fv-specName').siblings('.fv-specValue').find('.fv-specValue_inputWrapper');

        if ($(this).val() !== '' && $specValDom.lengh !== 0) {
            $specValBtnDom.removeClass('hidden');
        } else {
            $specValBtnDom.addClass('hidden');
        }
    });

    //添加规格值的输入框
    $fvWrapper.on('click', '.js-addSpecValue', function () {
        var $specValWrapper = $('.js-specValWrapper');
        var $specValCloseBtn = $specValWrapper.find('.close');

        var str = '';
        str += '<div class="pull-left fv-specValue_inputWrapper">';
        str += '    <input type="text" class="form-control input-sm fv-specValue_input">';
        str += '    <button type="button" class="close js-specVal_close">';
        str += '        <span>&times;</span>';
        str += '    </button>';
        str += '</div>';
        $(this).before(str);
    });

    //规格值删除
    $fvWrapper.on('click', '.js-specVal_close', function () {
        $(this).parent('.fv-specValue_inputWrapper').remove();
    });

    //规格名删除
    $fvWrapper.on('click', '.fv-specName_close', function () {
        $(this).parents('.fv-specList').remove();
    });

    //创建规格明细表格
    $createSpecTableBtn.on('click', function () {
        arrSpec = [];//初始化获得数据，不然会叠加
        createTable();

    });

    //设置表格价格和库存
    $(document).on('click', '.input-group-btn', function () {
        $('.js-specPrice').val($(this).parents('.input-group').find('.form-control').val());
    });
    $(document).on('click', '.js-setSpecCount', function () {
        $('.js-specCount').val($(this).parents('.input-group').find('.form-control').val());
    });

    //取得表格数据
    $submitBtn.on('click', function () {
        var specPrice = $('.js-specPrice');
        var specCount = $('.js-specCount');
        var $specTr = $('.fv-wrapper-right').find('tbody').find('tr');

        //判断是否输入价格 库存
        if (specPrice.val() == '') { alert('请填写价格'); return; }
        if (specCount.val() == '') { alert('请填写库存'); return; }

        for (var i = 0; i < $specTr.length; i++) {
            arrSpec[i].price = $specTr.eq(i).find('.js-specPrice').val();
            arrSpec[i].count = $specTr.eq(i).find('.js-specCount').val();
        }
        submitData.spec_data = arrSpec;
        console.log(submitData);

    })

    //生成表格函数
    function createTable() {
        var $specName = $('.fv-specName_input');//所有的规格名
        var arrSpecValLen = [];//每一个规格名下的规格值数量组成的数组
        var arrValLen = [];//和规格名一样多的数组
        var len = 1;//记录表格总行数
        var arrRows = [];//表格单元格占据的行数组成的数组
        var $specTable = $('.js-specTable');//生成的表格

        var str = '';
        str += '<div class="clearfix row js-specTable">';
        str += '    <div class="pull-left col-md-2 text-right">规格明细：</div>';
        str += '    <div class="fv-wrapper-right pull-left col-md-10">';
        str += '        <table class="table table-bordered table-responsive">';
        str += '            <thead>';
        str += '                <tr>';
        // str += '                    <th>颜色</th>';
        // str += '                    <th>尺寸</th>';
        //渲染规格名
        for (var i = 0; i < $specName.length; i++) {
            str += '<th>' + $specName.eq(i).val() + '</th>'
        }
        str += '                    <th class="fv-requiredStar">价格（元）</th>';
        str += '                    <th class="fv-requiredStar">库存</th>';
        str += '                    <th>销量</th>';
        str += '                </tr>';
        str += '            </thead>';
        str += '            <tbody>';

        for (var i = 0; i < $specName.length; i++) {
            arrSpecValLen.push($specName.eq(i).parents('.fv-specList').find('.fv-specValue_input').length);
        }

        //求出总行数 和 单元格跨行数
        for (var i = 0; i < arrSpecValLen.length; i++) {
            len = len * arrSpecValLen[i];//得出表格总行数
            arrValLen[i] = 0;//每个值初始化为0，得出所有规格名

            var tmpnum = 1;
            for (var j = $specName.length - 1; j > i; j--) {
                tmpnum = tmpnum * arrSpecValLen[j];//得出单元格所占的行数
            }
            arrRows.push(tmpnum);
        }

        //生成td dom
        for (var i = 0; i < len; i++) {
            str += '<tr data-row="' + (i + 1) + '">';
            var singleSpec = {};
            var strSpec = [];

            for (var j = 0; j < $specName.length; j++) {
                var n = parseInt(i / arrRows[j]);
                if (j == 0) { }
                else if (j == $specName.length - 1) {
                    n = arrValLen[j];
                    if (arrValLen[j] + 1 >= arrSpecValLen[j]) {
                        arrValLen[j] = 0;
                    } else {
                        arrValLen[j]++;
                    }
                } else {
                    var _m = parseInt(i / arrRows[j]);
                    n = _m % arrSpecValLen[j];
                }

                var text = $specName.eq(j).parents('.fv-specList').find('.fv-specValue_input').eq(n).val();
                strSpec.push(text);
                singleSpec.spec = strSpec;
                if (i % arrRows[j] == 0) {
                    // str += '<td rowspan="' + arrRows[j] + '" data-rc="' + (i + 1) + '_' + (j + 1) + '">' + text + '</td>';
                    str += '<td rowspan="' + arrRows[j] + '">' + text + '</td>';
                }
            }
            arrSpec.push(singleSpec);
            str += '<td>';
            str += '    <input type="text" class="form-control js-specPrice" placeholder="请输入价格">';
            str += '</td>';
            str += '<td>';
            str += '    <input type="text" class="form-control js-specCount" placeholder="请输入库存">';
            str += '</td>';
            str += '<td>0</td>';
            str += '</tr>'
        }
        str += '            </tbody>';
        str += '            <tfoot>';
        str += '                <tr>';
        str += '                    <td colspan="' + ($specName.length + 3) + '" class="row">';
        str += '                        <div class="col-lg-2 aaa">批量设置：</div>';
        str += '                        <div class="col-lg-4">';
        str += '                            <div class="input-group">';
        str += '                                <span class="input-group-addon" id="specPrice">价格</span>';
        str += '                                <input type="text" class="form-control" placeholder="0.00" aria-describedby="specPrice">';
        str += '                                <span class="input-group-btn">';
        str += '                                    <button class="btn btn-default js-setSpecPrice" type="button">确认</button>';
        str += '                                </span>';
        str += '                            </div>';
        str += '                        </div>';
        str += '                        <div class="col-lg-4">';
        str += '                            <div class="input-group">';
        str += '                                <span class="input-group-addon" id="specCount">库存</span>';
        str += '                                <input type="text" class="form-control" placeholder="0" aria-describedby="specCount">';
        str += '                                <span class="input-group-btn">';
        str += '                                    <button class="btn btn-default js-setSpecCount" type="button">确认</button>';
        str += '                                </span>';
        str += '                            </div>';
        str += '                        </div>';
        str += '                    </td>';
        str += '                </tr>';
        str += '            </tfoot>';
        str += '        </table>';
        str += '    </div>';
        str += '</div>';

        $specTable.remove();
        $spec.after(str);
    }

});