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
            ],

            tbar : [
                {
                    xtype : 'textfield',
                    name : 'Name',
                    emptyText : 'Enter task name...'
                },
                {
                    xtype : 'numberfield',
                    name : 'Duration',
                    minValue : 0,
                    value : 1,
                    width : 40
                },
                {
                    xtype : 'label',
                    text : 'h'
                },
                {
                    xtype : 'button',
                    text : 'Add task...',
                    handler : function(btn) {
                        var toolbar = btn.up('toolbar');
                        var newTask = new this.store.model({
                            Name : toolbar.down('[name=Name]').getValue(),
                            Duration : toolbar.down('[name=Duration]').getValue()
                        });

                        if (!newTask.get('Name')) {
                            Ext.Msg.alert('Error', 'Please enter a Name for the task');
                            return;
                        }

                        if (!newTask.get('Duration')) {
                            Ext.Msg.alert('Error', 'Please enter a Duration for the task');
                            return;
                        }

                        this.store.add(newTask);
                    },
                    scope : this
                }
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
    