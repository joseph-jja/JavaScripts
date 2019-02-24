import * as API from 'client/components/bart/api';

export default async function Alerts( station ) {

    const alerts = await API.getAlerts();

    if ( !alerts ) {
        throw ( 'Could not get alerts!' );
    }

    const items = alerts.map( alert => {

        return `<div>
                  Date Time: ${alert.dateTime}
                  <br>Station: ${alert.station}
                  <br>Description: ${JSON.stringify(alert.description)}
               </div>`;

    } ).reduce( ( acc, item ) => {
        return acc + item;
    } );

    return `<div id="bart-alert-list">${items}</div>`;

}
