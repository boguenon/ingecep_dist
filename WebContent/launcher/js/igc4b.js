/*
amplixbi.com on MPLIX project
Copyright(c) 2011 amplixbi.com
http://www.amplixbi.com/
*/
/*
This file is part of INGECEP

Copyright (c) 2011-2013 INGECEP Inc

Contact:  http://www.ingecep.com/contact

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.ingecep.com/contact.

*/
/*
 * jQuery Tooltip plugin 1.3
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.tooltip.js 5741 2008-06-21 15:22:16Z joern.zaefferer $
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 
;(function($) {
	
		// the tooltip element
	var helper = {},
		// the current tooltipped element
		current,
		// the title of the current element, used for restoring
		title,
		// timeout id for delayed tooltips
		tID,
		// IE 5.5 or 6
		IE = false, // $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
		// flag for mouse tracking
		track = false;
	
	$.tooltip = {
		blocked: false,
		defaults: {
			delay: 200,
			fade: false,
			showURL: true,
			extraClass: "",
			top: 15,
			left: 15,
			id: "tooltip"
		},
		block: function() {
			$.tooltip.blocked = !$.tooltip.blocked;
		}
	};
	
	$.fn.extend({
		tooltip: function(settings) {
			settings = $.extend({}, $.tooltip.defaults, settings);
			createHelper(settings);
			return this.each(function() {
					$.data(this, "tooltip", settings);
					this.tOpacity = helper.parent.css("opacity");
					// copy tooltip into its own expando and remove the title
					this.tooltipText = this.title;
					$(this).removeAttr("title");
					// also remove alt attribute to prevent default tooltip in IE
					this.alt = "";
				})
				.mouseover(save)
				.mouseout(hide)
				.click(hide);
		},
		fixPNG: IE ? function() {
			return this.each(function () {
				var image = $(this).css('backgroundImage');
				if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
					image = RegExp.$1;
					$(this).css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					}).each(function () {
						var position = $(this).css('position');
						if (position != 'absolute' && position != 'relative')
							$(this).css('position', 'relative');
					});
				}
			});
		} : function() { return this; },
		unfixPNG: IE ? function() {
			return this.each(function () {
				$(this).css({'filter': '', backgroundImage: ''});
			});
		} : function() { return this; },
		hideWhenEmpty: function() {
			return this.each(function() {
				$(this)[ $(this).html() ? "show" : "hide" ]();
			});
		},
		url: function() {
			return this.attr('href') || this.attr('src');
		}
	});
	
	function createHelper(settings) {
		// there can be only one tooltip helper
		if( helper.parent )
			return;
		// create the helper, h3 for title, div for url
		helper.parent = $('<div id="' + settings.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>')
			// add to document
			.appendTo(document.body)
			// hide it at first
			.hide();
			
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			helper.parent.bgiframe();
		
		// save references to title and url elements
		helper.title = $('h3', helper.parent);
		helper.body = $('div.body', helper.parent);
		helper.url = $('div.url', helper.parent);
	}
	
	function settings(element) {
		return $.data(element, "tooltip");
	}
	
	// main event handler to start showing tooltips
	function handle(event) {
		// show helper, either with timeout or on instant
		if( settings(this).delay )
			tID = setTimeout(show, settings(this).delay);
		else
			show();
		
		// if selected, update the helper position when the mouse moves
		track = !!settings(this).track;
		$(document.body).bind('mousemove', update);
			
		// update at least once
		update(event);
	}
	
	// save elements title before the tooltip is displayed
	function save() {
		// if this is the current source, or it has no title (occurs with click event), stop
		if ( $.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler) )
			return;

		// save current
		current = this;
		title = this.tooltipText;
		
		if ( settings(this).bodyHandler ) {
			helper.title.hide();
			var bodyContent = settings(this).bodyHandler.call(this);
			if (bodyContent.nodeType || bodyContent.jquery) {
				helper.body.empty().append(bodyContent)
			} else {
				helper.body.html( bodyContent );
			}
			helper.body.show();
		} else if ( settings(this).showBody ) {
			var parts = title.split(settings(this).showBody);
			helper.title.html(parts.shift()).show();
			helper.body.empty();
			for(var i = 0, part; (part = parts[i]); i++) {
				if(i > 0)
					helper.body.append("<br/>");
				helper.body.append(part);
			}
			helper.body.hideWhenEmpty();
		} else {
			helper.title.html(title).show();
			helper.body.hide();
		}
		
		// if element has href or src, add and show it, otherwise hide it
		if( settings(this).showURL && $(this).url() )
			helper.url.html( $(this).url().replace('http://', '') ).show();
		else 
			helper.url.hide();
		
		// add an optional class for this tip
		helper.parent.addClass(settings(this).extraClass);

		// fix PNG background for IE
		if (settings(this).fixPNG )
			helper.parent.fixPNG();
			
		handle.apply(this, arguments);
	}
	
	// delete timeout and show helper
	function show() {
		tID = null;
		if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
			if (helper.parent.is(":animated"))
				helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
			else
				helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
		} else {
			helper.parent.show();
		}
		update();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		if($.tooltip.blocked)
			return;
		
		if (event && event.target.tagName == "OPTION") {
			return;
		}
		
		// stop updating when tracking is disabled and the tooltip is visible
		if ( !track && helper.parent.is(":visible")) {
			$(document.body).unbind('mousemove', update)
		}
		
		// if no current element is available, remove this listener
		if( current == null ) {
			$(document.body).unbind('mousemove', update);
			return;	
		}
		
		// remove position helper classes
		helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
		
		var left = helper.parent[0].offsetLeft;
		var top = helper.parent[0].offsetTop;
		if (event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + settings(current).left;
			top = event.pageY + settings(current).top;
			var right='auto';
			if (settings(current).positionLeft) {
				right = $(window).width() - left;
				left = 'auto';
			}
			helper.parent.css({
				left: left,
				right: right,
				top: top
			});
		}
		
		var v = viewport(),
			h = helper.parent[0];
		// check horizontal position
		if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20 + settings(current).left;
			helper.parent.css({left: left + 'px'}).addClass("viewport-right");
		}
		// check vertical position
		if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20 + settings(current).top;
			helper.parent.css({top: top + 'px'}).addClass("viewport-bottom");
		}
	}
	
	function viewport() {
		return {
			x: $(window).scrollLeft(),
			y: $(window).scrollTop(),
			cx: $(window).width(),
			cy: $(window).height()
		};
	}
	
	// hide helper and restore added classes and the title
	function hide(event) {
		if($.tooltip.blocked)
			return;
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		
		var tsettings = settings(this);
		function complete() {
			helper.parent.removeClass( tsettings.extraClass ).hide().css("opacity", "");
		}
		if ((!IE || !$.fn.bgiframe) && tsettings.fade) {
			if (helper.parent.is(':animated'))
				helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
			else
				helper.parent.stop().fadeOut(tsettings.fade, complete);
		} else
			complete();
		
		if( settings(this).fixPNG )
			helper.parent.unfixPNG();
	}
	
})(jQuery);

/*
 * jQuery UI Monthpicker
 *
 * @licensed MIT <see below>
 * @licensed GPL <see below>
 *
 * @author Luciano Costa
 * http://lucianocosta.info/jquery.mtz.monthpicker/
 *
 * Depends:
 *  jquery.ui.core.js
 */

/**
 * MIT License
 * Copyright (c) 2011, Luciano Costa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * GPL LIcense
 * Copyright (c) 2011, Luciano Costa
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the 
 * Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License 
 * for more details.
 * 
 * You should have received a copy of the GNU General Public License along 
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

;(function ($) {

    var methods = {
        init : function (options) { 
            return this.each(function () {
                var 
                    $this = $(this),
                    data = $this.data('monthpicker'),
                    year = (options && options.year) ? options.year : (new Date()).getFullYear(),
                    settings = $.extend({
                        pattern: 'mm/yyyy',
                        selectedMonth: null,
                        selectedMonthName: '',
                        selectedYear: year,
                        startYear: year - 10,
                        finalYear: year + 10,
                        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        id: "monthpicker_" + (Math.random() * Math.random()).toString().replace('.', ''),
                        openOnFocus: true,
                        disabledMonths: []
                    }, options);

                settings.dateSeparator = settings.pattern.replace(/(mmm|mm|m|yyyy|yy|y)/ig,'');

                // If the plugin hasn't been initialized yet for this element
                if (!data) {

                    $(this).data('monthpicker', {
                        'target': $this,
                        'settings': settings
                    });

                    if (settings.openOnFocus === true) {
                        $this.on('focus', function () {
                            $this.monthpicker('show');
                        });
                    }

                    $this.monthpicker('parseInputValue', settings);

                    $this.monthpicker('mountWidget', settings);

                    $this.on('monthpicker-click-month', function (e, month, year) {
                        $this.monthpicker('setValue', settings);
                        $this.monthpicker('hide');
                    });

                    // hide widget when user clicks elsewhere on page
                    $this.addClass("mtz-monthpicker-widgetcontainer");
                    $(document).unbind("mousedown.mtzmonthpicker").on("mousedown.mtzmonthpicker", function (e) {
                        if (!e.target.className || e.target.className.toString().indexOf('mtz-monthpicker') < 0) {
                            $(this).monthpicker('hideAll'); 
                        }
                    });
                }
            });
        },

        show: function () {
            $(this).monthpicker('hideAll'); 
            var widget = $('#' + this.data('monthpicker').settings.id);
            widget.css("top", this.offset().top  + this.outerHeight());
            if ($(window).width() > (widget.width() + this.offset().left) ){
                widget.css("left", this.offset().left);
            } else {
                widget.css("left", this.offset().left - widget.width());
            }
            widget.show();
            widget.find('select').focus();
            this.trigger('monthpicker-show');
        },

        hide: function () {
            var widget = $('#' + this.data('monthpicker').settings.id);
            if (widget.is(':visible')) {
                widget.hide();
                this.trigger('monthpicker-hide');
            }
        },

        hideAll: function () {
            $(".mtz-monthpicker-widgetcontainer").each(function () {
                if (typeof($(this).data("monthpicker"))!="undefined") { 
                    $(this).monthpicker('hide'); 
                }
            });
        },

        setValue: function (settings) {
            var 
                month = settings.selectedMonth,
                year = settings.selectedYear;

            if(settings.pattern.indexOf('mmm') >= 0) {
                month = settings.selectedMonthName;
            } else if(settings.pattern.indexOf('mm') >= 0 && settings.selectedMonth < 10) {
                month = '0' + settings.selectedMonth;
            }

            if(settings.pattern.indexOf('yyyy') < 0) {
                year = year.toString().substr(2,2);
            } 

            if (settings.pattern.indexOf('y') > settings.pattern.indexOf(settings.dateSeparator)) {
                this.val(month + settings.dateSeparator + year);
            } else {
                this.val(year + settings.dateSeparator + month);
            }
            
            this.change();
        },
        
        setDate: function(dt) {
        	var settings = this.data('monthpicker').settings;
        	settings.selectedYear = dt.getFullYear();
        	settings.selectedMonth = dt.getMonth() + 1;
        	$(this).monthpicker("setValue", settings);
        },

        disableMonths: function (months) {
            var 
                settings = this.data('monthpicker').settings,
                container = $('#' + settings.id);

            settings.disabledMonths = months;

            container.find('.mtz-monthpicker-month').each(function () {
                var m = parseInt($(this).data('month'));
                if ($.inArray(m, months) >= 0) {
                    $(this).addClass('ui-state-disabled');
                } else {
                    $(this).removeClass('ui-state-disabled');
                }
            });
        },

        mountWidget: function (settings) {
            var
                monthpicker = this,
                container = $('<div id="'+ settings.id +'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" />'),
                header = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all mtz-monthpicker" />'),
                combo = $('<select class="mtz-monthpicker mtz-monthpicker-year" />'),
                table = $('<table class="mtz-monthpicker" />'),
                tbody = $('<tbody class="mtz-monthpicker" />'),
                tr = $('<tr class="mtz-monthpicker" />'),
                td = '',
                selectedYear = settings.selectedYear,
                option = null,
                attrSelectedYear = $(this).data('selected-year'),
                attrStartYear = $(this).data('start-year'),
                attrFinalYear = $(this).data('final-year');

            if (attrSelectedYear) {
                settings.selectedYear = attrSelectedYear;
            }

            if (attrStartYear) {
                settings.startYear = attrStartYear;
            }

            if (attrFinalYear) {
                settings.finalYear = attrFinalYear;
            }

            container.css({
                position:'absolute',
                zIndex:999999,
                whiteSpace:'nowrap',
                width:'250px',
                overflow:'hidden',
                textAlign:'center',
                display:'none',
                top: monthpicker.offset().top + monthpicker.outerHeight(),
                left: monthpicker.offset().left
            });

            combo.on('change', function () { 
                var months = $(this).parent().parent().find('td[data-month]');
                months.removeClass('ui-state-active');
                if ($(this).val() == settings.selectedYear) {
                    months.filter('td[data-month='+ settings.selectedMonth +']').addClass('ui-state-active');
                }
                monthpicker.trigger('monthpicker-change-year', $(this).val());
            });

            // mount years combo
            for (var i = settings.startYear; i <= settings.finalYear; i++) {
                var option = $('<option class="mtz-monthpicker" />').attr('value', i).append(i);
                if (settings.selectedYear == i) {
                    option.attr('selected', 'selected');
                }
                combo.append(option);
            }
            header.append(combo).appendTo(container);

            // mount months table
            for (var i=1; i<=12; i++) {
                td = $('<td class="ui-state-default mtz-monthpicker mtz-monthpicker-month" style="padding:5px;cursor:default;" />').attr('data-month',i);
                if (settings.selectedMonth == i) {
                   td.addClass('ui-state-active');
                }
                td.append(settings.monthNames[i-1]);
                tr.append(td).appendTo(tbody);
                if (i % 3 === 0) {
                    tr = $('<tr class="mtz-monthpicker" />'); 
                }
            }

            tbody.find('.mtz-monthpicker-month').on('click', function () {
                var m = parseInt($(this).data('month'));
                if ($.inArray(m, settings.disabledMonths) < 0 ) {
                    settings.selectedYear = $(this).closest('.ui-datepicker').find('.mtz-monthpicker-year').first().val();
                    settings.selectedMonth = $(this).data('month');
                    settings.selectedMonthName = $(this).text();
                    monthpicker.trigger('monthpicker-click-month', $(this).data('month'));
                    $(this).closest('table').find('.ui-state-active').removeClass('ui-state-active');
                    $(this).addClass('ui-state-active');
                }
            });

            table.append(tbody).appendTo(container);

            container.appendTo('body');
        },

        destroy: function () {
            return this.each(function () {
                $(this).removeClass('mtz-monthpicker-widgetcontainer').unbind('focus').removeData('monthpicker');
            });
        },

        getDate: function () {
            var settings = this.data('monthpicker').settings;
            if (settings.selectedMonth && settings.selectedYear) {
                return new Date(settings.selectedYear, settings.selectedMonth -1);
            } else {
                return null;
            }
        },

        parseInputValue: function (settings) {
            if (this.val()) {
                if (settings.dateSeparator) {
                    var val = this.val().toString().split(settings.dateSeparator);
                    if (settings.pattern.indexOf('m') === 0) {
                        settings.selectedMonth = val[0];
                        settings.selectedYear = val[1];
                    } else {
                        settings.selectedMonth = val[1];
                        settings.selectedYear = val[0];                                
                    }
                }
            }
        }
    };

    $.fn.monthpicker = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.mtz.monthpicker');
        }    
    };

})(jQuery);

/*
 * zClip :: jQuery ZeroClipboard v1.1.1
 * http://steamdev.com/zclip
 *
 * Copyright 2011, SteamDev
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Wed Jun 01, 2011
 */


