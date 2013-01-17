/***
 * Consumed by the Unplanned Task Grid
 */
Ext.define("MyApp.store.UnplannedTaskStore", {
    extend      : "Ext.data.Store",
    model       : 'MyApp.model.UnplannedTask',
    requires    : [
        'MyApp.model.UnplannedTask'
    ],

    autoLoad    : true,

    proxy       : {
        url     : 'dummydata/unplanned.js',
        type    : 'ajax',
        reader  : { type : 'json' }
    }
});