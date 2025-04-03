    (function($){  
    $.fn.centerTracking = function(options) {  
      var defaults = {  
        convergID:''
        };  
       var options = $.extend(defaults, options); 
       return this.each(function() { 
              

                $('.ctrack').live("click", function(){

                        var tr = $(this).attr('itrack');
                        Omniture_TrackEvent('o', ''+options.convergID+'_Click_' + tr + '_ENG_01');

                        console.log(tr)
 
                });


       });  
    };  
    })(jQuery); 