(function ($) {

    $.fn.zclip = function (params) {

        if (typeof params == "object" && !params.length) {

            var settings = $.extend({

                path: 'ZeroClipboard.swf',
                copy: null,
                beforeCopy: null,
                afterCopy: null,
                clickAfter: true,
                setHandCursor: true,
                setCSSEffects: true

            }, params);
			

            return this.each(function () {

                var o = $(this);

                if (o.is(':visible') && (typeof settings.copy == 'string' || $.isFunction(settings.copy))) {

                    ZeroClipboard.setMoviePath(settings.path);
                    var clip = new ZeroClipboard.Client();
                    
                    if($.isFunction(settings.copy)){
                    	o.bind('zClip_copy',settings.copy);
                    }
                    if($.isFunction(settings.beforeCopy)){
                    	o.bind('zClip_beforeCopy',settings.beforeCopy);
                    }
                    if($.isFunction(settings.afterCopy)){
                    	o.bind('zClip_afterCopy',settings.afterCopy);
                    }                    

                    clip.setHandCursor(settings.setHandCursor);
                    clip.setCSSEffects(settings.setCSSEffects);
                    clip.addEventListener('mouseOver', function (client) {
                        o.trigger('mouseenter');
                    });
                    clip.addEventListener('mouseOut', function (client) {
                        o.trigger('mouseleave');
                    });
                    clip.addEventListener('mouseDown', function (client) {

                        o.trigger('mousedown');
                        
			if(!$.isFunction(settings.copy)){
			   clip.setText(settings.copy);
			} else {
			   clip.setText(o.triggerHandler('zClip_copy'));
			}                        
                        
                        if ($.isFunction(settings.beforeCopy)) {
                            o.trigger('zClip_beforeCopy');                            
                        }

                    });

                    clip.addEventListener('complete', function (client, text) {

                        if ($.isFunction(settings.afterCopy)) {
                            
                            o.trigger('zClip_afterCopy');

                        } else {
                            if (text.length > 500) {
                                text = text.substr(0, 500) + "...\n\n(" + (text.length - 500) + " characters not shown)";
                            }
							
			    o.removeClass('hover');
                            alert("Copied text to clipboard:\n\n " + text);
                        }

                        if (settings.clickAfter) {
                            o.trigger('click');
                        }

                    });

					
                    clip.glue(o[0], o.parent()[0]);
					
		    $(window).bind('load resize',function(){clip.reposition();});
					

                }

            });

        } else if (typeof params == "string") {

            return this.each(function () {

                var o = $(this);

                params = params.toLowerCase();
                var zclipId = o.data('zclipId');
                var clipElm = $('#' + zclipId + '.zclip');

                if (params == "remove") {

                    clipElm.remove();
                    o.removeClass('active hover');

                } else if (params == "hide") {

                    clipElm.hide();
                    o.removeClass('active hover');

                } else if (params == "show") {

                    clipElm.show();

                }

            });

        }

    }	
	
	

})(jQuery);







// ZeroClipboard
// Simple Set Clipboard System
// Author: Joseph Huckaby
var ZeroClipboard = {

    version: "1.0.7",
    clients: {},
    // registered upload clients on page, indexed by id
    moviePath: 'ZeroClipboard.swf',
    // URL to movie
    nextId: 1,
    // ID of next movie
    $: function (thingy) {
        // simple DOM lookup utility function
        if (typeof(thingy) == 'string') thingy = document.getElementById(thingy);
        if (!thingy.addClass) {
            // extend element with a few useful methods
            thingy.hide = function () {
                this.style.display = 'none';
            };
            thingy.show = function () {
                this.style.display = '';
            };
            thingy.addClass = function (name) {
                this.removeClass(name);
                this.className += ' ' + name;
            };
            thingy.removeClass = function (name) {
                var classes = this.className.split(/\s+/);
                var idx = -1;
                for (var k = 0; k < classes.length; k++) {
                    if (classes[k] == name) {
                        idx = k;
                        k = classes.length;
                    }
                }
                if (idx > -1) {
                    classes.splice(idx, 1);
                    this.className = classes.join(' ');
                }
                return this;
            };
            thingy.hasClass = function (name) {
                return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
            };
        }
        return thingy;
    },

    setMoviePath: function (path) {
        // set path to ZeroClipboard.swf
        this.moviePath = path;
    },

    dispatch: function (id, eventName, args) {
        // receive event from flash movie, send to client		
        var client = this.clients[id];
        if (client) {
            client.receiveEvent(eventName, args);
        }
    },

    register: function (id, client) {
        // register new client to receive events
        this.clients[id] = client;
    },

    getDOMObjectPosition: function (obj, stopObj) {
        // get absolute coordinates for dom element
        var info = {
            left: 0,
            top: 0,
            width: obj.width ? obj.width : obj.offsetWidth,
            height: obj.height ? obj.height : obj.offsetHeight
        };

        if (obj && (obj != stopObj)) {
			info.left += obj.offsetLeft;
            info.top += obj.offsetTop;
        }

        return info;
    },

    Client: function (elem) {
        // constructor for new simple upload client
        this.handlers = {};

        // unique ID
        this.id = ZeroClipboard.nextId++;
        this.movieId = 'ZeroClipboardMovie_' + this.id;

        // register client with singleton to receive flash events
        ZeroClipboard.register(this.id, this);

        // create movie
        if (elem) this.glue(elem);
    }
};

ZeroClipboard.Client.prototype = {

    id: 0,
    // unique ID for us
    ready: false,
    // whether movie is ready to receive events or not
    movie: null,
    // reference to movie object
    clipText: '',
    // text to copy to clipboard
    handCursorEnabled: true,
    // whether to show hand cursor, or default pointer cursor
    cssEffects: true,
    // enable CSS mouse effects on dom container
    handlers: null,
    // user event handlers
    glue: function (elem, appendElem, stylesToAdd) {
        // glue to DOM element
        // elem can be ID or actual DOM element object
        this.domElement = ZeroClipboard.$(elem);

        // float just above object, or zIndex 99 if dom element isn't set
        var zIndex = 99;
        if (this.domElement.style.zIndex) {
            zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
        }

        if (typeof(appendElem) == 'string') {
            appendElem = ZeroClipboard.$(appendElem);
        } else if (typeof(appendElem) == 'undefined') {
            appendElem = document.getElementsByTagName('body')[0];
        }

        // find X/Y position of domElement
        var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);

        // create floating DIV above element
        this.div = document.createElement('div');
        this.div.className = "zclip";
        this.div.id = "zclip-" + this.movieId;
        $(this.domElement).data('zclipId', 'zclip-' + this.movieId);
        var style = this.div.style;
        style.position = 'absolute';
        style.left = '' + box.left + 'px';
        style.top = '' + box.top + 'px';
        style.width = '' + box.width + 'px';
        style.height = '' + box.height + 'px';
        style.zIndex = zIndex;

        if (typeof(stylesToAdd) == 'object') {
            for (addedStyle in stylesToAdd) {
                style[addedStyle] = stylesToAdd[addedStyle];
            }
        }

        // style.backgroundColor = '#f00'; // debug
        appendElem.appendChild(this.div);

        this.div.innerHTML = this.getHTML(box.width, box.height);
    },

    getHTML: function (width, height) {
        // return HTML for movie
        var html = '';
        var flashvars = 'id=' + this.id + '&width=' + width + '&height=' + height;

        if (navigator.userAgent.match(/MSIE/)) {
            // IE gets an OBJECT tag
            var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
            html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
        } else {
            // all other browsers get an EMBED tag
            html += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
        }
        return html;
    },

    hide: function () {
        // temporarily hide floater offscreen
        if (this.div) {
            this.div.style.left = '-2000px';
        }
    },

    show: function () {
        // show ourselves after a call to hide()
        this.reposition();
    },

    destroy: function () {
        // destroy control and floater
        if (this.domElement && this.div) {
            this.hide();
            this.div.innerHTML = '';

            var body = document.getElementsByTagName('body')[0];
            try {
                body.removeChild(this.div);
            } catch (e) {;
            }

            this.domElement = null;
            this.div = null;
        }
    },

    reposition: function (elem) {
        // reposition our floating div, optionally to new container
        // warning: container CANNOT change size, only position
        if (elem) {
            this.domElement = ZeroClipboard.$(elem);
            if (!this.domElement) this.hide();
        }

        if (this.domElement && this.div) {
            var box = ZeroClipboard.getDOMObjectPosition(this.domElement);
            var style = this.div.style;
            style.left = '' + box.left + 'px';
            style.top = '' + box.top + 'px';
        }
    },

    setText: function (newText) {
        // set text to be copied to clipboard
        this.clipText = newText;
        if (this.ready) {
            this.movie.setText(newText);
        }
    },

    addEventListener: function (eventName, func) {
        // add user event listener for event
        // event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
        eventName = eventName.toString().toLowerCase().replace(/^on/, '');
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(func);
    },

    setHandCursor: function (enabled) {
        // enable hand cursor (true), or default arrow cursor (false)
        this.handCursorEnabled = enabled;
        if (this.ready) {
            this.movie.setHandCursor(enabled);
        }
    },

    setCSSEffects: function (enabled) {
        // enable or disable CSS effects on DOM container
        this.cssEffects = !! enabled;
    },

    receiveEvent: function (eventName, args) {
        // receive event from flash
        eventName = eventName.toString().toLowerCase().replace(/^on/, '');

        // special behavior for certain events
        switch (eventName) {
        case 'load':
            // movie claims it is ready, but in IE this isn't always the case...
            // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
            this.movie = document.getElementById(this.movieId);
            if (!this.movie) {
                var self = this;
                setTimeout(function () {
                    self.receiveEvent('load', null);
                }, 1);
                return;
            }

            // firefox on pc needs a "kick" in order to set these in certain cases
            if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                var self = this;
                setTimeout(function () {
                    self.receiveEvent('load', null);
                }, 100);
                this.ready = true;
                return;
            }

            this.ready = true;
            try {
                this.movie.setText(this.clipText);
            } catch (e) {}
            try {
                this.movie.setHandCursor(this.handCursorEnabled);
            } catch (e) {}
            break;

        case 'mouseover':
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass('hover');
                if (this.recoverActive) {
                    this.domElement.addClass('active');
                }


            }


            break;

        case 'mouseout':
            if (this.domElement && this.cssEffects) {
                this.recoverActive = false;
                if (this.domElement.hasClass('active')) {
                    this.domElement.removeClass('active');
                    this.recoverActive = true;
                }
                this.domElement.removeClass('hover');

            }
            break;

        case 'mousedown':
            if (this.domElement && this.cssEffects) {
                this.domElement.addClass('active');
            }
            break;

        case 'mouseup':
            if (this.domElement && this.cssEffects) {
                this.domElement.removeClass('active');
                this.recoverActive = false;
            }
            break;
        } // switch eventName
        if (this.handlers[eventName]) {
            for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
                var func = this.handlers[eventName][idx];

                if (typeof(func) == 'function') {
                    // actual function reference
                    func(this, args);
                } else if ((typeof(func) == 'object') && (func.length == 2)) {
                    // PHP style object + method, i.e. [myObject, 'myMethod']
                    func[0][func[1]](this, args);
                } else if (typeof(func) == 'string') {
                    // name of function
                    window[func](this, args);
                }
            } // foreach event handler defined
        } // user defined handler for event
    }

};	


