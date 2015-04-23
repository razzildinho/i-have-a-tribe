'use strict';

var dateTimePicker = function ($rootScope) {

    return {
        require: 'ngModel',
        restrict: 'AE',
        scope: {},
        link: function (scope, elem, attrs, ngModel) {
            elem.datetimepicker({
                format: "DD/MM/YYYY - HH:mm"
            })

            elem.on("dp.change", function(e){
                scope.$apply(function(){
                    ngModel.$setViewValue(e.currentTarget.value);
                });
            });

            elem.on("dp.error", function(e){
                scope.$apply(function(){
                    ngModel.$setViewValue(e.currentTarget.value);
                });
            });

        }
    };
}
