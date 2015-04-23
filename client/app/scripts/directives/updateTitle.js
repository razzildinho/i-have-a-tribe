'use strict';
/**
 * @ngInject
 */
var updateTitle = function($rootScope, $timeout) {
    return {
        link: function(scope, element) {

            var listener = function(event, toState, toParams, fromState, fromParams) {
                var title = 'i have a tribe';
                if (toState.data && toState.data.pageTitle){
                    title = toState.data.pageTitle;
                }
                // Set asynchronously so page changes before title does
                $timeout(function() {
                    element.text(title);
                });
            };

            $rootScope.$on('$stateChangeStart', listener);
        }
    };
};
