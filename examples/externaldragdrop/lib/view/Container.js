/*
* This is the main UI container which instantiates each of the child UI components
* */
Ext.define("MyApp.view.Container", {
    extend      : 'Ext.Panel',
    alias       : 'widget.appcontainer',

    requires    : [
        'MyApp.store.AvailabilityStore',
        'MyApp.store.ResourceStore',
        'MyApp.store.EventStore',

        'MyApp.view.EmployeeScheduler',
        'MyApp.view.UnplannedTaskGrid'
    ],

    // Some panel configs
    layout      : 'border',
    width       : 1200,
    height      : 600,
    border      : false,

    // Custom configs for this panel, which will be passed on to the two child scheduler panels
    startDate   : null,
    endDate     : null,

    initComponent : function() {
        var eventStore = new MyApp.store.EventStore();
        var resourceStore = new MyApp.store.ResourceStore();
        var availabilityStore = new MyApp.store.AvailabilityStore();
        resourceStore.availabilityStore = availabilityStore;

        Ext.apply(this, {
            items   : [
                {
                    // Just some pure HTML for now
                    region          : 'north',
                    contentEl       : 'example-description',
                    height          : 80,
                    border          : false,
                    weight          : 30
                },
                {
                    xtype           : 'employeescheduler',
                    region          : 'center',
                    startDate       : this.startDate,
                    endDate         : this.endDate,
                    resourceStore   : resourceStore,
                    resourceZones   : availabilityStore,
                    eventStore      : eventStore
                },
                {
                    xtype           : 'unplannedtaskgrid',
                    width           : 280,
                    split           : true,
                    region          : 'east',
                    weight          : 20
                }
            ]
        });

        this.callParent(arguments);

        // In a real life application, you'd probably batch these store loads to just use one Ajax request.
        eventStore.load();
        resourceStore.load();
        availabilityStore.load();
    }
});
    