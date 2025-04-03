var Metrics = {
	settings : {
		convergeId : '',
		lang : '',
		doConsole : false
	},
	init : function(convergeId,lang,doConsole){
		Metrics.settings.convergeId = convergeId;
		Metrics.settings.lang = lang;
		Metrics.settings.doConsole = (typeof doConsole != 'undefined') ? doConsole : false;
	},
	track : function(converge, type){
		//if(typeof(parent.Omniture_TrackEvent) == 'function'){
		if(typeof(parent.s_omni) != 'undefined'){
			//s_omni.tl(this,'o', Metrics.settings.convergeId+converge+Metrics.settings.lang);
			var trackType = (typeof type == 'undefined') ? 'Link' : type;
			

			if(Metrics.settings.doConsole == true){
				console.log('METRICS LOG: ' + converge, trackType);
			}
			DynamicOmnitureTracking(converge, trackType);
		}
		else{
			console.log('OMNITURE DISABLED ' + Metrics.settings.convergeId+converge+Metrics.settings.lang);
		}
	}
}