/*
 * jQuery plugin: fieldSelection - v0.1.0 - last change: 2006-12-16
 * (c) 2006 Alex Brem <alex@0xab.cd> - http://blog.0xab.cd
 */

(function() {

	var fieldSelection = {

		getSelection: function() {

			var e = this.jquery ? this[0] : this;

			return (

				/* mozilla / dom 3.0 */
				('selectionStart' in e && function() {
					var l = e.selectionEnd - e.selectionStart;
					return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
				}) ||

				/* exploder */
				(document.selection && function() {

					e.focus();

					var r = document.selection.createRange();
					if (r == null) {
						return { start: 0, end: e.value.length, length: 0 }
					}

					var re = e.createTextRange();
					var rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);

					return { start: rc.text.length, end: rc.text.length + r.text.length, length: r.text.length, text: r.text };
				}) ||

				/* browser not supported */
				function() {
					return { start: 0, end: e.value.length, length: 0 };
				}

			)();

		},

		replaceSelection: function() {

			var e = this.jquery ? this[0] : this;
			var text = arguments[0] || '';

			return (

				/* mozilla / dom 3.0 */
				('selectionStart' in e && function() {
					e.value = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length);
					return this;
				}) ||

				/* exploder */
				(document.selection && function() {
					e.focus();
					document.selection.createRange().text = text;
					return this;
				}) ||

				/* browser not supported */
				function() {
					e.value += text;
					return this;
				}

			)();

		}

	};

	jQuery.each(fieldSelection, function(i) { jQuery.fn[i] = this; });

})();

