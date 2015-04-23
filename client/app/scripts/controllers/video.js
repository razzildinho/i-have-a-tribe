'use strict';

var VideoCtrl = function(videoModel, globalModel){
    this.newVideo = '';
    this.activeVideo = null;
    this.changeVideo = function(video){
        this.activeVideo = video;
    }
    this.addVideo = function(){
        videoModel.addVideo(this, globalModel.serverUrl+'video')
    }
    this.deleteVideo = function(video){
        videoModel.deleteVideo(this, globalModel.serverUrl+'video/delete', video);
    }
    videoModel.getVideos(this, globalModel.serverUrl+'video');
};
