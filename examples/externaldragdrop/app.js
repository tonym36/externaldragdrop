/***
 * This is a simple MVC demo app where 2 scheduler view share data.
 * There is comments in each class describing how things work and you can also look up the configuration
 * properties for each class in the Sencha or Bryntum API docs
 *
 * http://docs.sencha.com/ext-js/4-1/
 * http://www.bryntum.com/docs
 */

// MVC relies on loading on demand, so we need to enable and configure the loader
Ext.Loader.setConfig({
    disableCaching  : true,
    enabled         :true
});

Ext.application({
    name        : 'MyApp',       // Our global namespace

    appFolder   : 'lib',  // The folder for the JS files

    controllers : [
        'EmployeeScheduler'
    ],

    // We'll create our own 'main' UI
    autoCreateViewport	: false,

    launch      : function() {
        var me = this;

        // First create some simple buttons
        var addEventButton = new Ext.Button({
            text : 'Add event to scheduler',
            renderTo : document.body,
            handler : function() {
                var scheduler = me.getScheduler();
                var newTask = new scheduler.eventStore.model({
                    StartDate : new Date(2011, 8, 1, 10),
                    EndDate : new Date(2011, 8, 1, 12),
                    Name : 'Foo'
                });
                newTask.assign(scheduler.resourceStore.first());
                scheduler.eventStore.add(newTask);
            }
        });

        var removeEventButton = new Ext.Button({
            text : 'Remove some task',
            renderTo : document.body,
            handler : function() {
                // Just remove some task from the store
                var scheduler = me.getScheduler();
                scheduler.eventStore.removeAt(0)
            }
        })

        this.mainContainer = new MyApp.view.Container({
            startDate   : new Date(2011, 8, 1, 8),
            endDate     : new Date(2011, 8, 1, 17),
            renderTo    : 'container' // A div on the page
        });
    },

    getScheduler : function() {
        return this.mainContainer.down('employeescheduler');
    }
});



