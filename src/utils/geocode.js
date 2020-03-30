const request = require("request");

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?limit=1&access_token=pk.eyJ1IjoidGFvdmVuemtlIiwiYSI6ImNrN3g0ZmNqcTA3cTczZnI0OHg5bHhjanUifQ.Wrvbv0FiAizDUszeOULqRA`;
//    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?limit=1&access_token=pk.eyJ1IjoidGFvdmVuemtlIiwiYSI6ImNrN3g0ZmNqcTA3cTczZnI0OHg5bHhjanUifQ.Wrvbv0FiAizDUszeOULqRA';

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to the location service', undefined);
        } else if (body.features.length === 0) {
            callback('Unable to find the location, please check your spelling.', undefined);
        } else {
            callback(undefined, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode;