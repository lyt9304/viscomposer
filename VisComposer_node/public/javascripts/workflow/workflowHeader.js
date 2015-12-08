viscomposer.workflow.WorkflowHeader=(function(){

    var WorkflowHeader = viscomposer.VObject.define("WorkflowHeader",null,function(workflow){
        this.workflow = workflow;
        this.loodNum = 'auto';
        this.inputs = [];
        this.importedDataInputs = [];
        this.varnames = [];
        this.labels = [];
        this.filter = "all";
    });

    var prototype = WorkflowHeader.prototype;

    prototype.update = function(){

    };
    prototype.addData = function(dataInfo){
        var port = new viscomposer.workflow.Port('data');
        port.dataInfo = dataInfo;
        var dataName = dataInfo.originalTitle.split('.')[0];
        port.label = viscomposer.util.processConflict(dataInfo.originalTitle, this.labels);
        port.varname = viscomposer.util.processConflict(dataName, this.varnames);
        port.header = this;
        port.workflow = this.workflow;
        port.imported = true;
        this.importedDataInputs.push(port);
    };
    prototype.addPort = function(){

    };

    return WorkflowHeader;

})();