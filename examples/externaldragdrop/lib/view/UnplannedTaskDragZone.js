/**
 * This class is a drag zone, allowing you to drag rows out of a grid (see "grid" config).
 * For this to work, the 'getDragData' method must return an object with some specific properties, see code below.
 */
Ext.define("MyApp.view.UnplannedTaskDragZone", {
    extend      : "Ext.dd.DragZone",

    grid    : null,

    // Tell Ext how to recover from an invalid drop
    getRepairXY: function() {
        return this.dragData.repairXY;
    },

    // To pair together a drag zone and drop zone
    ddGroup     : 'unplannedtasks',

    getDragData : function(e) {
        var sourceEl    = e.getTarget(),
            view        = this.grid.getView(),
            rowEl       = view.findItemByChild(sourceEl),
            rec         = rowEl && view.getRecord(rowEl);
            
        if (sourceEl && rec) {
            var d = sourceEl.cloneNode(true);

            // Prepare the content to be put inside the drag proxy
            var wrap = Ext.get(Ext.core.DomHelper.createDom({
                tag     : 'div',
                cls     : 'sch-dd-wrap',
                style   : {
                    width : '100px'
                },
                children: [
                    {
                        tag: 'span', 
                        cls: 'sch-dd-proxy-hd',
                        html : '&nbsp;'
                    }
                ]
            }));
                
            wrap.appendChild(d);
            Ext.fly(d).addCls('sch-event');
            Ext.fly(d).update(rec.get('Name'));
                
            return {
                // For the drag zone contract, must return some DOM node to be dragged
                ddel        : wrap.dom,

                // Let the drag zone know the animation target if drag fails
                repairXY    : Ext.fly(rowEl).getXY(),

                // For the scheduler dropzone, provide the duration (in ms) which it uses call its validatorFn
                duration : rec.get('Duration') * 3600000,

                // We can add any data we want to this object, we only require the
                // drop zone to know about the unplanned task record
                records      : [rec]
            };
        }
    }
});
    