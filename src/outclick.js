/**
 * outClick 
 * element outside click events
 * @parms {Object} options
        - $ {jQuery}  
 */
var OutClick = function(options) {
    var eventList = [];
    var $ = (options && options.$) || window.jQuery;

    if (!$) {
        throw Error('must pass parameter $');
        return false;
    }

    function isClickInSide(sourceEl, target) {
        if (sourceEl[0] == target || sourceEl.find(target).length) {
            return true;
        }
        return false;
    }

    $(document).click(function(e) {
        var target = e.srcElement || e.target;
        $.each(eventList, function(i, item) {
            var flag = false;
            if (isClickInSide(item.el, target)) {
                flag = true;
            } else {
                if (item.filter && $.type(item.filter) == 'array') {
                    for (var i=0; i<item.filter.length; i++) {
                        var curItem = item.filter[i];
                        if (curItem instanceof $ && isClickInSide(curItem, target)) {
                            flag = true;
                        } else if (curItem.className) {
                            if ($(target).hasClass(curItem.className) || $(target).parents('.' + curItem.className).length) {
                                flag = true;
                                break;
                            }
                        }
                    }
                }                   
            }

            if (!flag) {
                item.callback.call(item.context, target); 
            }
        })
    });

    /**
     * el {jQuery}   the target
     * callback {Function}   outside click event handler
     * filter {Array} the index item of filter is Object | jquery instance 
            - className  {className: 'test1'}
            - el    $('#test1')
     * context {Object} 
     */
    function _add(options) {
        var defaultOptions = {
            el: null,
            callback: null,
            filter: null,
            context: null
        };

        var parms = $.extend(defaultOptions, options);
        if (!parms.el) {
            throw Error('el can not be empty');
            return false;
        }

        eventList.push(parms);
    }

    return {
        add: _add
    }
};