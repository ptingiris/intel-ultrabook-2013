/*
	
	VERSION: 0.1.2 BETA
	Author: Khary Mallea

*/
if (typeof console == "undefined") var console = { log: function() {} };
(function ($) {
    $.fn.wmItemLookup = function (options) {

        var defaults = {
			iframeId: '#trm_cartFrame',
			API_KEY : 'rfh72bhug4jckeve3teab9ez',
			useProxy : false,
			proxyUrl : '/trmsupport/proxy/proxy.aspx?url=',
			onPrice : function(){}
        };

        var options = $.extend(defaults, options);
        var obj = $(this);
		var inCart = {};
		var lastResult = {};
		
		$.fn.wmItemLookup.addToCart = function(id){
			url = 'http://www.walmart.com/catalog/select_product.gsp?product_id='+id+'&add_to_cart=1&qty=1';
			$(options.iframeId).attr('src',url);
			return inCart[id];
		}
		
		$.fn.wmItemLookup.data = function(){
			return obj;
		}
		
		$.fn.wmItemLookup.itemsInCart = function(){
			return inCart;
		}
		
		$.fn.wmItemLookup.getProductInfo = function(params){
			//console.log(params);
			getProdData(params);
		}

		$.fn.wmItemLookup.getLastProd = function(params){
			//console.log(params);
			return lastResult;
		}
		
		$.fn.wmItemLookup.inShoppingCart = function(id){
			retVal = false;
			if(typeof(inCart[id]) != 'undefined' && inCart[id] == true){
				retVal = true;
			}
			return retVal
		}

		function getCartUrl(id){
			uri = 'http://www.walmart.com/catalog/select_product.gsp?product_id='+id+'&add_to_cart=1&qty=1';
			//url = (options.useProxy == true) ? proxyUrl + escape(uri) : uri;
			return uri;
		}
		
		function getProdData(p){
			//console.log('Data',p,p.id);
			uri = 'http://api.walmart.com/wmtservice/itemlookup?apikey='+options.API_KEY+'&product_id='+p.id+'&version=v1';
			//uri = 'http://api.walmart.com/service/item/itemlookup/1.0?apikey='+options.API_KEY+'&itemid='+p.id+'&responseformat=xml';
			//http://<service-host-address>/service/item/itemlookup/1.0?apikey=123&itemid=12017223&rg=Variants&responseformat=xml
			apiUrl = (options.useProxy == true) ? options.proxyUrl + escape(uri) : uri

			$.ajax({
			  	type: "GET",
			  	url: apiUrl,
			  	dataType: 'xml',
				success:function(r){
					formatResults(r,p);
				},
				error:function(xhr, status, error){
					console.log('AJAX RESULT ERR',xhr,status,error);
				}
			});				
		}
		
		function formatResults(r,p){
			apiProdData = {};
			apiProdData.price = $(r).find('Price').text();
			apiProdData.subText = $(r).find('PriceDisplay_Subtext').text();
			apiProdData.isRollback = (apiProdData.subText.length && apiProdData.subText.indexOf("Was") != -1) ? true : false;
			apiProdData.image = $(r).find('ProductImageUrl').text();
			apiProdData.description = $(r).find('Description').text();
			apiProdData.name = $(r).find('Name').text();
			apiProdData.url = $(r).find('Url').text();
			lastResult = apiProdData;
		  	if(typeof(p.callback) == 'function'){
		  		var results = $.extend(apiProdData, p);
		  		//console.log('CALL BACK')
		  		p.callback.call(this, results);
		  	}

		  	//console.log('res',apiProdData);
		}

        return this.each(function () {
        	var iframeId = options.iframeId.substr(1,options.iframeId.length);
        	if(!$(iframeId).length){
				$('body').append('<div style="display:none"><img id="'+ iframeId +'" src="" /></div>');
			}

			if($(this).data('sku')){
				getProdData({id : $(this).data('sku'), callback : options.onPrice, target : this});
			}
			
        });
    };
})(jQuery);


if(typeof trm_func == 'undefined'){var trm_func = {};}
trm_func.trmAddToCart = function (productId){ $('body').wmItemLookup.addToCart(productId); }