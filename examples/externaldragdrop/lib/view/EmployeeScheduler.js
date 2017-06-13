// custom view presets:

Sch.preset.Manager.registerPreset("hourAnd1Day", {
    "timeColumnWidth":60,
    "rowHeight":24,
    "resourceColumnWidth":100,
    "displayDateFormat":"G:i",
    "shiftIncrement":1,
    "shiftUnit":"d",
    "defaultSpan":24,
    "timeResolution":{
        "unit":"mi",
        "increment": 30
    },
    "headerConfig": {
        "middle": {
            "unit":"h",
            "dateFormat":"H:i",
            "increment": 1
        },
        "top":{
            "unit":"d",
            "dateFormat":"l m/d/Y"
        }
    }
});

Sch.preset.Manager.registerPreset("hourAnd2Days", {
    "timeColumnWidth":60,
    "rowHeight":24,
    "resourceColumnWidth":100,
    "displayDateFormat":"G:i",
    "shiftIncrement":1,
    "shiftUnit":"d",
    "defaultSpan":48,
    "timeResolution":{
        "unit":"mi",
        "increment": 30
    },
    "headerConfig": {
        "middle": {
            "unit":"h",
            "dateFormat":"H:i",
            "increment": 2
        },
        "top":{
            "unit":"d",
            "dateFormat":"l m/d/Y"
        }
    }
});

Sch.preset.Manager.registerPreset("hourAnd3Days", {
    "timeColumnWidth":60,
    "rowHeight":24,
    "resourceColumnWidth":100,
    "displayDateFormat":"G:i",
    "shiftIncrement":1,
    "shiftUnit":"d",
    "defaultSpan":72,
    "timeResolution":{
        "unit":"mi",
        "increment": 30
    },
    "headerConfig": {
        "middle": {
            "unit":"h",
            "dateFormat":"H:i",
            "increment": 3
        },
        "top":{
            "unit":"d",
            "dateFormat":"l m/d/Y"
        }
    }
});

Sch.preset.Manager.registerPreset("hourAnd4Days", {
    "timeColumnWidth":60,
    "rowHeight":24,
    "resourceColumnWidth":100,
    "displayDateFormat":"G:i",
    "shiftIncrement":1,
    "shiftUnit":"d",
    "defaultSpan":96,
    "timeResolution":{
        "unit":"mi",
        "increment": 30
    },
    "headerConfig": {
        "middle": {
            "unit":"h",
            "dateFormat":"H:i",
            "increment": 4
        },
        "top":{
            "unit":"d",
            "dateFormat":"l m/d/Y"
        }
    }
});

Sch.preset.Manager.registerPreset("hoursAnd1WorkWeek", {
    "timeColumnWidth":60,
    "rowHeight":24,
    "resourceColumnWidth":100,
    "displayDateFormat":"G:i",
    "shiftIncrement":1,
    "shiftUnit":"w",
    "defaultSpan":168,
    "timeResolution":{
        "unit":"mi",
        "increment": 30
    },
    "headerConfig": {
        "middle": {
            "unit":"h",
            "dateFormat":"H:i",
            "increment": 1
        },
        "top":{
            "unit":"d",
            "dateFormat":"l m/d/Y"
        }
    }
});

Sch.preset.Manager.registerPreset("hoursAnd2WorkWeek", {
    "timeColumnWidth":60,
    "rowHeight":24,
    "resourceColumnWidth":100,
    "displayDateFormat":"G:i",
    // Shift 2 weeks at once
    "shiftIncrement":2,
    "shiftUnit":"w",
    "defaultSpan":336,
    "timeResolution":{
        "unit":"mi",
        "increment": 30
    },
    "headerConfig": {
        "middle": {
            "unit":"h",
            "dateFormat":"H:i",
            "increment": 2
        },
        "top":{
            "unit":"d",
            "dateFormat":"l m/d/Y"
        }
    }
});

// ===================================

Ext.define('TimeAxis', {
    extend  : 'Sch.data.TimeAxis',

    generateTicks : function(start, end, unit, increment) {
        // Options are: 1) set specific time span on button click and filter time axis 2) override generate ticks method (implemented)
        // We need some condition to enable custom ticks generation
        if (!this.useCustomTickGenerator) {
            this.isContinuous = true;
            return this.callParent(arguments);
        }

        // we are skipping time, set this to false
        this.isContinuous = false;

        var ticks = [],
        // we will ignore sat/sun
            filterDays = { 0: true, 6: true };
        
        if (this.autoAdjust) {
            // Set passed start date to monday of corresponding week
            var day = start.getDay();
            if (day !== 1) {
                start = Sch.util.Date.add(Ext.Date.clearTime(start), Sch.util.Date.DAY, 1 - (day === 0 ? 7 : day));
            }
            start = this.floorDate(start || this.getStart(), false);
            // add 1 or 2 weeks
            end = this.ceilDate(Sch.util.Date.add(start, this.mainUnit, this.defaultSpan), false)
        }
        
        while (start < end) {
            if (start.getHours() >= 9 && start.getHours() < 17 && !filterDays[start.getDay()]) {
                var newTick = {
                    start : start,
                    end   : Sch.util.Date.add(start, unit, increment)
                }
                ticks.push(newTick);
                start = newTick.end;
            } else {
                if (start.getHours() >= 17 || filterDays[start.getDay()]) {
                    start = Sch.util.Date.add(start, Sch.util.Date.DAY, 1);
                }
                start.setHours(9);
            }
        }
        return ticks;
    }
})

