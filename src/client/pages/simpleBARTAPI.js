import "@babel/runtime/regenerator"
import selector from 'client/dom/selector';
import * as events from 'client/dom/events';
import * as dom from 'client/dom/DOM';

// components
import StationList from 'client/components/bart/stationsUI';
import TrainList from 'client/components/bart/trainsUI';
import Alerts from 'client/components/bart/alertUI';
import footer from 'client/components/footer';
import * as menu from 'client/components/menu';

async function doOnLoadStuff() {

    const stationData = await StationList();

    const content = document.getElementById( 'content' );

    const rdiv = dom.createElement( 'div', content, {
        id: 'slist'
    } );

    const ldiv = dom.createElement( 'div', content, {
        id: 'tlist'
    } );

    // get dom node to put this data in and inner html it
    rdiv.innerHTML = stationData;

    // the add event listener
    const stationClick = async function ( e ) {
        const tgt = events.getTarget( e );

        if ( !tgt ) {
            return;
        }

        if ( tgt.nodeName.toUpperCase() !== 'DIV' ) {
            return;
        }

        if ( !tgt.attributes[ 'data-abbr' ] ) {
            return;
        }

        const selectedStation = tgt.attributes[ 'data-abbr' ].value;
        const listOfTrains = await TrainList( selectedStation );
        ldiv.innerHTML = listOfTrains;

    };
    events.addEvent( content, 'click', stationClick );
}

events.addOnLoad( doOnLoadStuff );
