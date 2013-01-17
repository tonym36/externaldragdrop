/***
 * A simple subclass of the Sch.model.Event class, which only adds a 'Duration' field. This field is only used when
 * the model is in the unplanned task grid.
 */
Ext.define("MyApp.model.UnplannedTask", {
    extend : "Sch.model.Event",

    fields : [
        { name : 'Duration', type : 'float' } // in hours
    ]
})