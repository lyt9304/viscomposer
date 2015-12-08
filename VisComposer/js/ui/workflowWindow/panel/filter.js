/**
 * Created by vag on 2015/3/6.
 */
viscomposer.ui.workflowWindow.filterpanel = function(filterModule, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this,filterModule, workflowWindow);
    this.module = filterModule;
    this.productive = true;
    this.module.ui = this;
    this.workflowWindow = workflowWindow;
    this.selectedCol = null;

    this.update();
    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.filterpanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.filterpanel.prototype.constructor = viscomposer.ui.workflowWindow.filterpanel;

viscomposer.ui.workflowWindow.filterpanel.prototype.update = function(){

    var that = this;

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

//    that.updateAttribute();

    var module = that.module;
    console.log(module);
    var input = module.input[0];
    var inputUI = input.ui;
    inputUI.linkOn = true;
    inputUI.update();

    if(!input.linkFrom){
        $(that.elSelector + ' .content .select select').html('');
        $(that.elSelector + ' .option').html('');
    }

    else
    {
        if(!that.selectedCol){
            $(that.elSelector + ' .content .select select').html('');
            var flag = false, first = null;
            for(var key in module.properties.cols)
            {
                if(!flag){
                    first = key;
                    flag = true;
                }
                $(that.elSelector + ' .content .select select').append('<option>' + key + '</option>');
            }
            $(that.elSelector + ' .content .select select').append('<option>coding</option>');

            that.selectedCol = first;
            module.properties.selectedCol = first;
            that.fillOption();

        }
    }
};
viscomposer.ui.workflowWindow.filterpanel.prototype.createDom = function(){

    var that = this;
    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
        .append(
            '<div class="module filter" id="' + that.uuid + '">' +
            '<div class="title"><span>' + module.label + '</span></div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs"></div>' +
            '<div class="outputs"></div>' +
            '<div class="select"><select></select></div>' +
            '<div class="option"></div>' +
            '</div></div>');

    $(that.elSelector + ' .select select').on("change", function(){

        that.selectedCol = $(this).val();
        if(that.selectedCol != 'coding')
        {
            module.properties.selectedCol=that.selectedCol;
            module.properties.code=null;
        }
        else
        {
            $(this.elSelector + ' .codearea').css("display", "block");
        }
        that.fillOption();

    });


};

viscomposer.ui.workflowWindow.filterpanel.prototype.fillOption = function(){

    var that = this;

    if(that.selectedCol)
    {
        var module = this.module;
        $(that.elSelector + ' .option').html('');
        if(that.selectedCol != 'coding')
        {
            module.properties.code=null;
            var col = module.properties.cols[that.selectedCol];
            var dataType = col._dataType;
            if(dataType.label == "quantitative")
            {

                var min, max;
                for(var key in col)
                {
                    if(key === '_dataType')
                    {
                        continue;
                    }
                    key = parseFloat(key);
                    if(!min || (min > key))
                    {
                        min = key;
                    }
                    if(!max || (max < key))
                    {
                        max = key;
                    }
                }

                module.properties._min = min;
                module.properties._max = max;

                $(that.elSelector + ' .option').html(
                    '<div class="range"></div>' +
                    '<div class="label min">min</div>' +
                    '<div class="label max">max</div>' +
                    '<div class="label selectmin">' + min + '</div>' +
                    '<div class="label selectmax">' + max + '</div>');

                $(that.elSelector + " .option .range").slider({
                    range: true,
                    min: min * 100,
                    max: max * 100,
                    values: [ min * 100, max * 100 ],
                    slide: function( event, ui ) {

                        var rangeLength = 150;

                        var curmin = ui.values[0];
                        var curmax = ui.values[1];

                        module.properties._min = curmin / 100;
                        module.properties._max = curmax / 100;

                        viscomposer.app.tryRender();

                        $(that.elSelector + " .option .selectmin").html(curmin / 100).css("left", (curmin-min * 100)/(max-min)/100 * rangeLength);
                        $(that.elSelector + " .option .selectmax").html(curmax / 100).css("right", (max * 100-curmax)/(max-min)/100 * rangeLength);

                    }
                });


            }
            else if(dataType.label == "categorical"){

                $(that.elSelector + ' .option').append('<div class="checkboxset"></div>');

                for(var key in col)
                {
                    if(key === '_dataType')
                    {
                        continue;
                    }
                    var checkedstr = '';
                    if(col[key])
                    {
                        checkedstr = 'checked';
                    }
                    $(that.elSelector + ' .option .checkboxset').append('<div class="item"><input data="' + key + '" type="checkbox" ' + checkedstr + '>' + key + '</div>');
                }

                $(that.elSelector + ' .option .checkboxset .item input').on("click", function(){
                    var key = $(that).attr("data");
                    var checked = that.checked;
                    (that.module.properties.cols[that.selectedCol])[key] = checked;
                    viscomposer.app.tryRender();
                });

            }
        }
        else
        {

            $(that.elSelector + ' .option').html('<input type="text" class="code"><div class="codeSubmit">OK</div>');

            $(that.elSelector + ' .option .codeSubmit').on("click", function(){

                var code = $(that.elSelector + ' .code').val();
                module.properties.code=code;
                module.submit();

            });

        }

    }


};



