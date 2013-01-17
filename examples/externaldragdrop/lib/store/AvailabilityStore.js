/***
 * Consumed by both SchedulerPanel instances. This class holds all the availability intervals and adds an extra method to
 * decide if a resource is available or not by looking at the availability defined for that resource.
 */
Ext.define("MyApp.store.AvailabilityStore", {
    extend      : 'Sch.data.EventStore',
    autoLoad    : true,

    proxy       : {
        type    : 'ajax',
        url     : 'dummydata/availabilitydata.js',
        reader  : { type : 'json' }
    },

    // A method which scans the availability intervals for a resource to see if it is available
    isResourceAvailable : function(resource, start, end) {
        var availability = this.getEventsForResource(resource);
        
        if (!availability || availability.length === 0) return true;

        for (var i = 0, l = availability.length; i < l; i++) {
            // Check if there is an availability block completely encapsulating the passed start/end timespan
            if (Sch.util.Date.timeSpanContains(availability[i].getStartDate(), availability[i].getEndDate(), start, end)) {
                return true;
            }
        }

        return false; 
    }
});