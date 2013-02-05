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
            },
            'employeescheduler' : {
                eventclick : this.onTaskClick,
                eventcontextmenu : this.onTaskContextMenu
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
    },

    onTaskClick : function(scheduler, task){
        if (!this.detailWin) {
            this.detailWin = new Ext.Window({
                title : 'Task details',
                width : 200,
                height : 200,
                closeAction : 'hide',
                buttons : [
                    {
                        text : 'Hide',
                        handler : function(){
                            this.up('window').close();
                        }
                    }
                ]
            });
        }

        this.detailWin.show();
        this.detailWin.body.update('Showing task: ' + task.getName());
    },

    onTaskContextMenu: function (s, eventModel, e) {
        e.stopEvent();

        if (!s.ctx) {
            s.ctx = new Ext.menu.Menu({
                items: [
                    {
                        text: 'Shift 1hr',
                        handler : function() {
                            s.ctx.model.shift(Sch.util.Date.HOUR, 1);
                        }
                    },
                    {
                        text: 'Delete event',
                        handler : function() {
                            s.eventStore.remove(s.ctx.model);
                        }
                    },
                    {
                        text: 'Unplann this task',
                        handler: function(){
                            console.log('arguments: ', arguments);
                            var record = s.ctx.model,
                                unplannedStore = Ext.ComponentQuery.query('unplannedtaskgrid')[0].store;

                            s.eventStore.remove(record);
                            unplannedStore.add(record);
                        }
                    }
                ]
            });
        }
        s.ctx.model = eventModel;
        s.ctx.showAt(e.getXY());
    }
})