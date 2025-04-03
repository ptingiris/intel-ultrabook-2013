    (function($){  
    $.fn.videoSwitch = function(options) {  
      var defaults = {  
        flashPath:'/MediaOMP/2012/SHOWCASES/Maidenform/01_MDF_32512_ShwcseMedia/flash/GlobalVideoPlayer.swf',
        videoId: 'MyVideoName',
        videoWidth: 640,
        videoHeight:360,
        //video:'http://instoresnow.walmart.com/MediaOMP/2012/SHOWCASES/Samsung/01_SAM_33180_SprngRfrsh/mp4/VideoB_Browse-Search.mp4',
        videoPoster:'/MediaOMP/2012/SHOWCASES/Maidenform/01_MDF_32512_ShwcseMedia/video/Shapewear_Image.jpg', //for html 5
        seek:'3.8', // for flash preview
        track:'ShapewearVideo',
        converge:'01_MDF_32512_ShwcseMedia',
        autoplay:false
        };  
       var o = $.extend(defaults, options); 
       return this.each(function() { 
              $(this).append('<div id="'+o.videoId+'Replace" > \
                    <video width="'+o.videoWidth+'" height="'+o.videoHeight+'" poster="'+o.videoPoster+'" controls="controls"> \
                      <source src="'+o.video+'" type="video/mp4" codecs="avc1.42E01E, mp4a.40.2" /> \
                      HTML 5 not supported. Download the video <a href="'+o.videoHeight+'">here</a>. \
                    </video> \
              </div>');
            ///FlashVideo Player videoplayer
            var swf = { 
                  url: o.flashPath, 
                  id: ""+o.videoId+"Replace", 
                  width: o.videoWidth, 
                  height: o.videoHeight, 
                  params: {wmode: "opaque", menu: "false", quality: "high", allowScriptAccess : "always",  allowFullScreen: "true",
                  flashvars:"conId="+o.converge+"&seek="+o.seek+"&autoPlay="+o.autoplay+"&track="+o.track+"&url="+o.video+"" },  
                  attributes: {id: o.videoId, name: o.videoId} 
                }; 
                swfobject.embedSWF( 
                   swf.url, swf.id, swf.width, swf.height, "9.0.0", false, 
                   swf.flashvars, swf.params, swf.attributes 
             ); 

       });  
    };  
    })(jQuery); 