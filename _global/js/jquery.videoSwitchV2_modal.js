    (function($){  
    $.fn.videoSwitch = function(options) {  
      var defaults = {  
        flashPath:'/_global/video/GlobalVideoPlayer.swf',
        videoId: 'MyVideoName',
        videoWidth: 640,
        videoHeight:360,
        video:'',
        videoPoster:'', //for html 5
        seek:'3.8', // for flash preview
        track:'',
        converge:'',
        autoplay:false,
        css:'_global/css/TDM_HTML5VIDEO.css'
        };  
       var o = $.extend(defaults, options); 
       return this.each(function() { 
              var obj = $(this);
              $('head').append('<link rel="stylesheet" href="'+o.css+'" type="text/css" />');

              $(this).append('<div id="'+o.videoId+'Replace" class="videoContainer"> \
                                  <video id="myVideo'+o.videoId+'" preload="auto" width="'+o.videoWidth+'" height="'+o.videoHeight+'" poster="'+o.videoPoster+'"> \
                                    <source src="'+o.video+'" type="video/mp4" /> \
                                    HTML 5 not supported. Download the video <a href="'+o.videoHeight+'">here</a>. \
                                  </video> \
                                  <div class="control">\
                                    <div class="topControl">\
                                      <div class="btnPlay btn" title="Play/Pause video"></div>\
                                      <div class="progress">\
                                        <span class="bufferBar"></span>\
                                        <span class="timeBar"></span>\
                                      </div>\
                                      <div class="time">\
                                        <span class="current">00:00</span>/<span class="duration">00:00</span> \
                                      </div>\
                                      <div class="volume" title="Set volume">\
                                        <span class="volumeBar"></span>\
                                        <span class="volumeBarBKG"></span>\
                                      </div>\
                                      <div class="btnFS btn" title="Switch to full screen"></div>\
                                    </div>\
                                    <div class="controlsBKG"></div>\
                                  </div>\
                                  <div class="loading"><div class="blackBar"><div class="loader"></div><div class="bufferWord">BUFFERING</div></div></div>\
                            </div>');
            $(obj).find('.videoContainer').css({width:o.videoWidth+'px', height:o.videoHeight+'px'});

            var barWidth = o.videoWidth - 260;
            var innerBar = barWidth - 2;
            $(obj).find('.progress').css({width:barWidth + "px"});
            $(obj).find('.bufferBar').css({width:innerBar + "px"});
            $(obj).find('.timeBar').css({width:innerBar + "px"});

            ///FlashVideo Player videoplayer.
            var swf = { 
                  url: o.flashPath, 
                  id: ""+o.videoId+"Replace", 
                  width: o.videoWidth, 
                  height: o.videoHeight, 
                  params: {wmode: "transparent", menu: "false", quality: "high", allowScriptAccess : "always",  allowFullScreen: "true",
                  flashvars:"conId="+o.converge+"&seek="+o.seek+"&img="+o.videoPoster+"&autoPlay="+o.autoplay+"&track="+o.track+"&url="+o.video+"" }, 
                  attributes: {id: o.videoId, name: o.videoId} 
                }; 
                swfobject.embedSWF( 
                   swf.url, swf.id, swf.width, swf.height, "9.0.0", false, 
                   swf.flashvars, swf.params, swf.attributes 
             ); 

            var video;

            if(!swfobject.hasFlashPlayerVersion("1"))
            {
              initHTML5();
            }


            function initHTML5()
            {
                //INITIALIZE
                video = $(obj).find('#myVideo'+o.videoId);
                
                //remove default control when JS loaded
                video[0].removeAttribute("controls");
                $(obj).find('.control').hide();
                $(obj).find('.loading').fadeIn(500);

                //before everything get started
            video.on('loadedmetadata', function() {
                
              //set video properties
              $(obj).find('.current' , obj).text(timeFormat(0));
              $(obj).find('.duration').text(timeFormat(video[0].duration));
              updateVolume(0, 0.7);
                
              //start to get video buffering data 
              setTimeout(startBuffer, 150);
                
              //bind video events
              $(obj).find('.videoContainer')
              .append('<div class="init"><div class="blackBar"><div class="playWord">play</div><div class="videoWord">video</div></div><div class="largePlay"></div></div>')
              .hover(function() {
                $(obj).find('.control').stop().show();
              }, function() {
                if(!volumeDrag && !timeDrag){
                  $(obj).find('.control').stop().hide();
                }
              })
              .on('click', function() {
                $(obj).find('.init').remove();
                $(obj).find('.btnPlay').addClass('paused');
                $(obj).find(this).unbind('click');
                video[0].play();
                //TrackClick('playVideo');
                videoPlay();
              });
              $(obj).find('.init').fadeIn(200);
            });
            
            //display video buffering bar
            var startBuffer = function() {
              var currentBuffer = video[0].buffered.end(0);
              var maxduration = video[0].duration;
              var perc = 100 * currentBuffer / maxduration;
              if(perc > 30)
              {
                perc = 100
              }
              
               $(obj).find('.bufferBar').css('width', innerBar+'px');

              if(perc > 30) {
                setTimeout(startBuffer, 500);
                perc = 100
                var perWidth = Math.ceil(innerBar * (perc/100));
                $(obj).find('.bufferBar').css('width', perWidth+'px');
              }
            };  
            
            //display current video play time
            video.on('timeupdate', function() {
              var currentPos = video[0].currentTime;
              var maxduration = video[0].duration;
              var perc = 99 * currentPos / maxduration;
              $(obj).find('.timeBar').css('width',perc+'%');  
              $(obj).find('.current').text(timeFormat(currentPos)); 
            });
            
            //CONTROLS EVENTS
            //video screen and play button clicked
            video.on('click', function() { playpause(); } );
            $(obj).find('.btnPlay').on('click', function() { playpause(); } );
            var playpause = function() {
              if(video[0].paused || video[0].ended) {
                $(obj).find('.btnPlay').addClass('paused');
                video[0].play();
                videoPlay();
                //TrackClick('playVideo');
              }
              else {
                $(obj).find('.btnPlay').removeClass('paused');
                video[0].pause();
                videoPause();
                //TrackClick('pauseVideo');
              }
            };
            
            //stop button clicked
            $(obj).find('.btnStop').on('click', function() {
              $(obj).find('.btnPlay').removeClass('paused');
              updatebar($(obj).find('.progress').offset().left);
              video[0].pause();
               //TrackClick('pauseVideo');
            });
            
            //fullscreen button clicked
            $('.btnFS').on('click', function() {
              if($.isFunction(video[0].webkitEnterFullscreen)) {
                video[0].webkitEnterFullscreen();
                 //TrackClick('FullScreen');
              } 
              else if ($.isFunction(video[0].mozRequestFullScreen)) {
                video[0].mozRequestFullScreen();
              }
              else {
                alert('Your browsers doesn\'t support fullscreen');
              }
            });
            
            //sound button clicked
            $(obj).find('.sound').click(function() {
              video[0].muted = !video[0].muted;
              $(obj).find(this).toggleClass('muted');
              if(video[0].muted) {
                $(obj).find('.volumeBar').css('width',0);
              }
              else{
                $(obj).find('.volumeBar').css('width', video[0].volume*100+'%');
              }
            });
            
            //VIDEO EVENTS
            //video canplay event
            video.on('canplay', function() {
              $(obj).find('.loading').fadeOut(100);
            });
            
            //video canplaythrough event
            //solve Chrome cache issue
            var completeloaded = false;
            video.on('canplaythrough', function() {
              completeloaded = true;
            });
            
            //video ended event
            video.on('ended', function() {
              $(obj).find('.btnPlay').removeClass('paused');
              $(obj).find('.videoContainer')
                .append('<div class="init"><div class="blackBar"><div class="replayWord">REPLAY</div><div class="videoWord">video</div></div><div class="replayBtn"></div></div>')
                .on('click', function() {
                  $(obj).find('.init').remove();
                  $(obj).find('.btnPlay').addClass('paused');
                  $(obj).find(this).unbind('click');
                  video[0].play();
                });
              video[0].pause();
              //TrackClick('VideoComplete');
              videoComplete();
            });

            //video seeking event
            video.on('seeking', function() {
              //if video fully loaded, ignore loading screen
              if(!completeloaded) { 
                $(obj).find('.loading').fadeIn(200);
              } 
            });
            
            //video seeked event
            video.on('seeked', function() { });
            
            //video waiting for more data event
            video.on('waiting', function() {
              $(obj).find('.loading').fadeIn(200);
            });
            
            //VIDEO PROGRESS BAR
            //when video timebar clicked
            var timeDrag = false; /* check for drag event */
            $(obj).find('.progress').on('mousedown', function(e) {
              timeDrag = true;
              updatebar(e.pageX);
              //TrackClick('UpdateVideoProgress');
            });
            $(document).on('mouseup', function(e) {
              if(timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
              }
            });
            $(document).on('mousemove', function(e) {
              if(timeDrag) {
                updatebar(e.pageX);
              }
            });
            var updatebar = function(x) {
              var progress = $('.progress');
              
              //calculate drag position
              //and update video currenttime
              //as well as progress bar
              var maxduration = video[0].duration;
              var position = x - progress.offset().left;
              var percentage = 100 * position / progress.width();
              if(percentage >= 100) {
                percentage = 100;
              }
              if(percentage < 0) {
                percentage = 0;
              }
              var perWidth = Math.ceil(innerBar * (percentage/100));
              $(obj).find('.timeBar').css('width', perWidth+'px');  
              video[0].currentTime = maxduration * percentage / 100;
            };

            //VOLUME BAR
            //volume bar event
            var volumeDrag = false;
            $(obj).find('.volume').on('mousedown', function(e) {
              volumeDrag = true;
              video[0].muted = false;
              $(obj).find('.sound').removeClass('muted');
              updateVolume(e.pageX);
              //TrackClick('UpdateVolume');
            });
            $(document).on('mouseup', function(e) {
              if(volumeDrag) {
                volumeDrag = false;
                updateVolume(e.pageX);
              }
            });
            $(document).on('mousemove', function(e) {
              if(volumeDrag) {
                updateVolume(e.pageX);
              }
            });
            var updateVolume = function(x, vol) {
              var volume = $('.volume');
              var percentage;
              //if only volume have specificed
              //then direct update volume
              if(vol) {
                percentage = vol * 100;
              }
              else {
                var position = x - volume.offset().left;
                percentage = 100 * position / volume.width();
              }
              
              if(percentage > 100) {
                percentage = 100;
              }
              if(percentage < 0) {
                percentage = 0;
              }
              
              //update volume bar and video volume
              $(obj).find('.volumeBar').css('width',percentage+'%');  
              video[0].volume = percentage / 100;
              
            };

            //Time format converter - 00:00
            var timeFormat = function(seconds){
              var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
              var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
              return m+":"+s;
            };
          }

       });  
    };  
    })(jQuery); 

//////////////////////////////////////////////////// NEW ////////////////
function videoComplete()
{
  parent.DynamicOmnitureTracking('Video Complete', 'Interaction');
}

function videoReplay()
{
  parent.DynamicOmnitureTracking('Play', 'Interaction');
}

function videoPlay()
{
  parent.DynamicOmnitureTracking('Resume', 'Interaction');
}

function videoPause()
{
  parent.DynamicOmnitureTracking('Pause', 'Interaction');
}
//////////////////////////////////////////////// END NEW ///////////////
