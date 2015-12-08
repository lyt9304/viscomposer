viscomposer.parseCSV=function(input,attributes){

    var cols, result, rows;
    rows = input.replace(/\n+/g, '\n').replace(/\r+/g, '').trim().split('\n').map(function(row, index) {
        return row.split(',');
    });

    cols = rows.shift();

    result=[];

    rows.forEach(function(row) {
        var _row;
        _row = {};
        row.forEach(function(value, index) {
            _row[attributes[index]]=value;
        });
        return result.push(_row);
    });

    return result;
};