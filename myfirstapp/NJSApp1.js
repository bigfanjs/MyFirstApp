var my_app = (function ( W, D, undefined ) {

    var list = [];
	
    var timeout;
    var curr_elm;
    
    var MAX = 60;
    var MIN = 25;
    var _delay = 80;
    
    return {
    
        set_up: function () {
            var ul = D.getElementsByClassName( 'myUl' )[ 0 ],
                li = ul.querySelectorAll( 'li' ),
                item, i, timer,
                
                mouse_enter = (function ( e ) {
                    var queue;
                    
                    clearTimeout( timeout );
                    clearTimeout( timer );
                    
                    curr_elm = e.target;
                    
                    if ( ( queue = curr_elm.queue[ curr_elm.queue.length - 1 ] ) && curr_elm.offsetWidth >= MAX ) {
                        if ( queue && queue.dir == 0 ) this.augment( curr_elm, null, 1, 1 );
                    } else this.augment( curr_elm, null, 1, 1 );
                    
                    this.motion();
                }).bind( this ),
                
                mouse_leave = (function ( e ) {

                    clearTimeout( timeout );
                    curr_elm = e.target;

                    timer = setTimeout(function () {
                        this.augment( curr_elm, null, 0, 1 );
                    }.bind( this ));  
                    
                    this.motion();
                }).bind( this );
            
            for ( i = 0; i < li.length; i++ ) {
                item = li[ i ];
                
                item.queue = [];
                item.dire = undefined;
                item.once = false;
                item.delay = 0;
                
                item.addEventListener( 'mouseenter', mouse_enter, false );
                item.addEventListener( 'mouseleave', mouse_leave, false );
                
                list.push( item );
            }

        },
        
        motion: function () {
            var item, dire, i, j;

            for ( i = 0; i < list.length; i++ ) {
                item = list[ i ];

                this.repeat( list[ i ] );
                    
                if ( (  dire = item.dire ) == undefined ) continue;
                this.changeWidth( item, dire );
            }

            timeout = W.setTimeout( ( function () { this.motion(); } ).bind( this ), 15 );
        },
        
        changeWidth: function ( target, dire ) {
            dire == 1 ? this.forward( target ) : this.backward( target );
        },
        
        forward: function ( target ) {
            var width = target.offsetWidth;
			
            if ( !target.queue[ 0 ] ) return;
            
            if ( width >= ( target.queue[ 0 ].target < MAX ? target.queue[ 0 ].target : MAX ) ) {
                clearTimeout( timeout );
                
				target.dire = undefined;
                target.once = false;

                target.queue.shift();

            } else {
                target.style.width = width + 2 + 'px';
            }
        },
        
        backward: function ( target ) {
            var width = target.offsetWidth;
			
            if ( !target.queue[ 0 ] ) return;
            
            if ( width <= ( target.queue[ 0 ].target > MIN ? target.queue[ 0 ].target : MIN ) ) {
                clearTimeout( timeout );
                
				target.dire = undefined;
                target.once = false;

                target.queue.shift();
            } else {
                target.style.width = width - 2 + 'px';
            }
        },
        
        repeat: function ( iterator ) {
			var next = iterator.nextElementSibling,
                pre = iterator.previousElementSibling,
                ite_index = list.indexOf( iterator ),
                curr_index = list.indexOf( curr_elm );

            if ( iterator.queue.length && iterator.queue[ 0 ].delay() >= _delay ) {
                if ( !iterator.once ) {
                    iterator.once = true;
                    
                    if ( next && ite_index >= curr_index ) this.augment( iterator, next, iterator.queue[ 0 ].dir, new Date().getTime() );
                    if ( pre && ite_index <= curr_index ) this.augment( iterator, pre, iterator.queue[ 0 ].dir, new Date().getTime() );
                }
                iterator.dire = iterator.queue[ 0 ].dir;
            }
        },
        
        augment: function ( curr_elm, next, dir, currTime ) {
            if ( next == null ) next = curr_elm;
            
            var queue = next.queue[ next.queue.length - 1 ],
                index;
            
            queue && ( queue.target = curr_elm.offsetWidth );
            index = next.queue.push({
                dir: dir,
                target: undefined,
                start: undefined,
                delay: function () {
                    return this.start ? new Date().getTime() - this.start : 0;
                }
            });
            
            queue = next.queue[ index - 1 ];
            queue && ( queue.start = currTime );
        }
    
    };

})( window, document );

window.addEventListener( 'load', ( function () { this.set_up(); } ).bind( my_app ), false );