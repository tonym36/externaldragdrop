/**
 * This class is a drop zone, allowing you to drop elements on the configured target element (see the constructor in the
 * Sencha API docs: http://docs.sencha.com/ext-js/4-1/#!/api/Ext.dd.DropTarget-method-constructor).
 * When the drop happens, the onNodeDrop callback is called and the dropzone simply fires an event on behalf of the scheduler view
 * to let the world know about the drop.
 * */
Ext.define("MyApp.view.UnplannedTaskDropZone", {
    extend      : "Sch.feature.DropZone",
    ddGroup     : 'unplannedtasks',

    // This method is called as mouse moves during a drag drop operation of an unplanned task over the schedule area
    validatorFn     : function(draggedEventRecords, resource, date, durationMs) {
        return this.isValidDrop(resource, date, durationMs);
    },

    isValidDrop : function(resource, startDate, durationMs) {
        return resource.isAvailable(startDate, Sch.util.Date.add(startDate, Sch.util.Date.MILLI, durationMs));
    },

    onNodeDrop  : function(target, dragSource, e, data){
        var view                = this.schedulerView,
            resource            = view.resolveResource(target),
            date                = view.getDateFromDomEvent(e, 'round'),
            task                = data.records[0];

        if (!this.isValidDrop(resource, date, data.duration)) {
            return false;
        }

        view.fireEvent('unplannedtaskdrop', view, task, resource, date);
    }
});
    