/*
 * jQuery File Upload Plugin 5.42.3
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global define, require, window, document, location, Blob, FormData */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'jquery.ui.widget'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS:
        factory(
            require('jquery'),
            require('./vendor/jquery.ui.widget')
        );
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // Detect file input support, based on
    // http://viljamis.com/blog/2012/file-upload-support-on-mobile/
    $.support.fileInput = !(new RegExp(
        // Handle devices which give false positives for the feature detection:
        '(Android (1\\.[0156]|2\\.[01]))' +
            '|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)' +
            '|(w(eb)?OSBrowser)|(webOS)' +
            '|(Kindle/(1\\.0|2\\.[05]|3\\.0))'
    ).test(window.navigator.userAgent) ||
        // Feature detection for all other devices:
        $('<input type="file">').prop('disabled'));

    // The FileReader API is not actually used, but works as feature detection,
    // as some Safari versions (5?) support XHR file uploads via the FormData API,
    // but not non-multipart XHR file uploads.
    // window.XMLHttpRequestUpload is not available on IE10, so we check for
    // window.ProgressEvent instead to detect XHR2 file upload capability:
    $.support.xhrFileUpload = !!(window.ProgressEvent && window.FileReader);
    $.support.xhrFormDataFileUpload = !!window.FormData;

    // Detect support for Blob slicing (required for chunked uploads):
    $.support.blobSlice = window.Blob && (Blob.prototype.slice ||
        Blob.prototype.webkitSlice || Blob.prototype.mozSlice);

    // Helper function to create drag handlers for dragover/dragenter/dragleave:
    function getDragHandler(type) {
        var isDragOver = type === 'dragover';
        return function (e) {
            e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var dataTransfer = e.dataTransfer;
            if (dataTransfer && $.inArray('Files', dataTransfer.types) !== -1 &&
                    this._trigger(
                        type,
                        $.Event(type, {delegatedEvent: e})
                    ) !== false) {
                e.preventDefault();
                if (isDragOver) {
                    dataTransfer.dropEffect = 'copy';
                }
            }
        };
    }

    // The fileupload widget listens for change events on file input fields defined
    // via fileInput setting and paste or drop events of the given dropZone.
    // In addition to the default jQuery Widget methods, the fileupload widget
    // exposes the "add" and "send" methods, to add or directly send files using
    // the fileupload API.
    // By default, files added via file input selection, paste, drag & drop or
    // "add" method are uploaded immediately, but it is possible to override
    // the "add" callback option to queue file uploads.
    $.widget('blueimp.fileupload', {

        options: {
            // The drop target element(s), by the default the complete document.
            // Set to null to disable drag & drop support:
            dropZone: $(document),
            // The paste target element(s), by the default undefined.
            // Set to a DOM node or jQuery object to enable file pasting:
            pasteZone: undefined,
            // The file input field(s), that are listened to for change events.
            // If undefined, it is set to the file input fields inside
            // of the widget element on plugin initialization.
            // Set to null to disable the change listener.
            fileInput: undefined,
            // By default, the file input field is replaced with a clone after
            // each input field change event. This is required for iframe transport
            // queues and allows change events to be fired for the same file
            // selection, but can be disabled by setting the following option to false:
            replaceFileInput: true,
            // The parameter name for the file form data (the request argument name).
            // If undefined or empty, the name property of the file input field is
            // used, or "files[]" if the file input name property is also empty,
            // can be a string or an array of strings:
            paramName: undefined,
            // By default, each file of a selection is uploaded using an individual
            // request for XHR type uploads. Set to false to upload file
            // selections in one request each:
            singleFileUploads: true,
            // To limit the number of files uploaded with one XHR request,
            // set the following option to an integer greater than 0:
            limitMultiFileUploads: undefined,
            // The following option limits the number of files uploaded with one
            // XHR request to keep the request size under or equal to the defined
            // limit in bytes:
            limitMultiFileUploadSize: undefined,
            // Multipart file uploads add a number of bytes to each uploaded file,
            // therefore the following option adds an overhead for each file used
            // in the limitMultiFileUploadSize configuration:
            limitMultiFileUploadSizeOverhead: 512,
            // Set the following option to true to issue all file upload requests
            // in a sequential order:
            sequentialUploads: false,
            // To limit the number of concurrent uploads,
            // set the following option to an integer greater than 0:
            limitConcurrentUploads: undefined,
            // Set the following option to true to force iframe transport uploads:
            forceIframeTransport: false,
            // Set the following option to the location of a redirect url on the
            // origin server, for cross-domain iframe transport uploads:
            redirect: undefined,
            // The parameter name for the redirect url, sent as part of the form
            // data and set to 'redirect' if this option is empty:
            redirectParamName: undefined,
            // Set the following option to the location of a postMessage window,
            // to enable postMessage transport uploads:
            postMessage: undefined,
            // By default, XHR file uploads are sent as multipart/form-data.
            // The iframe transport is always using multipart/form-data.
            // Set to false to enable non-multipart XHR uploads:
            multipart: true,
            // To upload large files in smaller chunks, set the following option
            // to a preferred maximum chunk size. If set to 0, null or undefined,
            // or the browser does not support the required Blob API, files will
            // be uploaded as a whole.
            maxChunkSize: undefined,
            // When a non-multipart upload or a chunked multipart upload has been
            // aborted, this option can be used to resume the upload by setting
            // it to the size of the already uploaded bytes. This option is most
            // useful when modifying the options object inside of the "add" or
            // "send" callbacks, as the options are cloned for each file upload.
            uploadedBytes: undefined,
            // By default, failed (abort or error) file uploads are removed from the
            // global progress calculation. Set the following option to false to
            // prevent recalculating the global progress data:
            recalculateProgress: true,
            // Interval in milliseconds to calculate and trigger progress events:
            progressInterval: 100,
            // Interval in milliseconds to calculate progress bitrate:
            bitrateInterval: 500,
            // By default, uploads are started automatically when adding files:
            autoUpload: true,

            // Error and info messages:
            messages: {
                uploadedBytes: 'Uploaded bytes exceed file size'
            },

            // Translation function, gets the message key to be translated
            // and an object with context specific data as arguments:
            i18n: function (message, context) {
                message = this.messages[message] || message.toString();
                if (context) {
                    $.each(context, function (key, value) {
                        message = message.replace('{' + key + '}', value);
                    });
                }
                return message;
            },

            // Additional form data to be sent along with the file uploads can be set
            // using this option, which accepts an array of objects with name and
            // value properties, a function returning such an array, a FormData
            // object (for XHR file uploads), or a simple object.
            // The form of the first fileInput is given as parameter to the function:
            formData: function (form) {
                return form.serializeArray();
            },

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop, paste or add API call).
            // If the singleFileUploads option is enabled, this callback will be
            // called once for each file in the selection for XHR file uploads, else
            // once for each file selection.
            //
            // The upload starts when the submit method is invoked on the data parameter.
            // The data object contains a files property holding the added files
            // and allows you to override plugin options as well as define ajax settings.
            //
            // Listeners for this callback can also be bound the following way:
            // .bind('fileuploadadd', func);
            //
            // data.submit() returns a Promise object and allows to attach additional
            // handlers using jQuery's Deferred callbacks:
            // data.submit().done(func).fail(func).always(func);
            add: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                if (data.autoUpload || (data.autoUpload !== false &&
                        $(this).fileupload('option', 'autoUpload'))) {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },

            // Other callbacks:

            // Callback for the submit event of each file upload:
            // submit: function (e, data) {}, // .bind('fileuploadsubmit', func);

            // Callback for the start of each file upload request:
            // send: function (e, data) {}, // .bind('fileuploadsend', func);

            // Callback for successful uploads:
            // done: function (e, data) {}, // .bind('fileuploaddone', func);

            // Callback for failed (abort or error) uploads:
            // fail: function (e, data) {}, // .bind('fileuploadfail', func);

            // Callback for completed (success, abort or error) requests:
            // always: function (e, data) {}, // .bind('fileuploadalways', func);

            // Callback for upload progress events:
            // progress: function (e, data) {}, // .bind('fileuploadprogress', func);

            // Callback for global upload progress events:
            // progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);

            // Callback for uploads start, equivalent to the global ajaxStart event:
            // start: function (e) {}, // .bind('fileuploadstart', func);

            // Callback for uploads stop, equivalent to the global ajaxStop event:
            // stop: function (e) {}, // .bind('fileuploadstop', func);

            // Callback for change events of the fileInput(s):
            // change: function (e, data) {}, // .bind('fileuploadchange', func);

            // Callback for paste events to the pasteZone(s):
            // paste: function (e, data) {}, // .bind('fileuploadpaste', func);

            // Callback for drop events of the dropZone(s):
            // drop: function (e, data) {}, // .bind('fileuploaddrop', func);

            // Callback for dragover events of the dropZone(s):
            // dragover: function (e) {}, // .bind('fileuploaddragover', func);

            // Callback for the start of each chunk upload request:
            // chunksend: function (e, data) {}, // .bind('fileuploadchunksend', func);

            // Callback for successful chunk uploads:
            // chunkdone: function (e, data) {}, // .bind('fileuploadchunkdone', func);

            // Callback for failed (abort or error) chunk uploads:
            // chunkfail: function (e, data) {}, // .bind('fileuploadchunkfail', func);

            // Callback for completed (success, abort or error) chunk upload requests:
            // chunkalways: function (e, data) {}, // .bind('fileuploadchunkalways', func);

            // The plugin options are used as settings object for the ajax calls.
            // The following are jQuery ajax settings required for the file uploads:
            processData: false,
            contentType: false,
            cache: false
        },

        // A list of options that require reinitializing event listeners and/or
        // special initialization code:
        _specialOptions: [
            'fileInput',
            'dropZone',
            'pasteZone',
            'multipart',
            'forceIframeTransport'
        ],

        _blobSlice: $.support.blobSlice && function () {
            var slice = this.slice || this.webkitSlice || this.mozSlice;
            return slice.apply(this, arguments);
        },

        _BitrateTimer: function () {
            this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (now, loaded, interval) {
                var timeDiff = now - this.timestamp;
                if (!this.bitrate || !interval || timeDiff > interval) {
                    this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
                    this.loaded = loaded;
                    this.timestamp = now;
                }
                return this.bitrate;
            };
        },

        _isXHRUpload: function (options) {
            return !options.forceIframeTransport &&
                ((!options.multipart && $.support.xhrFileUpload) ||
                $.support.xhrFormDataFileUpload);
        },

        _getFormData: function (options) {
            var formData;
            if ($.type(options.formData) === 'function') {
                return options.formData(options.form);
            }
            if ($.isArray(options.formData)) {
                return options.formData;
            }
            if ($.type(options.formData) === 'object') {
                formData = [];
                $.each(options.formData, function (name, value) {
                    formData.push({name: name, value: value});
                });
                return formData;
            }
            return [];
        },

        _getTotal: function (files) {
            var total = 0;
            $.each(files, function (index, file) {
                total += file.size || 1;
            });
            return total;
        },

        _initProgressObject: function (obj) {
            var progress = {
                loaded: 0,
                total: 0,
                bitrate: 0
            };
            if (obj._progress) {
                $.extend(obj._progress, progress);
            } else {
                obj._progress = progress;
            }
        },

        _initResponseObject: function (obj) {
            var prop;
            if (obj._response) {
                for (prop in obj._response) {
                    if (obj._response.hasOwnProperty(prop)) {
                        delete obj._response[prop];
                    }
                }
            } else {
                obj._response = {};
            }
        },

        _onProgress: function (e, data) {
            if (e.lengthComputable) {
                var now = ((Date.now) ? Date.now() : (new Date()).getTime()),
                    loaded;
                if (data._time && data.progressInterval &&
                        (now - data._time < data.progressInterval) &&
                        e.loaded !== e.total) {
                    return;
                }
                data._time = now;
                loaded = Math.floor(
                    e.loaded / e.total * (data.chunkSize || data._progress.total)
                ) + (data.uploadedBytes || 0);
                // Add the difference from the previously loaded state
                // to the global loaded counter:
                this._progress.loaded += (loaded - data._progress.loaded);
                this._progress.bitrate = this._bitrateTimer.getBitrate(
                    now,
                    this._progress.loaded,
                    data.bitrateInterval
                );
                data._progress.loaded = data.loaded = loaded;
                data._progress.bitrate = data.bitrate = data._bitrateTimer.getBitrate(
                    now,
                    loaded,
                    data.bitrateInterval
                );
                // Trigger a custom progress event with a total data property set
                // to the file size(s) of the current upload and a loaded data
                // property calculated accordingly:
                this._trigger(
                    'progress',
                    $.Event('progress', {delegatedEvent: e}),
                    data
                );
                // Trigger a global progress event for all current file uploads,
                // including ajax calls queued for sequential file uploads:
                this._trigger(
                    'progressall',
                    $.Event('progressall', {delegatedEvent: e}),
                    this._progress
                );
            }
        },

        _initProgressListener: function (options) {
            var that = this,
                xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
            // Accesss to the native XHR object is required to add event listeners
            // for the upload progress event:
            if (xhr.upload) {
                $(xhr.upload).bind('progress', function (e) {
                    var oe = e.originalEvent;
                    // Make sure the progress event properties get copied over:
                    e.lengthComputable = oe.lengthComputable;
                    e.loaded = oe.loaded;
                    e.total = oe.total;
                    that._onProgress(e, options);
                });
                options.xhr = function () {
                    return xhr;
                };
            }
        },

        _isInstanceOf: function (type, obj) {
            // Cross-frame instanceof check
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        },

        _initXHRData: function (options) {
            var that = this,
                formData,
                file = options.files[0],
                // Ignore non-multipart setting if not supported:
                multipart = options.multipart || !$.support.xhrFileUpload,
                paramName = $.type(options.paramName) === 'array' ?
                    options.paramName[0] : options.paramName;
            options.headers = $.extend({}, options.headers);
            if (options.contentRange) {
                options.headers['Content-Range'] = options.contentRange;
            }
            if (!multipart || options.blob || !this._isInstanceOf('File', file)) {
                options.headers['Content-Disposition'] = 'attachment; filename="' +
                    encodeURI(file.name) + '"';
            }
            if (!multipart) {
                options.contentType = file.type || 'application/octet-stream';
                options.data = options.blob || file;
            } else if ($.support.xhrFormDataFileUpload) {
                if (options.postMessage) {
                    // window.postMessage does not allow sending FormData
                    // objects, so we just add the File/Blob objects to
                    // the formData array and let the postMessage window
                    // create the FormData object out of this array:
                    formData = this._getFormData(options);
                    if (options.blob) {
                        formData.push({
                            name: paramName,
                            value: options.blob
                        });
                    } else {
                        $.each(options.files, function (index, file) {
                            formData.push({
                                name: ($.type(options.paramName) === 'array' &&
                                    options.paramName[index]) || paramName,
                                value: file
                            });
                        });
                    }
                } else {
                    if (that._isInstanceOf('FormData', options.formData)) {
                        formData = options.formData;
                    } else {
                        formData = new FormData();
                        $.each(this._getFormData(options), function (index, field) {
                            formData.append(field.name, field.value);
                        });
                    }
                    if (options.blob) {
                        formData.append(paramName, options.blob, file.name);
                    } else {
                        $.each(options.files, function (index, file) {
                            // This check allows the tests to run with
                            // dummy objects:
                            if (that._isInstanceOf('File', file) ||
                                    that._isInstanceOf('Blob', file)) {
                                formData.append(
                                    ($.type(options.paramName) === 'array' &&
                                        options.paramName[index]) || paramName,
                                    file,
                                    file.uploadName || file.name
                                );
                            }
                        });
                    }
                }
                options.data = formData;
            }
            // Blob reference is not needed anymore, free memory:
            options.blob = null;
        },

        _initIframeSettings: function (options) {
            var targetHost = $('<a></a>').prop('href', options.url).prop('host');
            // Setting the dataType to iframe enables the iframe transport:
            options.dataType = 'iframe ' + (options.dataType || '');
            // The iframe transport accepts a serialized array as form data:
            options.formData = this._getFormData(options);
            // Add redirect url to form data on cross-domain uploads:
            if (options.redirect && targetHost && targetHost !== location.host) {
                options.formData.push({
                    name: options.redirectParamName || 'redirect',
                    value: options.redirect
                });
            }
        },

        _initDataSettings: function (options) {
            if (this._isXHRUpload(options)) {
                if (!this._chunkedUpload(options, true)) {
                    if (!options.data) {
                        this._initXHRData(options);
                    }
                    this._initProgressListener(options);
                }
                if (options.postMessage) {
                    // Setting the dataType to postmessage enables the
                    // postMessage transport:
                    options.dataType = 'postmessage ' + (options.dataType || '');
                }
            } else {
                this._initIframeSettings(options);
            }
        },

        _getParamName: function (options) {
            var fileInput = $(options.fileInput),
                paramName = options.paramName;
            if (!paramName) {
                paramName = [];
                fileInput.each(function () {
                    var input = $(this),
                        name = input.prop('name') || 'files[]',
                        i = (input.prop('files') || [1]).length;
                    while (i) {
                        paramName.push(name);
                        i -= 1;
                    }
                });
                if (!paramName.length) {
                    paramName = [fileInput.prop('name') || 'files[]'];
                }
            } else if (!$.isArray(paramName)) {
                paramName = [paramName];
            }
            return paramName;
        },

        _initFormSettings: function (options) {
            // Retrieve missing options from the input field and the
            // associated form, if available:
            if (!options.form || !options.form.length) {
                options.form = $(options.fileInput.prop('form'));
                // If the given file input doesn't have an associated form,
                // use the default widget file input's form:
                if (!options.form.length) {
                    options.form = $(this.options.fileInput.prop('form'));
                }
            }
            options.paramName = this._getParamName(options);
            if (!options.url) {
                options.url = options.form.prop('action') || location.href;
            }
            // The HTTP request method must be "POST" or "PUT":
            options.type = (options.type ||
                ($.type(options.form.prop('method')) === 'string' &&
                    options.form.prop('method')) || ''
                ).toUpperCase();
            if (options.type !== 'POST' && options.type !== 'PUT' &&
                    options.type !== 'PATCH') {
                options.type = 'POST';
            }
            if (!options.formAcceptCharset) {
                options.formAcceptCharset = options.form.attr('accept-charset');
            }
        },

        _getAJAXSettings: function (data) {
            var options = $.extend({}, this.options, data);
            this._initFormSettings(options);
            this._initDataSettings(options);
            return options;
        },

        // jQuery 1.6 doesn't provide .state(),
        // while jQuery 1.8+ removed .isRejected() and .isResolved():
        _getDeferredState: function (deferred) {
            if (deferred.state) {
                return deferred.state();
            }
            if (deferred.isResolved()) {
                return 'resolved';
            }
            if (deferred.isRejected()) {
                return 'rejected';
            }
            return 'pending';
        },

        // Maps jqXHR callbacks to the equivalent
        // methods of the given Promise object:
        _enhancePromise: function (promise) {
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            return promise;
        },

        // Creates and returns a Promise object enhanced with
        // the jqXHR methods abort, success, error and complete:
        _getXHRPromise: function (resolveOrReject, context, args) {
            var dfd = $.Deferred(),
                promise = dfd.promise();
            context = context || this.options.context || promise;
            if (resolveOrReject === true) {
                dfd.resolveWith(context, args);
            } else if (resolveOrReject === false) {
                dfd.rejectWith(context, args);
            }
            promise.abort = dfd.promise;
            return this._enhancePromise(promise);
        },

        // Adds convenience methods to the data callback argument:
        _addConvenienceMethods: function (e, data) {
            var that = this,
                getPromise = function (args) {
                    return $.Deferred().resolveWith(that, args).promise();
                };
            data.process = function (resolveFunc, rejectFunc) {
                if (resolveFunc || rejectFunc) {
                    data._processQueue = this._processQueue =
                        (this._processQueue || getPromise([this])).pipe(
                            function () {
                                if (data.errorThrown) {
                                    return $.Deferred()
                                        .rejectWith(that, [data]).promise();
                                }
                                return getPromise(arguments);
                            }
                        ).pipe(resolveFunc, rejectFunc);
                }
                return this._processQueue || getPromise([this]);
            };
            data.submit = function () {
                if (this.state() !== 'pending') {
                    data.jqXHR = this.jqXHR =
                        (that._trigger(
                            'submit',
                            $.Event('submit', {delegatedEvent: e}),
                            this
                        ) !== false) && that._onSend(e, this);
                }
                return this.jqXHR || that._getXHRPromise();
            };
            data.abort = function () {
                if (this.jqXHR) {
                    return this.jqXHR.abort();
                }
                this.errorThrown = 'abort';
                that._trigger('fail', null, this);
                return that._getXHRPromise(false);
            };
            data.state = function () {
                if (this.jqXHR) {
                    return that._getDeferredState(this.jqXHR);
                }
                if (this._processQueue) {
                    return that._getDeferredState(this._processQueue);
                }
            };
            data.processing = function () {
                return !this.jqXHR && this._processQueue && that
                    ._getDeferredState(this._processQueue) === 'pending';
            };
            data.progress = function () {
                return this._progress;
            };
            data.response = function () {
                return this._response;
            };
        },

        // Parses the Range header from the server response
        // and returns the uploaded bytes:
        _getUploadedBytes: function (jqXHR) {
            var range = jqXHR.getResponseHeader('Range'),
                parts = range && range.split('-'),
                upperBytesPos = parts && parts.length > 1 &&
                    parseInt(parts[1], 10);
            return upperBytesPos && upperBytesPos + 1;
        },

        // Uploads a file in multiple, sequential requests
        // by splitting the file up in multiple blob chunks.
        // If the second parameter is true, only tests if the file
        // should be uploaded in chunks, but does not invoke any
        // upload requests:
        _chunkedUpload: function (options, testOnly) {
            options.uploadedBytes = options.uploadedBytes || 0;
            var that = this,
                file = options.files[0],
                fs = file.size,
                ub = options.uploadedBytes,
                mcs = options.maxChunkSize || fs,
                slice = this._blobSlice,
                dfd = $.Deferred(),
                promise = dfd.promise(),
                jqXHR,
                upload;
            if (!(this._isXHRUpload(options) && slice && (ub || mcs < fs)) ||
                    options.data) {
                return false;
            }
            if (testOnly) {
                return true;
            }
            if (ub >= fs) {
                file.error = options.i18n('uploadedBytes');
                return this._getXHRPromise(
                    false,
                    options.context,
                    [null, 'error', file.error]
                );
            }
            // The chunk upload method:
            upload = function () {
                // Clone the options object for each chunk upload:
                var o = $.extend({}, options),
                    currentLoaded = o._progress.loaded;
                o.blob = slice.call(
                    file,
                    ub,
                    ub + mcs,
                    file.type
                );
                // Store the current chunk size, as the blob itself
                // will be dereferenced after data processing:
                o.chunkSize = o.blob.size;
                // Expose the chunk bytes position range:
                o.contentRange = 'bytes ' + ub + '-' +
                    (ub + o.chunkSize - 1) + '/' + fs;
                // Process the upload data (the blob and potential form data):
                that._initXHRData(o);
                // Add progress listeners for this chunk upload:
                that._initProgressListener(o);
                jqXHR = ((that._trigger('chunksend', null, o) !== false && $.ajax(o)) ||
                        that._getXHRPromise(false, o.context))
                    .done(function (result, textStatus, jqXHR) {
                        ub = that._getUploadedBytes(jqXHR) ||
                            (ub + o.chunkSize);
                        // Create a progress event if no final progress event
                        // with loaded equaling total has been triggered
                        // for this chunk:
                        if (currentLoaded + o.chunkSize - o._progress.loaded) {
                            that._onProgress($.Event('progress', {
                                lengthComputable: true,
                                loaded: ub - o.uploadedBytes,
                                total: ub - o.uploadedBytes
                            }), o);
                        }
                        options.uploadedBytes = o.uploadedBytes = ub;
                        o.result = result;
                        o.textStatus = textStatus;
                        o.jqXHR = jqXHR;
                        that._trigger('chunkdone', null, o);
                        that._trigger('chunkalways', null, o);
                        if (ub < fs) {
                            // File upload not yet complete,
                            // continue with the next chunk:
                            upload();
                        } else {
                            dfd.resolveWith(
                                o.context,
                                [result, textStatus, jqXHR]
                            );
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        o.jqXHR = jqXHR;
                        o.textStatus = textStatus;
                        o.errorThrown = errorThrown;
                        that._trigger('chunkfail', null, o);
                        that._trigger('chunkalways', null, o);
                        dfd.rejectWith(
                            o.context,
                            [jqXHR, textStatus, errorThrown]
                        );
                    });
            };
            this._enhancePromise(promise);
            promise.abort = function () {
                return jqXHR.abort();
            };
            upload();
            return promise;
        },

        _beforeSend: function (e, data) {
            if (this._active === 0) {
                // the start callback is triggered when an upload starts
                // and no other uploads are currently running,
                // equivalent to the global ajaxStart event:
                this._trigger('start');
                // Set timer for global bitrate progress calculation:
                this._bitrateTimer = new this._BitrateTimer();
                // Reset the global progress values:
                this._progress.loaded = this._progress.total = 0;
                this._progress.bitrate = 0;
            }
            // Make sure the container objects for the .response() and
            // .progress() methods on the data object are available
            // and reset to their initial state:
            this._initResponseObject(data);
            this._initProgressObject(data);
            data._progress.loaded = data.loaded = data.uploadedBytes || 0;
            data._progress.total = data.total = this._getTotal(data.files) || 1;
            data._progress.bitrate = data.bitrate = 0;
            this._active += 1;
            // Initialize the global progress values:
            this._progress.loaded += data.loaded;
            this._progress.total += data.total;
        },

        _onDone: function (result, textStatus, jqXHR, options) {
            var total = options._progress.total,
                response = options._response;
            if (options._progress.loaded < total) {
                // Create a progress event if no final progress event
                // with loaded equaling total has been triggered:
                this._onProgress($.Event('progress', {
                    lengthComputable: true,
                    loaded: total,
                    total: total
                }), options);
            }
            response.result = options.result = result;
            response.textStatus = options.textStatus = textStatus;
            response.jqXHR = options.jqXHR = jqXHR;
            this._trigger('done', null, options);
        },

        _onFail: function (jqXHR, textStatus, errorThrown, options) {
            var response = options._response;
            if (options.recalculateProgress) {
                // Remove the failed (error or abort) file upload from
                // the global progress calculation:
                this._progress.loaded -= options._progress.loaded;
                this._progress.total -= options._progress.total;
            }
            response.jqXHR = options.jqXHR = jqXHR;
            response.textStatus = options.textStatus = textStatus;
            response.errorThrown = options.errorThrown = errorThrown;
            this._trigger('fail', null, options);
        },

        _onAlways: function (jqXHRorResult, textStatus, jqXHRorError, options) {
            // jqXHRorResult, textStatus and jqXHRorError are added to the
            // options object via done and fail callbacks
            this._trigger('always', null, options);
        },

        _onSend: function (e, data) {
            if (!data.submit) {
                this._addConvenienceMethods(e, data);
            }
            var that = this,
                jqXHR,
                aborted,
                slot,
                pipe,
                options = that._getAJAXSettings(data),
                send = function () {
                    that._sending += 1;
                    // Set timer for bitrate progress calculation:
                    options._bitrateTimer = new that._BitrateTimer();
                    jqXHR = jqXHR || (
                        ((aborted || that._trigger(
                            'send',
                            $.Event('send', {delegatedEvent: e}),
                            options
                        ) === false) &&
                        that._getXHRPromise(false, options.context, aborted)) ||
                        that._chunkedUpload(options) || $.ajax(options)
                    ).done(function (result, textStatus, jqXHR) {
                        that._onDone(result, textStatus, jqXHR, options);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        that._onFail(jqXHR, textStatus, errorThrown, options);
                    }).always(function (jqXHRorResult, textStatus, jqXHRorError) {
                        that._onAlways(
                            jqXHRorResult,
                            textStatus,
                            jqXHRorError,
                            options
                        );
                        that._sending -= 1;
                        that._active -= 1;
                        if (options.limitConcurrentUploads &&
                                options.limitConcurrentUploads > that._sending) {
                            // Start the next queued upload,
                            // that has not been aborted:
                            var nextSlot = that._slots.shift();
                            while (nextSlot) {
                                if (that._getDeferredState(nextSlot) === 'pending') {
                                    nextSlot.resolve();
                                    break;
                                }
                                nextSlot = that._slots.shift();
                            }
                        }
                        if (that._active === 0) {
                            // The stop callback is triggered when all uploads have
                            // been completed, equivalent to the global ajaxStop event:
                            that._trigger('stop');
                        }
                    });
                    return jqXHR;
                };
            this._beforeSend(e, options);
            if (this.options.sequentialUploads ||
                    (this.options.limitConcurrentUploads &&
                    this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    slot = $.Deferred();
                    this._slots.push(slot);
                    pipe = slot.pipe(send);
                } else {
                    this._sequence = this._sequence.pipe(send, send);
                    pipe = this._sequence;
                }
                // Return the piped Promise object, enhanced with an abort method,
                // which is delegated to the jqXHR object of the current upload,
                // and jqXHR callbacks mapped to the equivalent Promise methods:
                pipe.abort = function () {
                    aborted = [undefined, 'abort', 'abort'];
                    if (!jqXHR) {
                        if (slot) {
                            slot.rejectWith(options.context, aborted);
                        }
                        return send();
                    }
                    return jqXHR.abort();
                };
                return this._enhancePromise(pipe);
            }
            return send();
        },

        _onAdd: function (e, data) {
            var that = this,
                result = true,
                options = $.extend({}, this.options, data),
                files = data.files,
                filesLength = files.length,
                limit = options.limitMultiFileUploads,
                limitSize = options.limitMultiFileUploadSize,
                overhead = options.limitMultiFileUploadSizeOverhead,
                batchSize = 0,
                paramName = this._getParamName(options),
                paramNameSet,
                paramNameSlice,
                fileSet,
                i,
                j = 0;
            if (limitSize && (!filesLength || files[0].size === undefined)) {
                limitSize = undefined;
            }
            if (!(options.singleFileUploads || limit || limitSize) ||
                    !this._isXHRUpload(options)) {
                fileSet = [files];
                paramNameSet = [paramName];
            } else if (!(options.singleFileUploads || limitSize) && limit) {
                fileSet = [];
                paramNameSet = [];
                for (i = 0; i < filesLength; i += limit) {
                    fileSet.push(files.slice(i, i + limit));
                    paramNameSlice = paramName.slice(i, i + limit);
                    if (!paramNameSlice.length) {
                        paramNameSlice = paramName;
                    }
                    paramNameSet.push(paramNameSlice);
                }
            } else if (!options.singleFileUploads && limitSize) {
                fileSet = [];
                paramNameSet = [];
                for (i = 0; i < filesLength; i = i + 1) {
                    batchSize += files[i].size + overhead;
                    if (i + 1 === filesLength ||
                            ((batchSize + files[i + 1].size + overhead) > limitSize) ||
                            (limit && i + 1 - j >= limit)) {
                        fileSet.push(files.slice(j, i + 1));
                        paramNameSlice = paramName.slice(j, i + 1);
                        if (!paramNameSlice.length) {
                            paramNameSlice = paramName;
                        }
                        paramNameSet.push(paramNameSlice);
                        j = i + 1;
                        batchSize = 0;
                    }
                }
            } else {
                paramNameSet = paramName;
            }
            data.originalFiles = files;
            $.each(fileSet || files, function (index, element) {
                var newData = $.extend({}, data);
                newData.files = fileSet ? element : [element];
                newData.paramName = paramNameSet[index];
                that._initResponseObject(newData);
                that._initProgressObject(newData);
                that._addConvenienceMethods(e, newData);
                result = that._trigger(
                    'add',
                    $.Event('add', {delegatedEvent: e}),
                    newData
                );
                return result;
            });
            return result;
        },

        _replaceFileInput: function (data) {
            var input = data.fileInput,
                inputClone = input.clone(true);
            // Add a reference for the new cloned file input to the data argument:
            data.fileInputClone = inputClone;
            $('<form></form>').append(inputClone)[0].reset();
            // Detaching allows to insert the fileInput on another form
            // without loosing the file input value:
            input.after(inputClone).detach();
            // Avoid memory leaks with the detached file input:
            $.cleanData(input.unbind('remove'));
            // Replace the original file input element in the fileInput
            // elements set with the clone, which has been copied including
            // event handlers:
            this.options.fileInput = this.options.fileInput.map(function (i, el) {
                if (el === input[0]) {
                    return inputClone[0];
                }
                return el;
            });
            // If the widget has been initialized on the file input itself,
            // override this.element with the file input clone:
            if (input[0] === this.element[0]) {
                this.element = inputClone;
            }
        },

        _handleFileTreeEntry: function (entry, path) {
            var that = this,
                dfd = $.Deferred(),
                errorHandler = function (e) {
                    if (e && !e.entry) {
                        e.entry = entry;
                    }
                    // Since $.when returns immediately if one
                    // Deferred is rejected, we use resolve instead.
                    // This allows valid files and invalid items
                    // to be returned together in one set:
                    dfd.resolve([e]);
                },
                successHandler = function (entries) {
                    that._handleFileTreeEntries(
                        entries,
                        path + entry.name + '/'
                    ).done(function (files) {
                        dfd.resolve(files);
                    }).fail(errorHandler);
                },
                readEntries = function () {
                    dirReader.readEntries(function (results) {
                        if (!results.length) {
                            successHandler(entries);
                        } else {
                            entries = entries.concat(results);
                            readEntries();
                        }
                    }, errorHandler);
                },
                dirReader, entries = [];
            path = path || '';
            if (entry.isFile) {
                if (entry._file) {
                    // Workaround for Chrome bug #149735
                    entry._file.relativePath = path;
                    dfd.resolve(entry._file);
                } else {
                    entry.file(function (file) {
                        file.relativePath = path;
                        dfd.resolve(file);
                    }, errorHandler);
                }
            } else if (entry.isDirectory) {
                dirReader = entry.createReader();
                readEntries();
            } else {
                // Return an empy list for file system items
                // other than files or directories:
                dfd.resolve([]);
            }
            return dfd.promise();
        },

        _handleFileTreeEntries: function (entries, path) {
            var that = this;
            return $.when.apply(
                $,
                $.map(entries, function (entry) {
                    return that._handleFileTreeEntry(entry, path);
                })
            ).pipe(function () {
                return Array.prototype.concat.apply(
                    [],
                    arguments
                );
            });
        },

        _getDroppedFiles: function (dataTransfer) {
            dataTransfer = dataTransfer || {};
            var items = dataTransfer.items;
            if (items && items.length && (items[0].webkitGetAsEntry ||
                    items[0].getAsEntry)) {
                return this._handleFileTreeEntries(
                    $.map(items, function (item) {
                        var entry;
                        if (item.webkitGetAsEntry) {
                            entry = item.webkitGetAsEntry();
                            if (entry) {
                                // Workaround for Chrome bug #149735:
                                entry._file = item.getAsFile();
                            }
                            return entry;
                        }
                        return item.getAsEntry();
                    })
                );
            }
            return $.Deferred().resolve(
                $.makeArray(dataTransfer.files)
            ).promise();
        },

        _getSingleFileInputFiles: function (fileInput) {
            fileInput = $(fileInput);
            var entries = fileInput.prop('webkitEntries') ||
                    fileInput.prop('entries'),
                files,
                value;
            if (entries && entries.length) {
                return this._handleFileTreeEntries(entries);
            }
            files = $.makeArray(fileInput.prop('files'));
            if (!files.length) {
                value = fileInput.prop('value');
                if (!value) {
                    return $.Deferred().resolve([]).promise();
                }
                // If the files property is not available, the browser does not
                // support the File API and we add a pseudo File object with
                // the input value as name with path information removed:
                files = [{name: value.replace(/^.*\\/, '')}];
            } else if (files[0].name === undefined && files[0].fileName) {
                // File normalization for Safari 4 and Firefox 3:
                $.each(files, function (index, file) {
                    file.name = file.fileName;
                    file.size = file.fileSize;
                });
            }
            return $.Deferred().resolve(files).promise();
        },

        _getFileInputFiles: function (fileInput) {
            if (!(fileInput instanceof $) || fileInput.length === 1) {
                return this._getSingleFileInputFiles(fileInput);
            }
            return $.when.apply(
                $,
                $.map(fileInput, this._getSingleFileInputFiles)
            ).pipe(function () {
                return Array.prototype.concat.apply(
                    [],
                    arguments
                );
            });
        },

        _onChange: function (e) {
            var that = this,
                data = {
                    fileInput: $(e.target),
                    form: $(e.target.form)
                };
            this._getFileInputFiles(data.fileInput).always(function (files) {
                data.files = files;
                if (that.options.replaceFileInput) {
                    that._replaceFileInput(data);
                }
                if (that._trigger(
                        'change',
                        $.Event('change', {delegatedEvent: e}),
                        data
                    ) !== false) {
                    that._onAdd(e, data);
                }
            });
        },

        _onPaste: function (e) {
            var items = e.originalEvent && e.originalEvent.clipboardData &&
                    e.originalEvent.clipboardData.items,
                data = {files: []};
            if (items && items.length) {
                $.each(items, function (index, item) {
                    var file = item.getAsFile && item.getAsFile();
                    if (file) {
                        data.files.push(file);
                    }
                });
                if (this._trigger(
                        'paste',
                        $.Event('paste', {delegatedEvent: e}),
                        data
                    ) !== false) {
                    this._onAdd(e, data);
                }
            }
        },

        _onDrop: function (e) {
            e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var that = this,
                dataTransfer = e.dataTransfer,
                data = {};
            if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                e.preventDefault();
                this._getDroppedFiles(dataTransfer).always(function (files) {
                    data.files = files;
                    if (that._trigger(
                            'drop',
                            $.Event('drop', {delegatedEvent: e}),
                            data
                        ) !== false) {
                        that._onAdd(e, data);
                    }
                });
            }
        },

        _onDragOver: getDragHandler('dragover'),

        _onDragEnter: getDragHandler('dragenter'),

        _onDragLeave: getDragHandler('dragleave'),

        _initEventHandlers: function () {
            if (this._isXHRUpload(this.options)) {
                this._on(this.options.dropZone, {
                    dragover: this._onDragOver,
                    drop: this._onDrop,
                    // event.preventDefault() on dragenter is required for IE10+:
                    dragenter: this._onDragEnter,
                    // dragleave is not required, but added for completeness:
                    dragleave: this._onDragLeave
                });
                this._on(this.options.pasteZone, {
                    paste: this._onPaste
                });
            }
            if ($.support.fileInput) {
                this._on(this.options.fileInput, {
                    change: this._onChange
                });
            }
        },

        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, 'dragenter dragleave dragover drop');
            this._off(this.options.pasteZone, 'paste');
            this._off(this.options.fileInput, 'change');
        },

        _setOption: function (key, value) {
            var reinit = $.inArray(key, this._specialOptions) !== -1;
            if (reinit) {
                this._destroyEventHandlers();
            }
            this._super(key, value);
            if (reinit) {
                this._initSpecialOptions();
                this._initEventHandlers();
            }
        },

        _initSpecialOptions: function () {
            var options = this.options;
            if (options.fileInput === undefined) {
                options.fileInput = this.element.is('input[type="file"]') ?
                        this.element : this.element.find('input[type="file"]');
            } else if (!(options.fileInput instanceof $)) {
                options.fileInput = $(options.fileInput);
            }
            if (!(options.dropZone instanceof $)) {
                options.dropZone = $(options.dropZone);
            }
            if (!(options.pasteZone instanceof $)) {
                options.pasteZone = $(options.pasteZone);
            }
        },

        _getRegExp: function (str) {
            var parts = str.split('/'),
                modifiers = parts.pop();
            parts.shift();
            return new RegExp(parts.join('/'), modifiers);
        },

        _isRegExpOption: function (key, value) {
            return key !== 'url' && $.type(value) === 'string' &&
                /^\/.*\/[igm]{0,3}$/.test(value);
        },

        _initDataAttributes: function () {
            var that = this,
                options = this.options,
                data = this.element.data();
            // Initialize options set via HTML5 data-attributes:
            $.each(
                this.element[0].attributes,
                function (index, attr) {
                    var key = attr.name.toLowerCase(),
                        value;
                    if (/^data-/.test(key)) {
                        // Convert hyphen-ated key to camelCase:
                        key = key.slice(5).replace(/-[a-z]/g, function (str) {
                            return str.charAt(1).toUpperCase();
                        });
                        value = data[key];
                        if (that._isRegExpOption(key, value)) {
                            value = that._getRegExp(value);
                        }
                        options[key] = value;
                    }
                }
            );
        },

        _create: function () {
            this._initDataAttributes();
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = 0;
            this._initProgressObject(this);
            this._initEventHandlers();
        },

        // This method is exposed to the widget API and allows to query
        // the number of active uploads:
        active: function () {
            return this._active;
        },

        // This method is exposed to the widget API and allows to query
        // the widget upload progress.
        // It returns an object with loaded, total and bitrate properties
        // for the running uploads:
        progress: function () {
            return this._progress;
        },

        // This method is exposed to the widget API and allows adding files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('add', {files: filesList});
        add: function (data) {
            var that = this;
            if (!data || this.options.disabled) {
                return;
            }
            if (data.fileInput && !data.files) {
                this._getFileInputFiles(data.fileInput).always(function (files) {
                    data.files = files;
                    that._onAdd(null, data);
                });
            } else {
                data.files = $.makeArray(data.files);
                this._onAdd(null, data);
            }
        },

        // This method is exposed to the widget API and allows sending files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files or fileInput property and can contain additional options:
        // .fileupload('send', {files: filesList});
        // The method returns a Promise object for the file upload call.
        send: function (data) {
            if (data && !this.options.disabled) {
                if (data.fileInput && !data.files) {
                    var that = this,
                        dfd = $.Deferred(),
                        promise = dfd.promise(),
                        jqXHR,
                        aborted;
                    promise.abort = function () {
                        aborted = true;
                        if (jqXHR) {
                            return jqXHR.abort();
                        }
                        dfd.reject(null, 'abort', 'abort');
                        return promise;
                    };
                    this._getFileInputFiles(data.fileInput).always(
                        function (files) {
                            if (aborted) {
                                return;
                            }
                            if (!files.length) {
                                dfd.reject();
                                return;
                            }
                            data.files = files;
                            jqXHR = that._onSend(null, data);
                            jqXHR.then(
                                function (result, textStatus, jqXHR) {
                                    dfd.resolve(result, textStatus, jqXHR);
                                },
                                function (jqXHR, textStatus, errorThrown) {
                                    dfd.reject(jqXHR, textStatus, errorThrown);
                                }
                            );
                        }
                    );
                    return this._enhancePromise(promise);
                }
                data.files = $.makeArray(data.files);
                if (data.files.length) {
                    return this._onSend(null, data);
                }
            }
            return this._getXHRPromise(false, data && data.context);
        }

    });

}));

