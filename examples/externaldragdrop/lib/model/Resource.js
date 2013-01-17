/***
 * A simple subclass of the Sch.model.Resource class, which only adds an 'isAvailable' method which relays the
 * question to its store (a ResourceStore)
 */
Ext.define("MyApp.model.Resource", {
    extend : "Sch.model.Resource",

    isAvailable : function(start, end) {
        return this.store.isResourceAvailable(this, start, end);
    }
})