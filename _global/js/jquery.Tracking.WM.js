$(document).ready(function() {
  $('body').centerTracking(); 
});

(function($){  
$.fn.centerTracking = function() {  

   return this.each(function() { 
          

            $('.ctrack').live("click", function(){

                    // Check if itype and itrack attribute exist
                    if (($(this).attr('itype')) && ($(this).attr('itrack'))) {
                      var type = $(this).attr('itype');
                      var tr = $(this).attr('itrack');
                      DynamicOmnitureTracking(tr, type);
                    }
                    // if not, alert (FOR TESTING ONLY)
                    else {
                      // comment out alert after testing
                      //alert('Missing itype or itrack attr');
                    }
                    ///////////////////////////////////////////
                    //console.log(tr)

            });


   });  
};  
})(jQuery); 