if (document.querySelector)
{
	(function() {
	  var AjaxMonitor, Bar, DocumentMonitor, ElementMonitor, ElementTracker, EventLagMonitor, Evented, Events, NoTargetError, Pace, RequestIntercept, SOURCE_KEYS, Scaler, SocketRequestTracker, XHRRequestTracker, animation, avgAmplitude, bar, cancelAnimation, cancelAnimationFrame, defaultOptions, extend, extendNative, getFromDOM, getIntercept, handlePushState, ignoreStack, init, now, options, requestAnimationFrame, result, runAnimation, scalers, shouldIgnoreURL, shouldTrack, source, sources, uniScaler, _WebSocket, _XDomainRequest, _XMLHttpRequest, _i, _intercept, _len, _pushState, _ref, _ref1, _replaceState,
	    __slice = [].slice,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	  defaultOptions = {
	    catchupTime: 100,
	    initialRate: .03,
	    minTime: 250,
	    ghostTime: 100,
	    maxProgressPerFrame: 20,
	    easeFactor: 1.25,
	    startOnPageLoad: true,
	    restartOnPushState: true,
	    restartOnRequestAfter: 500,
	    target: 'body',
	    elements: {
	      checkInterval: 100,
	      selectors: ['body']
	    },
	    eventLag: {
	      minSamples: 10,
	      sampleCount: 3,
	      lagThreshold: 3
	    },
	    ajax: {
	      trackMethods: ['GET', 'POST'],
	      trackWebSockets: true,
	      ignoreURLs: []
	    }
	  };
	
	  now = function() {
	    var _ref;
	    return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref : +(new Date);
	  };
	
	  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	
	  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
	
	  if (requestAnimationFrame == null) {
	    requestAnimationFrame = function(fn) {
	      return setTimeout(fn, 50);
	    };
	    cancelAnimationFrame = function(id) {
	      return clearTimeout(id);
	    };
	  }
	
	  runAnimation = function(fn) {
	    var last, tick;
	    last = now();
	    tick = function() {
	      var diff;
	      diff = now() - last;
	      if (diff >= 33) {
	        last = now();
	        return fn(diff, function() {
	          return requestAnimationFrame(tick);
	        });
	      } else {
	        return setTimeout(tick, 33 - diff);
	      }
	    };
	    return tick();
	  };
	
	  result = function() {
	    var args, key, obj;
	    obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
	    if (typeof obj[key] === 'function') {
	      return obj[key].apply(obj, args);
	    } else {
	      return obj[key];
	    }
	  };
	
	  extend = function() {
	    var key, out, source, sources, val, _i, _len;
	    out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    for (_i = 0, _len = sources.length; _i < _len; _i++) {
	      source = sources[_i];
	      if (source) {
	        for (key in source) {
	          if (!__hasProp.call(source, key)) continue;
	          val = source[key];
	          if ((out[key] != null) && typeof out[key] === 'object' && (val != null) && typeof val === 'object') {
	            extend(out[key], val);
	          } else {
	            out[key] = val;
	          }
	        }
	      }
	    }
	    return out;
	  };
	
	  avgAmplitude = function(arr) {
	    var count, sum, v, _i, _len;
	    sum = count = 0;
	    for (_i = 0, _len = arr.length; _i < _len; _i++) {
	      v = arr[_i];
	      sum += Math.abs(v);
	      count++;
	    }
	    return sum / count;
	  };
	
	  getFromDOM = function(key, json) {
	    var data, e, el;
	    if (key == null) {
	      key = 'options';
	    }
	    if (json == null) {
	      json = true;
	    }
	    el = document.querySelector("[data-pace-" + key + "]");
	    if (!el) {
	      return;
	    }
	    data = el.getAttribute("data-pace-" + key);
	    if (!json) {
	      return data;
	    }
	    try {
	      return JSON.parse(data);
	    } catch (_error) {
	      e = _error;
	      return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0;
	    }
	  };
	
	  Evented = (function() {
	    function Evented() {}
	
	    Evented.prototype.on = function(event, handler, ctx, once) {
	      var _base;
	      if (once == null) {
	        once = false;
	      }
	      if (this.bindings == null) {
	        this.bindings = {};
	      }
	      if ((_base = this.bindings)[event] == null) {
	        _base[event] = [];
	      }
	      return this.bindings[event].push({
	        handler: handler,
	        ctx: ctx,
	        once: once
	      });
	    };
	
	    Evented.prototype.once = function(event, handler, ctx) {
	      return this.on(event, handler, ctx, true);
	    };
	
	    Evented.prototype.off = function(event, handler) {
	      var i, _ref, _results;
	      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
	        return;
	      }
	      if (handler == null) {
	        return delete this.bindings[event];
	      } else {
	        i = 0;
	        _results = [];
	        while (i < this.bindings[event].length) {
	          if (this.bindings[event][i].handler === handler) {
	            _results.push(this.bindings[event].splice(i, 1));
	          } else {
	            _results.push(i++);
	          }
	        }
	        return _results;
	      }
	    };
	
	    Evented.prototype.trigger = function() {
	      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
	      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
	        i = 0;
	        _results = [];
	        while (i < this.bindings[event].length) {
	          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
	          handler.apply(ctx != null ? ctx : this, args);
	          if (once) {
	            _results.push(this.bindings[event].splice(i, 1));
	          } else {
	            _results.push(i++);
	          }
	        }
	        return _results;
	      }
	    };
	
	    return Evented;
	
	  })();
	
	  Pace = window.Pace || {};
	
	  window.Pace = Pace;
	
	  extend(Pace, Evented.prototype);
	
	  options = Pace.options = extend({}, defaultOptions, window.paceOptions, getFromDOM());
	
	  _ref = ['ajax', 'document', 'eventLag', 'elements'];
	  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	    source = _ref[_i];
	    if (options[source] === true) {
	      options[source] = defaultOptions[source];
	    }
	  }
	
	  NoTargetError = (function(_super) {
	    __extends(NoTargetError, _super);
	
	    function NoTargetError() {
	      _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
	      return _ref1;
	    }
	
	    return NoTargetError;
	
	  })(Error);
	
	  Bar = (function() {
	    function Bar() {
	      this.progress = 0;
	    }
	
	    Bar.prototype.getElement = function() {
	      var targetElement;
	      if (this.el == null) {
	        targetElement = document.querySelector(options.target);
	        if (!targetElement) {
	          throw new NoTargetError;
	        }
	        this.el = document.createElement('div');
	        this.el.className = "pace pace-active";
	        document.body.className = document.body.className.replace(/pace-done/g, '');
	        document.body.className += ' pace-running';
	        this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
	        if (targetElement.firstChild != null) {
	          targetElement.insertBefore(this.el, targetElement.firstChild);
	        } else {
	          targetElement.appendChild(this.el);
	        }
	      }
	      return this.el;
	    };
	
	    Bar.prototype.finish = function() {
	      var el;
	      el = this.getElement();
	      el.className = el.className.replace('pace-active', '');
	      el.className += ' pace-inactive';
	      document.body.className = document.body.className.replace('pace-running', '');
	      return document.body.className += ' pace-done';
	    };
	
	    Bar.prototype.update = function(prog) {
	      this.progress = prog;
	      return this.render();
	    };
	
	    Bar.prototype.destroy = function() {
	      try {
	        this.getElement().parentNode.removeChild(this.getElement());
	      } catch (_error) {
	        NoTargetError = _error;
	      }
	      return this.el = void 0;
	    };
	
	    Bar.prototype.render = function() {
	      var el, key, progressStr, transform, _j, _len1, _ref2;
	      if (document.querySelector(options.target) == null) {
	        return false;
	      }
	      el = this.getElement();
	      transform = "translate3d(" + this.progress + "%, 0, 0)";
	      _ref2 = ['webkitTransform', 'msTransform', 'transform'];
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        key = _ref2[_j];
	        el.children[0].style[key] = transform;
	      }
	      if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
	        el.children[0].setAttribute('data-progress-text', "" + (this.progress | 0) + "%");
	        if (this.progress >= 100) {
	          progressStr = '99';
	        } else {
	          progressStr = this.progress < 10 ? "0" : "";
	          progressStr += this.progress | 0;
	        }
	        el.children[0].setAttribute('data-progress', "" + progressStr);
	      }
	      return this.lastRenderedProgress = this.progress;
	    };
	
	    Bar.prototype.done = function() {
	      return this.progress >= 100;
	    };
	
	    return Bar;
	
	  })();
	
	  Events = (function() {
	    function Events() {
	      this.bindings = {};
	    }
	
	    Events.prototype.trigger = function(name, val) {
	      var binding, _j, _len1, _ref2, _results;
	      if (this.bindings[name] != null) {
	        _ref2 = this.bindings[name];
	        _results = [];
	        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	          binding = _ref2[_j];
	          _results.push(binding.call(this, val));
	        }
	        return _results;
	      }
	    };
	
	    Events.prototype.on = function(name, fn) {
	      var _base;
	      if ((_base = this.bindings)[name] == null) {
	        _base[name] = [];
	      }
	      return this.bindings[name].push(fn);
	    };
	
	    return Events;
	
	  })();
	
	  _XMLHttpRequest = window.XMLHttpRequest;
	
	  _XDomainRequest = window.XDomainRequest;
	
	  _WebSocket = window.WebSocket;
	
	  extendNative = function(to, from) {
	    var e, key, _results;
	    _results = [];
	    for (key in from.prototype) {
	      try {
	        if ((to[key] == null) && typeof from[key] !== 'function') {
	          if (typeof Object.defineProperty === 'function') {
	            _results.push(Object.defineProperty(to, key, {
	              get: function() {
	                return from.prototype[key];
	              },
	              configurable: true,
	              enumerable: true
	            }));
	          } else {
	            _results.push(to[key] = from.prototype[key]);
	          }
	        } else {
	          _results.push(void 0);
	        }
	      } catch (_error) {
	        e = _error;
	      }
	    }
	    return _results;
	  };
	
	  ignoreStack = [];
	
	  Pace.ignore = function() {
	    var args, fn, ret;
	    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    ignoreStack.unshift('ignore');
	    ret = fn.apply(null, args);
	    ignoreStack.shift();
	    return ret;
	  };
	
	  Pace.track = function() {
	    var args, fn, ret;
	    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    ignoreStack.unshift('track');
	    ret = fn.apply(null, args);
	    ignoreStack.shift();
	    return ret;
	  };
	
	  shouldTrack = function(method) {
	    var _ref2;
	    if (method == null) {
	      method = 'GET';
	    }
	    if (ignoreStack[0] === 'track') {
	      return 'force';
	    }
	    if (!ignoreStack.length && options.ajax) {
	      if (method === 'socket' && options.ajax.trackWebSockets) {
	        return true;
	      } else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) {
	        return true;
	      }
	    }
	    return false;
	  };
	
	  RequestIntercept = (function(_super) {
	    __extends(RequestIntercept, _super);
	
	    function RequestIntercept() {
	      var monitorXHR,
	        _this = this;
	      RequestIntercept.__super__.constructor.apply(this, arguments);
	      monitorXHR = function(req) {
	        var _open;
	        _open = req.open;
	        return req.open = function(type, url, async) {
	          if (shouldTrack(type)) {
	            _this.trigger('request', {
	              type: type,
	              url: url,
	              request: req
	            });
	          }
	          return _open.apply(req, arguments);
	        };
	      };
	      window.XMLHttpRequest = function(flags) {
	        var req;
	        req = new _XMLHttpRequest(flags);
	        monitorXHR(req);
	        return req;
	      };
	      try {
	        extendNative(window.XMLHttpRequest, _XMLHttpRequest);
	      } catch (_error) {}
	      if (_XDomainRequest != null) {
	        window.XDomainRequest = function() {
	          var req;
	          req = new _XDomainRequest;
	          monitorXHR(req);
	          return req;
	        };
	        try {
	          extendNative(window.XDomainRequest, _XDomainRequest);
	        } catch (_error) {}
	      }
	      if ((_WebSocket != null) && options.ajax.trackWebSockets) {
	        window.WebSocket = function(url, protocols) {
	          var req;
	          if (protocols != null) {
	            req = new _WebSocket(url, protocols);
	          } else {
	            req = new _WebSocket(url);
	          }
	          if (shouldTrack('socket')) {
	            _this.trigger('request', {
	              type: 'socket',
	              url: url,
	              protocols: protocols,
	              request: req
	            });
	          }
	          return req;
	        };
	        try {
	          extendNative(window.WebSocket, _WebSocket);
	        } catch (_error) {}
	      }
	    }
	
	    return RequestIntercept;
	
	  })(Events);
	
	  _intercept = null;
	
	  getIntercept = function() {
	    if (_intercept == null) {
	      _intercept = new RequestIntercept;
	    }
	    return _intercept;
	  };
	
	  shouldIgnoreURL = function(url) {
	    var pattern, _j, _len1, _ref2;
	    _ref2 = options.ajax.ignoreURLs;
	    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	      pattern = _ref2[_j];
	      if (typeof pattern === 'string') {
	        if (url.indexOf(pattern) !== -1) {
	          return true;
	        }
	      } else {
	        if (pattern.test(url)) {
	          return true;
	        }
	      }
	    }
	    return false;
	  };
	
	  getIntercept().on('request', function(_arg) {
	    var after, args, request, type, url;
	    type = _arg.type, request = _arg.request, url = _arg.url;
	    if (shouldIgnoreURL(url)) {
	      return;
	    }
	    if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
	      args = arguments;
	      after = options.restartOnRequestAfter || 0;
	      if (typeof after === 'boolean') {
	        after = 0;
	      }
	      return setTimeout(function() {
	        var stillActive, _j, _len1, _ref2, _ref3, _results;
	        if (type === 'socket') {
	          stillActive = request.readyState < 2;
	        } else {
	          stillActive = (0 < (_ref2 = request.readyState) && _ref2 < 4);
	        }
	        if (stillActive) {
	          Pace.restart();
	          _ref3 = Pace.sources;
	          _results = [];
	          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
	            source = _ref3[_j];
	            if (source instanceof AjaxMonitor) {
	              source.watch.apply(source, args);
	              break;
	            } else {
	              _results.push(void 0);
	            }
	          }
	          return _results;
	        }
	      }, after);
	    }
	  });
	
	  AjaxMonitor = (function() {
	    function AjaxMonitor() {
	      var _this = this;
	      this.elements = [];
	      getIntercept().on('request', function() {
	        return _this.watch.apply(_this, arguments);
	      });
	    }
	
	    AjaxMonitor.prototype.watch = function(_arg) {
	      var request, tracker, type, url;
	      type = _arg.type, request = _arg.request, url = _arg.url;
	      if (shouldIgnoreURL(url)) {
	        return;
	      }
	      if (type === 'socket') {
	        tracker = new SocketRequestTracker(request);
	      } else {
	        tracker = new XHRRequestTracker(request);
	      }
	      return this.elements.push(tracker);
	    };
	
	    return AjaxMonitor;
	
	  })();
	
	  XHRRequestTracker = (function() {
	    function XHRRequestTracker(request) {
	      var event, size, _j, _len1, _onreadystatechange, _ref2,
	        _this = this;
	      this.progress = 0;
	      if (window.ProgressEvent != null) {
	        size = null;
	        request.addEventListener('progress', function(evt) {
	          if (evt.lengthComputable) {
	            return _this.progress = 100 * evt.loaded / evt.total;
	          } else {
	            return _this.progress = _this.progress + (100 - _this.progress) / 2;
	          }
	        }, false);
	        _ref2 = ['load', 'abort', 'timeout', 'error'];
	        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	          event = _ref2[_j];
	          request.addEventListener(event, function() {
	            return _this.progress = 100;
	          }, false);
	        }
	      } else {
	        _onreadystatechange = request.onreadystatechange;
	        request.onreadystatechange = function() {
	          var _ref3;
	          if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
	            _this.progress = 100;
	          } else if (request.readyState === 3) {
	            _this.progress = 50;
	          }
	          return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
	        };
	      }
	    }
	
	    return XHRRequestTracker;
	
	  })();
	
	  SocketRequestTracker = (function() {
	    function SocketRequestTracker(request) {
	      var event, _j, _len1, _ref2,
	        _this = this;
	      this.progress = 0;
	      _ref2 = ['error', 'open'];
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        event = _ref2[_j];
	        request.addEventListener(event, function() {
	          return _this.progress = 100;
	        }, false);
	      }
	    }
	
	    return SocketRequestTracker;
	
	  })();
	
	  ElementMonitor = (function() {
	    function ElementMonitor(options) {
	      var selector, _j, _len1, _ref2;
	      if (options == null) {
	        options = {};
	      }
	      this.elements = [];
	      if (options.selectors == null) {
	        options.selectors = [];
	      }
	      _ref2 = options.selectors;
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        selector = _ref2[_j];
	        this.elements.push(new ElementTracker(selector));
	      }
	    }
	
	    return ElementMonitor;
	
	  })();
	
	  ElementTracker = (function() {
	    function ElementTracker(selector) {
	      this.selector = selector;
	      this.progress = 0;
	      this.check();
	    }
	
	    ElementTracker.prototype.check = function() {
	      var _this = this;
	      if (document.querySelector(this.selector)) {
	        return this.done();
	      } else {
	        return setTimeout((function() {
	          return _this.check();
	        }), options.elements.checkInterval);
	      }
	    };
	
	    ElementTracker.prototype.done = function() {
	      return this.progress = 100;
	    };
	
	    return ElementTracker;
	
	  })();
	
	  DocumentMonitor = (function() {
	    DocumentMonitor.prototype.states = {
	      loading: 0,
	      interactive: 50,
	      complete: 100
	    };
	
	    function DocumentMonitor() {
	      var _onreadystatechange, _ref2,
	        _this = this;
	      this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
	      _onreadystatechange = document.onreadystatechange;
	      document.onreadystatechange = function() {
	        if (_this.states[document.readyState] != null) {
	          _this.progress = _this.states[document.readyState];
	        }
	        return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
	      };
	    }
	
	    return DocumentMonitor;
	
	  })();
	
	  EventLagMonitor = (function() {
	    function EventLagMonitor() {
	      var avg, interval, last, points, samples,
	        _this = this;
	      this.progress = 0;
	      avg = 0;
	      samples = [];
	      points = 0;
	      last = now();
	      interval = setInterval(function() {
	        var diff;
	        diff = now() - last - 50;
	        last = now();
	        samples.push(diff);
	        if (samples.length > options.eventLag.sampleCount) {
	          samples.shift();
	        }
	        avg = avgAmplitude(samples);
	        if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
	          _this.progress = 100;
	          return clearInterval(interval);
	        } else {
	          return _this.progress = 100 * (3 / (avg + 3));
	        }
	      }, 50);
	    }
	
	    return EventLagMonitor;
	
	  })();
	
	  Scaler = (function() {
	    function Scaler(source) {
	      this.source = source;
	      this.last = this.sinceLastUpdate = 0;
	      this.rate = options.initialRate;
	      this.catchup = 0;
	      this.progress = this.lastProgress = 0;
	      if (this.source != null) {
	        this.progress = result(this.source, 'progress');
	      }
	    }
	
	    Scaler.prototype.tick = function(frameTime, val) {
	      var scaling;
	      if (val == null) {
	        val = result(this.source, 'progress');
	      }
	      if (val >= 100) {
	        this.done = true;
	      }
	      if (val === this.last) {
	        this.sinceLastUpdate += frameTime;
	      } else {
	        if (this.sinceLastUpdate) {
	          this.rate = (val - this.last) / this.sinceLastUpdate;
	        }
	        this.catchup = (val - this.progress) / options.catchupTime;
	        this.sinceLastUpdate = 0;
	        this.last = val;
	      }
	      if (val > this.progress) {
	        this.progress += this.catchup * frameTime;
	      }
	      scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
	      this.progress += scaling * this.rate * frameTime;
	      this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
	      this.progress = Math.max(0, this.progress);
	      this.progress = Math.min(100, this.progress);
	      this.lastProgress = this.progress;
	      return this.progress;
	    };
	
	    return Scaler;
	
	  })();
	
	  sources = null;
	
	  scalers = null;
	
	  bar = null;
	
	  uniScaler = null;
	
	  animation = null;
	
	  cancelAnimation = null;
	
	  Pace.running = false;
	
	  handlePushState = function() {
	    if (options.restartOnPushState) {
	      return Pace.restart();
	    }
	  };
	
	  if (window.history.pushState != null) {
	    _pushState = window.history.pushState;
	    window.history.pushState = function() {
	      handlePushState();
	      return _pushState.apply(window.history, arguments);
	    };
	  }
	
	  if (window.history.replaceState != null) {
	    _replaceState = window.history.replaceState;
	    window.history.replaceState = function() {
	      handlePushState();
	      return _replaceState.apply(window.history, arguments);
	    };
	  }
	
	  SOURCE_KEYS = {
	    ajax: AjaxMonitor,
	    elements: ElementMonitor,
	    document: DocumentMonitor,
	    eventLag: EventLagMonitor
	  };
	
	  (init = function() {
	    var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
	    Pace.sources = sources = [];
	    _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
	    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	      type = _ref2[_j];
	      if (options[type] !== false) {
	        sources.push(new SOURCE_KEYS[type](options[type]));
	      }
	    }
	    _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
	    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
	      source = _ref4[_k];
	      sources.push(new source(options));
	    }
	    Pace.bar = bar = new Bar;
	    scalers = [];
	    return uniScaler = new Scaler;
	  })();
	
	  Pace.stop = function() {
	    Pace.trigger('stop');
	    Pace.running = false;
	    bar.destroy();
	    cancelAnimation = true;
	    if (animation != null) {
	      if (typeof cancelAnimationFrame === "function") {
	        cancelAnimationFrame(animation);
	      }
	      animation = null;
	    }
	    return init();
	  };
	
	  Pace.restart = function() {
	    Pace.trigger('restart');
	    Pace.stop();
	    return Pace.start();
	  };
	
	  Pace.go = function() {
	    var start;
	    Pace.running = true;
	    bar.render();
	    start = now();
	    cancelAnimation = false;
	    return animation = runAnimation(function(frameTime, enqueueNextFrame) {
	      var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
	      remaining = 100 - bar.progress;
	      count = sum = 0;
	      done = true;
	      for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
	        source = sources[i];
	        scalerList = scalers[i] != null ? scalers[i] : scalers[i] = [];
	        elements = (_ref2 = source.elements) != null ? _ref2 : [source];
	        for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
	          element = elements[j];
	          scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element);
	          done &= scaler.done;
	          if (scaler.done) {
	            continue;
	          }
	          count++;
	          sum += scaler.tick(frameTime);
	        }
	      }
	      avg = sum / count;
	      bar.update(uniScaler.tick(frameTime, avg));
	      if (bar.done() || done || cancelAnimation) {
	        bar.update(100);
	        Pace.trigger('done');
	        return setTimeout(function() {
	          bar.finish();
	          Pace.running = false;
	          return Pace.trigger('hide');
	        }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0)));
	      } else {
	        return enqueueNextFrame();
	      }
	    });
	  };
	
	  Pace.start = function(_options) {
	    extend(options, _options);
	    Pace.running = true;
	    try {
	      bar.render();
	    } catch (_error) {
	      NoTargetError = _error;
	    }
	    if (!document.querySelector('.pace')) {
	      return setTimeout(Pace.start, 50);
	    } else {
	      Pace.trigger('start');
	      return Pace.go();
	    }
	  };
	
	  if (typeof define === 'function' && define.amd) {
	    define(['pace'], function() {
	      return Pace;
	    });
	  } else if (typeof exports === 'object') {
	    module.exports = Pace;
	  } else {
	    if (options.startOnPageLoad) {
	      Pace.start();
	    }
	  }
	
	}).call(this);
}
;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());


