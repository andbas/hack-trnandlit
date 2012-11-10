(function( $ ) {

	$.fn.timeTrack = function( method ) {
	
		var id = function( str ) {
			return str.replace(/[^a-zA-Z0-9]+/g, '_');
		};
	
		var methods = {
			
			init: function( options ){
			
				options = $.extend({ speed: 50 }, options);

				var area = $(this);
				setInterval(function() { 
					area.find('div').animate({ left: '-=5', width: '+=5' }, options.speed ) 
				}, options.speed );
					
				return this;
			},
			
			resize: function(){
				
				var target = $(this);
				var tracks =  target.find('div');
				var height = target.height() / tracks.size();
				var offset = -1;
				
				tracks.each(function(){ 
					$(this).css({ 'font-size':height, height: height, top: offset }); 
					target.find( '[rel=' + $(this).attr('id') + ']' ).css({ top: offset });
					offset += height + 1;
				});
				
				return this;
			},
			
			add: function( key ){
				
				$('<div>').attr({ id: id(key) }).appendTo( this );
				$('<h3>').attr({ rel: id(key) }).text( key ).hide().fadeIn('slow').appendTo( this );
				methods['resize'].apply( this );
					
				return this;
			},
			
			send: function( key ){
			
				$(this).find('div#' + id(key) ).each(function(){
				
					var item = $('<span>').hide().appendTo( $(this) );
					item.css({ left: $(this).width() - item.width() }).fadeIn();
				});
					
				return this;
			},
			
			remove: function( key ){
					
				$(this).find('div#' + id(key) + ', h3[rel=' + id(key) + ']' ).remove();
				methods['resize'].apply( this );
					
				return this;
			}
		};

		if ( methods[method] ) {
			
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 )); 
		} 
		
		else if ( typeof method === 'object' || ! method ) { 
			return methods.init.apply( this, arguments );
		} 
		
		else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    
	};
	
})( jQuery );