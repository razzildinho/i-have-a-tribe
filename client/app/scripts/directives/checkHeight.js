'use strict';
/**
 * @ngInject
 */
var checkHeight = function($rootScope, $timeout) {
    return {
        restrict: 'AE',
        link: function(scope, element) {

            $rootScope.$on('$stateChangeSuccess', function(){

                $timeout(function(){

                    var maxHeight = $(window).height() - 20;

                    var well = element.find('.well').eq(0);

                    well.css({
                        'max-height': maxHeight,
                        'margin-top': '10px',
                        'overflow-y': 'auto'
                    });

                    $(window).resize(function(){
                        var maxHeight = $(window).height() - 20;

                        well.css({
                            'max-height': maxHeight
                        });
                    });

                }, 50);

            });

        }
    };
};