$(function() {
    FastClick.attach(document.body);
});
/*
unFocus.EventManager, version 1.0 (svn $Revision: 32 $) $Date: 2009-06-13 03:32:05 -0400 (Sat, 13 Jun 2009) $
Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
*/
// Package: unFocus.Utilities
// make sure faux-namespace is available before adding to it
if (!window.unFocus) var unFocus = {};

/** Class: EventManager
 *	Provides the interface and functionality to a Subscriber/Subscriber Pattern.
 * 
 **/
/*
Constructor: EventManager
	The Constructor (Prototype) function.

Parameters:
	[type1 [, type2 [, etc.]]] - Optionally sets up an empty array for each named event.
*/
unFocus.EventManager = function() {
	this._listeners = {};
	for (var i = 0; i < arguments.length; i++) {
		this._listeners[arguments[i]] = [];
	}
};

unFocus.EventManager.prototype = {
	/*
	Method: addEventListener
		Adds an event listener to the specified type.

	Parameters:
		$name		- The event name.
		$listener	- The function to be called when the event fires.
	*/
	addEventListener: function($name, $listener) {
		// check that listener is not in list
		for (var i = 0; i < this._listeners[$name].length; i++)
			if (this._listeners[$name][i] == $listener) return;
		// add listener to appropriate list
		this._listeners[$name].push($listener);
	},
	/*
	Method: removeEventListener
		Removes an event listener.
	
	Parameters:
		$name		- The event name.
		$listener	- The function to be removed.
	*/
	removeEventListener: function($name, $listener) {
		// search for the listener method
		for (var i = 0; i < this._listeners[$name].length; i++) {
			if (this._listeners[$name][i] == $listener) {
				this._listeners.splice(i,1);
				return;
			}
		}
	},
	/* Method: notifyListeners
		Notifies the listeners of an event.
	
	Parameters:
		$name	- The name of event to fire.
		$data	- The object to pass to the subscribed method (the Event Object).
	*/
	notifyListeners: function($name, $data) {
		for (var i = 0; i < this._listeners[$name].length; i++)
			this._listeners[$name][i]($data);
	}
};

