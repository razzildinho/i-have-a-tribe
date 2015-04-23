'use strict';
/**
 * @ngInject
 */
var ShowsCtrl = function($scope, showsModel, globalModel){

    var thisScope = this;
    this.weekLookup = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday'
    };

    this.shows = [];
    this.activeShow = null;

    this.firstShown = 0;
    this.lastShown = 4;

    this.updateActive = function(show){
        if (this.activeShow == show){
            this.activeShow = null;
            return;
        }
        else{
            this.activeShow = show;
            return;
        }
    }

    this.showEarlier = function(){
        if (this.firstShown == 0){
            return false;
        }
        else{
            this.firstShown -= 5;
            this.lastShown -= 5;
        }
    }

    this.showLater = function(){
        if (this.lastShown >= this.shows.length){
            return false;
        }
        else{
            this.firstShown += 5;
            this.lastShown += 5;
        }
    }

    this.imageDir = globalModel.serverUrl + 'public/images/';

    showsModel.getShows(this, globalModel.serverUrl+'shows');
    $scope.$on('updateShows', function(){
        showsModel.getShows(thisScope, globalModel.serverUrl+'shows');
    });

    this.deleteShow = function(){
        showsModel.deleteShow(this, globalModel.serverUrl+'shows/delete');
    };

    this.updateImage = function(){
        showsModel.updateImage(this, globalModel.serverUrl+'shows/image');
    };

};

var ShowsFormCtrl = function($rootScope, showsModel, globalModel){

    this.newShow = {
        when: null,
        venueName: null,
        eventUrl: null,
        city: null,
        address: null,
        country: null
    };

    this.imageDir = globalModel.serverUrl + 'public/images/';

    showsModel.getShows(this, globalModel.serverUrl+'shows');
    
    this.broadcast = function(){
        $rootScope.$broadcast('updateShows')
    }

    this.addShow = function(){
        var when = moment(this.newShow.when, 'DD/MM/YYYY - HH:mm')._d.toJSON();
        if (when == 'Invalid Date' || this.newShow.when == null){
            this.whenError = true;
        }
        else{
            this.whenError = false;
        }
        if (this.newShow.city == null){
            this.cityError = true;
        }
        else{
            this.cityError = false;
        }
        if (this.newShow.venueName == null){
            this.venueError = true;
        }
        else{
            this.venueError = false;
        }
        if (this.venueError || this.whenError || this.cityError){
            return false;
        }
        showsModel.addShow(this, globalModel.serverUrl+'shows');
    };

};
