/***
 * Consumed by the Employee Scheduler panel
 */
Ext.define('MyApp.store.EventStore', {
    extend      : "Sch.data.EventStore",
    proxy       : {
        type    : 'ajax',
        url     : 'dummydata/eventdata.js',
        reader  : { type : 'json' }
    }
});