/*
unFocus.History, version 2.0 (beta 1) (svn $Revision: 32 $) $Date: 2009-06-13 03:32:05 -0400 (Sat, 13 Jun 2009) $
Copyright: 2005-2009, Kevin Newman (http://www.unfocus.com/)
http://www.opensource.org/licenses/mit-license.php
*/

/*
	Class: unFocus.History
		A singleton with subscriber interface (<unFocus.EventManager>) 
		that keeps a history and provides deep links for Flash and AJAX apps
*/
unFocus.History = (function() {

function Keeper() {
	
	var _this = this,
		// set the poll interval here.
		_pollInterval = 200, _intervalID, _cdebug,
		_currentHash;

	_cdebug = 0;
	
	/*
	method: _getHash
		A private method that gets the Hash from the location.hash property.
	 
	returns:
		a string containing the current hash from the url
	*/
	var _getHash = function() {
		return location.hash.substring(1);
	};
	// get initial hash
	_currentHash = _getHash();
	
	/*
	method: _setHash
		A private method that sets the Hash on the location string (the current url).
	*/
	var _setHash = function($newHash) {
		window.location.hash = $newHash;
	};
	
	/*
	method: _watchHash
		A private method that is called every n miliseconds (<_pollInterval>) to check if the hash has changed.
		This is the primary Hash change detection method for most browsers. It doesn't work to detect the hash
		change in IE 5.5+ or various other browsers. Workarounds like the iframe method are used for those 
		browsers (IE 5.0 will use an anchor creation hack).
	*/
	function _watchHash() {
		var $newHash = _getHash();
		if (_currentHash != $newHash) {
			_currentHash = $newHash;
			_this.notifyListeners("historyChange", $newHash);
		}
	}
	// Put the hash check on a timer.
	if (setInterval) _intervalID = setInterval(_watchHash, _pollInterval);
	
	/*
	method: getCurrentBookmark
		A public method to retrieve the current history string.
	
	returns:
		The current History Hash
	*/
	_this.getCurrent = function() {
		return _currentHash;
	};
	
	/*
	method: addHistory
		A public method to add a new history, and set the deep link. This method should be given a string.
		It does no serialization.
	
	returns:
		Boolean - true if supported and set, false if not
	*/
	_this.addHistory = function addHistory($newHash) {
		if (_currentHash != $newHash) {
			_currentHash = $newHash;
			_setHash($newHash);
			_this.notifyListeners("historyChange",$newHash);
		}
		return true;
	};

	/**
	 * These are the platform specific override methods. Since some platforms (IE 5.5+, Safari)
	 * require almost completely different techniques to create history entries, browser detection is
	 * used and the appropriate method is created. The bugs these fixes address are very tied to the
	 * specific implementations of these browsers, and not necessarily the underlying html engines.
	 * Sometimes, bugs related to history management can be tied even to a specific skin in browsers
	 * like Opera.
	 */
	// opera
	if (history.navigationMode)
		history.navigationMode = 'compatible';
	
	// Safari 2.04 and less (and WebKit less than 420 - these hacks are not needed by the most recent nightlies)
	// :TODO: consider whether this aught to check for Safari or WebKit - is this a safar problem, or a does it
	// happen in other WebKit based software? OmniWeb (WebKit 420+) seems to work, though there's a sync issue.
	if (/WebKit\/\d+/.test(navigator.appVersion) && navigator.appVersion.match(/WebKit\/(\d+)/)[1] < 420) {
		// this will hold the old history states, since they can't be reliably taken from the location object
		var _unFocusHistoryLength = history.length,
			_historyStates = {}, _form,
			_recentlyAdded = false;
		
		// Setting the hash directly in Safari seems to cause odd content refresh behavior.
		// We'll use a form to submit to a #hash location instead. I'm assuming this works,
		// since I saw it done this way in SwfAddress (gotta give credit where credit it due ;-) ).
		function _createSafariSetHashForm() {
			_form = document.createElement("form");
			_form.id = "unFocusHistoryForm";
			_form.method = "get";
			document.body.insertBefore(_form,document.body.firstChild);
		}
		
		// override the old _setHash method to use the new form
		_setHash = function($newHash) {
			_historyStates[_unFocusHistoryLength] = $newHash;
			_form.action = "#" + _getHash();
			_form.submit();
		};
		
		// override the old _getHash method, since Safari doesn't update location.hash (fixed in nightlies)
		
		_getHash = function() {
			return _historyStates[_unFocusHistoryLength];
		};
		
		
		// set initial history entry
		_historyStates[_unFocusHistoryLength] = _currentHash;
		
		function addHistorySafari($newHash) {
			if (_currentHash != $newHash) {
				_currentHash = $newHash;
				_unFocusHistoryLength = history.length+1;
				_recentlyAdded = true;
				_setHash($newHash);
				_this.notifyListeners("historyChange",$newHash);
				_recentlyAdded = false;
			}
			return true;
		}
		
		// provide alternative addHistory
		_this.addHistory = function($newHash) { // adds history and bookmark hash
			// setup the form fix
			_createSafariSetHashForm();
			
			// replace with slimmer version...
			// :TODO: rethink this - it's adding an extra scope to the chain, which might
			// actually cost more at runtime than a simple if statement. Can this be done
			// without adding to the scope chain? The replaced scope holds no values. Does
			// it keep it's place in the scope chain?
			_this.addHistory = addHistorySafari;
			
			// ...do first call
			return _this.addHistory($newHash);
		};
		function _watchHistoryLength() {
			if (!_recentlyAdded) {
				var _historyLength = history.length;
				if (_historyLength != _unFocusHistoryLength) {
					_unFocusHistoryLength = _historyLength;
					
					var $newHash = _getHash();
					if (_currentHash != $newHash) {
						_currentHash = $newHash;
						_this.notifyListeners("historyChange", $newHash);
					}
				}
			}
		};
		
		// since it doesn't work, might as well cancel the location.hash check
		clearInterval(_intervalID);
		// watch the history.length prop for changes instead
		_intervalID = setInterval(_watchHistoryLength, _pollInterval);
		
	// IE 5.5+ Windows
	} else if (/*@cc_on!@*/0 && navigator.userAgent.match(/MSIE (\d+\.\d+)/)[1] >= 5.5) {
		
		// :HACK: Quick and dirty IE8 support (makes IE8 use standard timer method).
		if (document.documentMode && document.documentMode >= 8)
			return;
		
		/* iframe references */
		var _historyFrameObj, _historyFrameRef;
		
		/*
		method: _createHistoryFrame
			
			This is for IE only for now.
		*/
		function _createHistoryFrame() {
			var $historyFrameName = "unFocusHistoryFrame";
			_historyFrameObj = document.createElement("iframe");
			_historyFrameObj.setAttribute("name", $historyFrameName);
			_historyFrameObj.setAttribute("id", $historyFrameName);
			// :NOTE: _Very_ experimental
			_historyFrameObj.setAttribute("src", 'javascript:;');
			_historyFrameObj.style.position = "absolute";
			_historyFrameObj.style.top = "-900px";
			document.body.insertBefore(_historyFrameObj,document.body.firstChild);
			// get reference to the frame from frames array (needed for document.open)
			// :NOTE: there might be an issue with this according to quirksmode.org
			// http://www.quirksmode.org/js/iframe.html
			_historyFrameRef = frames[$historyFrameName];
			
			// add base history entry
			_createHistoryHTML(_currentHash, true);
		}
		
		/*
		method: _createHistoryHTML
			This is an alternative to <_setHistoryHTML> that is used by IE (and others if I can get it to work).
			This method will create the history page completely in memory, with no need to download a new file
			from the server.
		*/
		function _createHistoryHTML($newHash) {
			with (_historyFrameRef.document) {
				open("text/html");
				write("<html><head></head><body onl",
					'oad="parent.unFocus.History._updateFromHistory(\''+$newHash+'\');">',
					$newHash+"</body></html>");
				close();
			}
		}
		
		/*
		method: _updateFromHistory
			A private method that is meant to be called only from HistoryFrame.html.
			It is not meant to be used by an end user even though it is accessable as public.
		*/
			// hides the first call to the method, and sets up the real method for the rest of the calls
		function updateFromHistory($hash) {
			_currentHash = $hash;
			_this.notifyListeners("historyChange", $hash);
		}
		_this._updateFromHistory = function() {
			_this._updateFromHistory = updateFromHistory;
		};

		function addHistoryIE($newHash) { // adds history and bookmark hash
			if (_currentHash != $newHash) {
				// :NOTE: IE will create an entry if there is an achor on the page, but it
				// does not allow you to detect the state change.
				_currentHash = $newHash;
				// sets hash and notifies listeners
				_createHistoryHTML($newHash);
			}
			return true;
		};
		_this.addHistory = function($newHash) {
			// do initialization stuff on first call
			_createHistoryFrame();
			
			// replace this function with a slimmer one on first call
			_this.addHistory = addHistoryIE;
			// call the first call
			return _this.addHistory($newHash);
		};
		// anonymous method - subscribe to self to update the hash when the history is updated
		_this.addEventListener("historyChange", function($hash) { _setHash($hash) });
		
	}
}
Keeper.prototype = new unFocus.EventManager("historyChange");

return new Keeper();

})();

