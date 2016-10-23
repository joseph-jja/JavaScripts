var decode, encode;

    decode = ( typeof decodeURIComponent !== "undefined" ) ? decodeURIComponent : unescape;
    encode = ( typeof encodeURIComponent !== "undefined" ) ? encodeURIComponent : escape;

    function findCookieByName( cookieName, cookieData ) {
        var cookies, dc, x, dclen, ck, ckidx, name, value;

        // this will throw if in server mode and there is no document object :) 
        dc = ( cookieData || document.cookie );
        cookies = dc.split( ";" );
        dclen = cookies.length;
        for ( x = 0; x < dclen; x += 1 ) {
            ck = cookies[ x ].match( /([^=]+)=/i );
            if ( ck instanceof Array ) {
                try {
                    name = decode( ck[ 1 ] );
                    value = decode( cookies[ x ].substring( ck[ 1 ].length + 1 ) );
                } catch ( ex ) {
                    // ignore
                }
            } else {
                name = decode( cookies[ x ] );
                value = "";
            }
            if ( name === cookieName ) {
                break;
            }
        }
        return value;
    };

// can be used both server side or client side
export get = function ( name, cookieData ) {
        return findCookieByName( name, cookieData );
    };

function checkOption( options, opt, useVal ) {
    
    var result = '';
    
    if ( typeof options !== 'undefined' && options[opt] ) {
        result = ";" + opt + ( useVal ? "=" + options[opt]: '' );        
    }
    return result;
}

export set = function ( name, value, options ) {
        var ename, evalue, data, 
            isServer;

        ename = encode( name );
        evalue = encode( value );

       data = ename + "=" + evalue;
       
       data += checkOption(options, 'path', true);
       data += checkOption(options, 'domain', true);
    
    isServer = (typeof options.server !== 'undefined');

    data += checkOption(options, 'expires', true);
    data += checkOption(options, 'Max-Age', true);
    
    data += checkOption(options, 'Secure', false);
    data += checkOption(options, 'HttpOnly', false);
    data += checkOption(options, 'SameSite', true);
    
        if ( !isServer ) {
            document.cookie = data;
        }
        return data;
};
    
 export remove = function ( name ) {
        var exists, now = new Date();
        exists = findCookieByName( name );
        now.setFullYear(1970);
        set( name, "", { expires: now } );
    };

export count = function (cookieData) {
        return dc = ( cookieData || document.cookie ).split( ";" ).length;
    };

export length = function () {
        return dc = ( cookieData || document.cookie ).length;
    };