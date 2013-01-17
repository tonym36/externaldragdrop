/**
 * Basic grid panel, which is associated with a DragZone. See the GridPanel class in the Sencha API docs for configuration options.
 */
Ext.define("MyApp.view.UnplannedTaskGrid", {
    extend      : "Ext.grid.GridPanel",
    alias       : 'widget.unplannedtaskgrid',

    requires    : [
        'MyApp.store.UnplannedTaskStore',
        'MyApp.view.UnplannedTaskDragZone'
    ],
    cls         : 'taskgrid',

    initComponent : function() {
        Ext.apply(this, {
            viewConfig  : { columnLines : false },

            store   : new MyApp.store.UnplannedTaskStore(),
            columns : [
                {header : 'Unplanned Tasks', sortable:true, flex : 1, dataIndex : 'Name'},
                {header : 'Duration', sortable:true, width:50, dataIndex : 'Duration'}
            ]
        });

        this.callParent(arguments);
    },

    afterRender : function() {
        this.callParent(arguments);

        // Setup the drag zone
        new MyApp.view.UnplannedTaskDragZone(this.getEl(),{
            grid : this
        });
    }
});
    