'use strict';

var youtube = function($window, $timeout) {
    return {
        restrict: 'E',

        scope: {
            videoid: '@'
        },

        template: '<div class="embed-responsive-item"></div>',

        link: function(scope, element) {

            scope.$watch('videoid', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return false;
                }
                if (scope.player == undefined){
                    scope.player = new YT.Player(element.children()[0], {
                        playerVars: {
                            autoplay: 0,
                            html5: 1,
                            theme: 'light',
                            modesbranding: 0,
                            color: 'white',
                            iv_load_policy: 3,
                            showinfo: 1,
                            controls: 1
                        },
                        videoId: scope.videoid 
                    });

                    scope.player.getIframe();
        
                }
                else{
                    scope.player.cueVideoById(scope.videoid);
                }
      
            });

        }  
    };
};
