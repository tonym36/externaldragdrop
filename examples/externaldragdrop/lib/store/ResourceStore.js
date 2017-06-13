/***
 * Consumed by both SchedulerPanel instances, adds a simple method for determining if a resource is available.
 */
Ext.define('MyApp.store.ResourceStore', {
    extend              : "Sch.data.ResourceTreeStore",
    model               : "MyApp.model.Resource",

    requires            : ["MyApp.model.Resource"],

    availabilityStore   : null,

    getAvailabilityStore : function() {
        return this.availabilityStore;
    },

    isResourceAvailable : function(resource, start, end) {
        return this.getAvailabilityStore().isResourceAvailable(resource, start, end);
    }
});