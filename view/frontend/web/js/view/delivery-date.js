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
            var prevValue = window.checkoutConfig.quoteData.delivery_date;
            var defaultValue = window.checkoutConfig.shipping.delivery_date.default_delivery_date;
            var disabled = window.checkoutConfig.shipping.delivery_date.disabled;
            var blackout = window.checkoutConfig.shipping.delivery_date.blackout;
            var noday = window.checkoutConfig.shipping.delivery_date.noday;
            var hourMin = parseInt(window.checkoutConfig.shipping.delivery_date.hourMin);
            var hourMax = parseInt(window.checkoutConfig.shipping.delivery_date.hourMax);
            var format = window.checkoutConfig.shipping.delivery_date.format;
            if(!format) {
                format = 'yy-mm-dd';
            }
            var disabledDay = disabled.split(",").map(function(item) {
                return parseInt(item, 10);
            });
            
			console.log(blackout);
            ko.bindingHandlers.datetimepicker = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var $el = $(element);
                    //initialize datetimepicker
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
                    } else {
                        $el.datepicker("setDate", defaultValue);
                    }
                    
                    var writable = valueAccessor();
                    if (!ko.isObservable(writable)) {
                        var propWriters = allBindingsAccessor()._ko_property_writers;
                        if (propWriters && propWriters.datetimepicker) {
                            writable = propWriters.datetimepicker;
                        } else {
                            return;
                        }
                    }
                    writable($(element).datetimepicker("getDate"));
                },
                update: function (element, valueAccessor) {
                    var widget = $(element).data("DateTimePicker");
                    //when the view model is updated, update the widget
                    if (widget) {
                        var date = ko.utils.unwrapObservable(valueAccessor());
                        widget.date(date);
                    }
                }
            };

            return this;
        }
    });
});