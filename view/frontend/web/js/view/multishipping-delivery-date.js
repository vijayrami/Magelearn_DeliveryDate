define([
    'jquery',
    'ko',
    'Magento_Ui/js/form/element/abstract',
    'mage/calendar'
], function ($, ko, Component) {
    'use strict';

    return Component.extend({
        initialize: function () {
            this._super();

            ko.bindingHandlers.datepicker = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var $el = $(element);

                    var parentId = $el.parent().attr("id");
                    var settings = window.delivery_date[parentId];
                    var config = settings.settings.shipping.delivery_date;

                    var prevValue = settings.preValue;
                    var defaultValue = config.default_delivery_date;
                    var disabled = config.disabled;
                    var blackout = config.blackout;
                    var noday = config.noday;
                    var hourMin = parseInt(config.hourMin);
            		var hourMax = parseInt(config.hourMax);
                    var format = config.format;

                    if(!format) {
                        format = 'yy-mm-dd';
                    }

                    var disabledDay = disabled.split(",").map(function(item) {
                        return parseInt(item, 10);
                    });


                    //initialize datepicker
                    var options = {
                        minDate: 0,
                        dateFormat:format,
                        hourMin: hourMin,
                        hourMax: hourMax,
                        beforeShowDay: function(date) {
                        	if(blackout || noday){
	                        	var string = $.datepicker.formatDate('yy-mm-dd', date);
	                        	var day = date.getDay();
	                        	var date_obj = [];
                                function arraySearch(arr,val) {
                                    for (var i=0; i<arr.length; i++)
                                        if (arr[i].date === val)                    
                                            return arr[i].content;
                                    return false;
                                }
                                function arrayTooltipClass(arr,val) {
                                    for (var i=0; i<arr.length; i++)
                                        if (arr[i].date === val)                    
                                            return 'redblackday';
                                    return 'redday';
                                }
                                for(var i = 0; i < blackout.length; i++) {
	    						   var tooltipDate = blackout[i].content;
								   if(blackout[i].date === string) {
                                     date_obj.push(blackout[i].date);
								   }
								}
	    						if(date_obj.indexOf(string) != -1 || disabledDay.indexOf(day) > -1) {
                                    return [false, arrayTooltipClass(blackout,string), arraySearch(blackout,string)];
                                } else {
                                    return [true];
                                }
    						}    					
                        }
                    };

                    $el.datetimepicker(options);


                    if(prevValue){
                        $el.datepicker("setDate", prevValue);
                    } else if(defaultValue) {
                        $el.datepicker("setDate", defaultValue);
                    }

                    var writable = valueAccessor();
                    if (!ko.isObservable(writable)) {
                        var propWriters = allBindingsAccessor()._ko_property_writers;
                        if (propWriters && propWriters.datepicker) {
                            writable = propWriters.datepicker;
                        } else {
                            return;
                        }
                    }
                    writable($(element).datetimepicker("getDate"));
                },
                update: function (element, valueAccessor) {
                    var widget = $(element).data("DatePicker");
                    //when the view model is updated, update the widget
                    if (widget) {
                        var date = ko.utils.unwrapObservable(valueAccessor());
                        widget.date(date);
                    }
                }
            };

            return this;
        },
        getInputName: function () {
            return "delivery_date[" + this.entityId + "]";
        },
        getEntityId: function () {
            return this.entityId;
        }
    });
});