/**
 * This employee scheduler shows the tasks booked for each resource.
 * Additionally it show the availability for each resource, configured through the 'resourceZones' config property.
 * After it is rendered, it also sets up the drop zone which indicates it can accept drops on the schedule area.
 */
Ext.define("MyApp.view.EmployeeScheduler", {
    extend              : 'Sch.panel.SchedulerTree',
    alias               : 'widget.employeescheduler',

    // Let the Ext.Loader know what this class 'requires' to function, these classes will be loaded before this class is defined
    requires            : [
        'MyApp.store.AvailabilityStore',
        'MyApp.store.ResourceStore',
        'MyApp.store.EventStore',
        'MyApp.view.UnplannedTaskDropZone',
        'Sch.plugin.CurrentTimeLine'
    ],

    // Some basic panel config properties
    title               : 'Staff schedule',
    cls                 : 'staffscheduler',

    // Some grid configs
    enabledHdMenu       : false,

    // Some scheduler config properties
    enableDragCreation  : false,
    rowHeight           : 30,
    viewPreset          : 'hourAnd1Day',
    timeAxis            : new TimeAxis(),

    switchViewPreset : function (name) {
        if (name.indexOf('WorkWeek') !== -1) {
            this.timeAxis.useCustomTickGenerator = true;
        } else {
            this.timeAxis.useCustomTickGenerator = false;
        }

        return this.callParent(arguments);
    },

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

            lockedGridConfig : {
                width : 200,
                listeners: {
                    resize : function (locked, width) {
                        locked.down('gridcolumn').setWidth(width);
                    }
                }
            },

            layout: 'border',
            split : true,

            columns         : [
                {
                    xtype       : 'treecolumn',
                    header      : 'Staff',
                    width       : 200,
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
            },

            //change the 'updateInterval' in ms to get a different refresh rate
            plugins         : [
                Ext.create('Sch.plugin.CurrentTimeLine', { updateInterval : 1000 })
            ],

            listeners: {
                eventdragstart: function(){
                    console.log('eventdragstart');
                },
                eventdrop: function(){
                    console.log('eventdrop');
                },
                eventresizestart: function(){
                    console.log('eventresizestart');
                },
                eventresizeend: function(){
                    console.log('eventresizeend');
                }
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
		                text : '1Day',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('hourAnd1Day');
		                },
		                scope : this
		            },
		            {
		                text : '2Days',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('hourAnd2Days');
		                },
		                scope : this
		            },
		            {
		                text : '3Days',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('hourAnd3Days');
		                },
		                scope : this
		            },
		            {
		                text : '4Days',
		                iconCls : 'icon-calendar',
		                handler : function() {
		                    this.switchViewPreset('hourAnd4Days');
		                },
		                scope : this
		            },
                    {
                        text : '1 work week',
                        iconCls : 'icon-calendar',
                        handler : function () {
                            this.switchViewPreset('hoursAnd1WorkWeek');
                        },
                        scope : this
                    },
                    {
                        text : '2 work week',
                        iconCls : 'icon-calendar',
                        handler : function () {
                            this.switchViewPreset('hoursAnd2WorkWeek');
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
        	},
            {
                xtype: 'form',
                title: 'Search resources',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'resourceFilter',
                        width: 150
                    }
                ],
                buttons: [
                    {
                        text: 'Submit',
                        formBind: true,
                        disabled: true,
                        panel : this,
                        handler: function() {
                            var form = this.up('form').getForm(),

                                //handler to scheduler panel
                                panel = this.panel;

                            if (form.isValid()) {
                                var values    = form.getValues(),
                                    resFilter = values.resourceFilter,
                                    resStore  = panel.resourceStore,
                                    rgxp      = new RegExp(resFilter, 'gi');
                                    records   = resStore.queryBy(function(record){
                                        return record.getName().match(rgxp);
                                    });

                                //`values` returns an object with all of the form fields and values,
                                //so you can either do queryBy with all values at once, or once per
                                //field and return multiple searches
                                var obj = {
                                    filterValue : resFilter,
                                    resources : records.getRange()
                                }

                                console.log('OBJ: ', obj);

                                //now you can reload your panel
                            }
                        }
                    }
                ]
            }
        ];
    }
});
    