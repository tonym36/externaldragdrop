/***
 * Consumed by the Employee Scheduler panel
 */
Ext.define('MyApp.store.EventStore', {
    extend      : "Sch.data.EventStore",
    model       : "MyApp.model.Task",
    proxy       : {
        type    : 'ajax',
        url     : 'dummydata/eventdata.js',
        reader  : { type : 'json' }
    }
});