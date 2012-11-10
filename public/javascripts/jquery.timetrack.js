(function( $ ) {

	$.fn.timeTrack = function( method ) {
	
		var id = function( str ) {
			return str !== undefined ? str.replace(/[^a-zA-Z0-9]+/g, '_') : (new Date()).getTime();
		};
	
		var methods = {
			
			init: function( options ){
			
				options = $.extend({ speed: 40 }, options);

				var area = $(this);

				setInterval(function() { 
					area.find('div').css({ left: '-=4', width: '+=4' }).find('span').each(function(){
                        var pos = $(this).offset();
                        if (pos.left < 0 ) $(this).remove();
                    })
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
					var label = target.find( '[rel=' + $(this).attr('id') + ']' ).css({ top: offset });

                    label.find('img').css({ height: height * 0.9 });
					offset += height + 1;
				});
				
				return this;
			},
			
			add: function( key ){
				
				$('<div>').attr({ id: id(key) }).appendTo( this );
				$('<h3>').attr({ rel: id(key) })
                    .append( $('<img>').attr({ src: 'http://www.gravatar.com/avatar/' + $.md5(key)+'.jpg?size=255'}) )
                    .append( $('<small>').text(key) )
                    .hide().fadeIn('slow').appendTo( this );
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