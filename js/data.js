/* Model Data */

var locations = [
    {
        title: 'Citadel of Qaitbay',
        location: {
            lat: 31.214013,
            lng: 29.885634
        }
    },
    {
        title: 'Yacht Club Of Egypt',
        location: {
            lat: 31.212003,
            lng: 29.883177
        }
    },
    {
        title: 'El Gondy El Maghool Square',
        location: {
            lat: 31.200028,
            lng: 29.893713
        }
    },
    {
        title: 'El Raml Station',
        location: {
            lat: 31.201533,
            lng: 29.901052
        }
    },
    {
        title: 'Bibliotheca Alexandrina',
        location: {
            lat: 31.208874,
            lng: 29.909163
        }
    }
    
];



var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];

