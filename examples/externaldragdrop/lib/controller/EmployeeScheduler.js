/***
 * This controller glues together the application and handles the 'drop' event from the drop zone.
 * When the drop happens it simply removes it from one store, and inserts the task into the event store of the EmployeeScheduler.
 */
Ext.define("MyApp.controller.EmployeeScheduler", {
    extend : "Ext.app.Controller",

    views : [
        'Container'
    ],

    refs : [
        // This auto-generates a "getEmployeeScheduler" getter for this ComponentQuery selector
        // See http://docs.sencha.com/ext-js/4-1/#!/api/Ext.app.Controller-cfg-refs
        { ref : "employeeScheduler", selector : 'employeescheduler' }
    ],

    init : function() {
        this.control({
            // We should react to task drops coming from the external grid
            'employeescheduler schedulergridview' : {
                unplannedtaskdrop : this.onUnplannedTaskDrop
            }
        });
    },

    onUnplannedTaskDrop : function(scheduler, droppedTask, targetResource, date){
        var employeeScheduler   = this.getEmployeeScheduler();

        // Remove this task from the store it currently belongs to - the unassigned grid store
        droppedTask.store.remove(droppedTask);

        // Apply the start and end date values
        droppedTask.setStartEndDate(date, Sch.util.Date.add(date, Sch.util.Date.HOUR, droppedTask.get('Duration')));

        // And finally assign it to the resource
        droppedTask.assign(targetResource);

        employeeScheduler.eventStore.add(droppedTask);
    }
})