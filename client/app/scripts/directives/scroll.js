'use strict';

var anchorSmoothScroll = function($rootScope){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var currentYPosition = function() {
            return $('.parallax').scrollTop();
        };
        
        var elmYPosition = function(eID) {
            return $('#'+eID).position().top;
        };

        var startY = currentYPosition();
        var stopY = startY + elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            $('.parallax').scrollTop(stopY); return;
        }
        var speed = Math.round(distance / 60);
        if (speed > 60){
            speed = 60;
        }
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout('$(".parallax").scrollTop('+leapY+')', timer * speed);
                leapY += step;
                if (leapY > stopY){
                    leapY = stopY; 
                }
                timer++;
            } return;
        }
        for ( var j=startY; j>stopY; j-=step ) {
            setTimeout('$(".parallax").scrollTop('+leapY+')', timer * speed);
            leapY -= step;
            if (leapY < stopY){
                leapY = stopY;
            }
            timer++;
        }
    };
};

var scrollSpy = function ($window) {
    return {
        restrict: 'A',
        controller: function ($scope) {
            $scope.spies = [];
            this.addSpy = function (spyObj) {
                $scope.spies.push(spyObj);
            };
        },
        link: function (scope, elem, attrs) {
            var spyElems;
            spyElems = [];
 
            scope.$watch('spies', function (spies) {
                var spy, _i, _len, _results;
                _results = [];
 
                for (_i = 0, _len = spies.length; _i < _len; _i++) {
                    spy = spies[_i];
 
                    if (spyElems[spy.id] == null) {
                        _results.push(spyElems[spy.id] = elem.find('#' + spy.id));
                    }
                }
                return _results;
            });
 
            $('.parallax').scroll(function () {
                var highlightSpy, pos, spy, _i, _len, _ref;
                highlightSpy = null;
                _ref = scope.spies;
                
                // cycle through `spy` elements to find which to highlight
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    spy = _ref[_i];
                    spy.out();
    
                    // catch case where a `spy` does not have an associated `id` anchor
                    if (spyElems[spy.id].offset() === undefined) {
                        continue;
                    }
    
                    if ((pos = $('#'+spy.id).position().top) <= 0) {
                        // the window has been scrolled past the top of a spy element
                        spy.pos = pos;
    
                        if (highlightSpy === null) {
                            highlightSpy = spy;
                        }
                        if (highlightSpy.pos < spy.pos) {
                            highlightSpy = spy;
                        }
                    }
                }
    
                // select the last `spy` if the scrollbar is at the bottom of the page
                if ($('.parallax').scrollTop() + $(window).height() >= $('.parallax')[0].scrollHeight) {
                    spy.pos = pos;
                    highlightSpy = spy;
                }        
    
                return highlightSpy !== null ? highlightSpy['in']() : void 0;
            });
        }
    };
};
 
var spy = function ($location, $anchorSmoothScroll) {
    return {
        restrict: 'A',
        require: '^scrollSpy',
        link: function(scope, elem, attrs, affix) {
            elem.click(function () {
                $anchorSmoothScroll.scrollTo(attrs.spyer);
            });
    
            affix.addSpy({
                id: attrs.spyer,
                in: function() {
                    elem.addClass('active');
                },
                out: function() {
                    elem.removeClass('active');
                }
            });
        }
    };
};
