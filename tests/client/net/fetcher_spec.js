import * as fetcher from "client/net/fetcher";

describe( 'testing fetcher', () => {

    it( 'fetcher  test', () => {
        expect( fetcher.fetcher ).toBeDefined();
    } );
} );