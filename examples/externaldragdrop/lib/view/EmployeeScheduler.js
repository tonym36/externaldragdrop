/**
 * This employee scheduler shows the tasks booked for each resource.
 * Additionally it show the availability for each resource, configured through the 'resourceZones' config property.
 * After it is rendered, it also sets up the drop zone which indicates it can accept drops on the schedule area.
 */
Ext.define("MyApp.view.EmployeeScheduler", {
    extend              : 'Sch.panel.SchedulerGrid',
    alias               : 'widget.employeescheduler',

    // Let the Ext.Loader know what this class 'requires' to function, these classes will be loaded before this class is defined
    requires            : [
        'MyApp.store.AvailabilityStore',
        'MyApp.store.ResourceStore',
        'MyApp.store.EventStore',
        'MyApp.view.UnplannedTaskDropZone'
    ],

    // Some basic panel config properties
    title               : 'Staff schedule',
    cls                 : 'staffscheduler',

    // Some grid configs
    enabledHdMenu       : false,

    // Some scheduler config properties
    enableDragCreation  : false,
    rowHeight           : 30,
    viewPreset          : 'hourAndDay',

    initComponent : function() {
        var availabilityStore = this.resourceZones;
        var D = Ext.Date;

        Ext.apply(this, {
            // This method should return the text inside the event bar, additionally it can also
            // add style declarations and CSS classes to the containing DOM node.
            eventRenderer : function(event, resourceRecord, meta) {
                if (!availabilityStore.isResourceAvailable(resourceRecord, event.getStartDate(), event.getEndDate())) {
                    meta.cls = 'invalid';
                }

                if (event.data.Color) {
                    meta.style = 'background-color:' + event.data.Color;
                }
                return event.getName();
            },

            // Indicate during resize, if state is valid
            resizeValidatorFn : function(resourceRecord, eventRecord, startDate, endDate, e) {
                return availabilityStore.isResourceAvailable(resourceRecord, startDate, endDate);
            },

            // Indicate during dragging of aplnned tasks, if state is valid
            dndValidatorFn : function(dragRecords, targetResourceRecord, date, duration, e) {
                return availabilityStore.isResourceAvailable(targetResourceRecord, date, D.add(date, D.MILLI, duration));
            },

            columns         : [
                {
                    header      : 'Staff',
                    width       : 120,
                    dataIndex   : 'Name'
                }/*,
                {
                    header      : 'Availability',
                    width       : 180,
                    renderer    : function(v, m, r) {
                        var availability = availabilityStore.getEventsForResource(r);
                        
                        return Ext.Array.map(availability, function(a) {
                            return D.format(a.getStartDate(), 'G:i') + ' - ' + D.format(a.getEndDate(), 'G:i');
                        }).join(', ');
                    }
                }*/
            ],

            tbar : this.createToolbar(),
            
            viewConfig : {
                stripeRows  : false,
                barMargin   : 3,
                forceFit    : true
            }
        });
        
        this.callParent(arguments);
        
        // We'd like to update the availability text after updating any data in the availability store
        availabilityStore.on({
            add     : this.refreshRow,
            update  : this.refreshRow,
            scope   : this,
            delay   : 500   //allow the animation to finish first
        });

        availabilityStore.on('load', function() { this.getView().refresh(); }, this);
    },

    refreshRow : function(s, rs) {
        // Normalize
        if (!(rs instanceof Array)) {
            rs = [rs];
        }
        var index = this.resourceStore.indexOf(rs[0].getResource());
        
        this.getView().refreshNode(index);
    },

    afterRender : function() {
        this.callParent(arguments);

        // At this stage, we can reference the container Element for this component and setup the drop zone
        var taskDropZone = new MyApp.view.UnplannedTaskDropZone(this.getEl(), {
            schedulerView   : this.getSchedulingView()
        });
    },

    createToolbar : function() {
        // By setting 'scope' to this in the code below, we keep 'this' pointing to the scheduler instance
		
        return [
        	{
        		xtype : 'buttongroup',
        		title : '',
        		columns : 3,
        		defaults : {
        			scale : 'small'
        		},
        		items : [
        			
        			{
		                text : 'Previous',
	                	iconCls : 'icon-prev',
	                	handler : function() {
	                    	this.shiftPrevious();
	                	},
	                	scope : this
		            },
		            {
		            	text : 'Next',
	                	iconCls : 'icon-next',
	                	handler : function() {
	                    	this.shiftNext();
	                	},
	                	scope : this
		            },
		            {
		                text : 'Day',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('hourAndDay');
		                },
		                scope : this
		            },
		            {
		                text : 'Days',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('dayAndWeek');
		                },
		                scope : this
		            },
		            {
		                text : 'Weeks',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('weekAndMonth');
		                },
		                scope : this
		            },
		            {
		                text : 'Months',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('monthAndYear');
		                },
		                scope : this
		            },
		            {
		                xtype       : 'datefield',
		                emptyText   : 'Select a date...',
		                listeners   : {
		                    select : function(picker) {
		                        this.setStart(picker.getValue());
		                    },
		                    scope : this
		                }
            		}
        		
        		]
        	}
        ];
    }
});
    