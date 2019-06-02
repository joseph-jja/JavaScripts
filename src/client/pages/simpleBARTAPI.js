import "@babel/runtime/regenerator";
import selector from 'client/dom/selector';
import * as events from 'client/dom/events';
import * as dom from 'client/dom/DOM';
import fetcher from 'client/net/fetcher';

// components
import StationList from 'client/components/bart/stationsList';
import StationUI from 'client/components/bart/stationsUI';
import TrainList from 'client/components/bart/trainsUI';
import Alerts from 'client/components/bart/alertUI';
import Fares from 'client/components/bart/faresUI';
import TripPlanner from 'client/components/bart/tripPlanner';
import footer from 'client/components/footer';

import {
    getFares,
    getDepartTrips
} from 'client/components/bart/api';

// window
import WebWindow from 'client/components/wbWindow';

function getMainWindow() {
    const mw = document.getElementById( 'main-window' );
    const styles = window.getComputedStyle( mw );

    return new WebWindow( 'BART Info',
        styles.offsetLeft,
        styles.offsetTop,
        styles.offsetWidth,
        styles.offsetHeight,
        'main-window' );
}

async function buildNav() {
    const navFrag = '/frags/bart-nav.frag';
    const navData = await fetcher( navFrag );

    const menu = document.getElementById( 'menu' );
    menu.innerHTML = navData.replace( /\n/g, '' );
}

function hideAll() {

    const slist = document.getElementById( 'slist' );
    slist.style.display = 'none';

    const tlist = document.getElementById( 'tlist' );
    tlist.style.display = 'none';

    const farelist = document.getElementById( 'fare-list' );
    if ( farelist ) {
        farelist.style.display = 'none';
    }

    const triplist = document.getElementById( 'trips-list' );
    if ( triplist ) {
        triplist.style.display = 'none';
    }
}

async function reRenderStations() {

    hideAll();

    const slist = document.getElementById( 'slist' );
    slist.style.display = 'block';

    const tlist = document.getElementById( 'tlist' );
    tlist.style.display = 'block';
}

async function loadFares() {

    const source = document.getElementById( 'fares-source' );
    const destination = document.getElementById( 'fares-destination' );

    if ( source.selectedIndex === 0 || destination.selectedIndex === 0 ) {
        return;
    }

    const fareSource = source.options[ source.selectedIndex ].value;
    const fareDest = destination.options[ destination.selectedIndex ].value;

    const fares = await getFares( fareSource, fareDest );

    const fareResults = fares.root.fares.fare.map( fare => {
        return `${fare['@name']}: ${fare['@amount']}`;
    } ).reduce( ( acc, next ) => {
        return `${acc}<br>${next}`;
    } );

    const fareResultsContainer = document.getElementById( 'fare-results' );
    fareResultsContainer.innerHTML = fareResults;
}

let hasFareEvents = false;
async function renderFares() {

    hideAll();

    const slist = document.getElementById( 'slist' );
    const parent = slist.parentNode;
    const dropdowns = await Fares();
    const rdiv = dom.createElement( 'div', parent, {
        id: 'fare-list'
    } );
    rdiv.innerHTML = dropdowns;
    rdiv.style.display = 'block';
    if ( !hasFareEvents ) {
        selector( 'div#fare-list select' ).each( d => {
            events.addEvent( d, 'change', loadFares );
        } );
    }
}

let stationMap;
async function listToMap() {
    if ( stationMap ) {
        return;
    }

    const stations = await StationList();
    stationMap = stations.map( item => {
        return {
            [ item.abbr ]: item.name
        };
    } );

    stationMap = stations;
}

async function loadTripDetails() {

    const source = document.getElementById( 'trip-source' );
    const destination = document.getElementById( 'trip-destination' );
    const tripTime = document.getElementById( 'trip-time' );

    if ( source.selectedIndex === 0 || destination.selectedIndex === 0 ) {
        return;
    }

    const tripSource = source.options[ source.selectedIndex ].value;
    const tripDest = destination.options[ destination.selectedIndex ].value;

    const trips = await getDepartTrips( tripSource, tripDest, tripTime.value );

    const tripResults = trips.root.schedule.request.trip.map( trip => {
        let results = `From: ${stationMap[trip['@origin']]} (${trip['@origTimeDate']} ${trip['@origTimeMin']})`;
        results += `<br>To: ${stationMap[trip['@destination']]} (${trip['@destTimeDate']} ${trip['@destTimeDate']})`;
        const legs = trip.leg.map( leg => {
            //stationMap
            return leg;
        } ).reduce( ( acc, next ) => {
            return `${acc}<br>${next}`;
        } );
        return results;
    } ).reduce( ( acc, next ) => {
        return `${acc}<br>${next}`;
    } );

    const tripResultsContainer = document.getElementById( 'trip-results' );
    tripResultsContainer.innerHTML = tripResults;
}

let hasTripPlannerEvents = false;
async function renderTripPlanner() {

    hideAll();
    await listToMap();

    const slist = document.getElementById( 'slist' );
    const parent = slist.parentNode;
    const dropdowns = await TripPlanner();
    const rdiv = dom.createElement( 'div', parent, {
        id: 'trips-list'
    } );
    rdiv.innerHTML = dropdowns;
    rdiv.style.display = 'block';
    if ( !hasTripPlannerEvents ) {
        selector( 'div#trips-list select' ).each( d => {
            events.addEvent( d, 'change', loadTripDetails );
        } );
    }
}

async function doOnLoadStuff() {

    const stationData = await StationUI();

    const wwin = getMainWindow();

    const content = wwin.windowArea;

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

    const alertButtonClick = async function ( e ) {
        const alertList = await Alerts();
        ldiv.innerHTML = alertList;
    };

    await buildNav();
    const dropdown = selector( '.url-wrapper select' ).get( 0 );
    events.addEvent( dropdown, 'change', ( e ) => {
        const evt = events.getEvent( e );
        const tgt = events.getTarget( evt );
        const item = tgt.options[ tgt.selectedIndex ].text.toLowerCase();

        switch ( item ) {
        case 'alerts':
            reRenderStations();
            alertButtonClick();
            break;
        case 'train list':
            reRenderStations();
            break;
        case 'fare estimator':
            renderFares();
            break;
        case 'trip planner':
            renderTripPlanner();
            break;
        default:
            break;
        }
    } );
}

events.addOnLoad( doOnLoadStuff );
