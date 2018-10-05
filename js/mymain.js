

'use strict';
//  global variables
var map;
var infoWindow;
var bounds;
// map initialization
function initMap() {
       var alex = {
        lat: 31.204606,
        lng: 29.895565
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: alex,
        styles:styles,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow();

    bounds = new google.maps.LatLngBounds();
   
    ko.applyBindings(new ViewModel());
    }


    var client_id = "J4JTA0KKSKB50R1ONPYB3W4H532SPS403IHJKL4VQMNMNKT0";
    var client_secret = "W5FBT3FTE1X4RVJXPSJJDNNXCYHXL0OMH1TPVINZ40NO0LX5";
/* Location Model */ 
var LocationMarker = function(data) {
    var self = this;

    this.title = data.title;
    this.position = data.location;
    this.street='',
    this.city='';


    this.visible = ko.observable(true);

    // the default style for each place 
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location"
    var highlightedIcon = makeMarkerIcon('EFEFEF');


    // get info from for square
   var FSURL='https://api.foursquare.com/v2/venues/search?ll='+this.position.lat +','+this.position.lng+'&client_id='+client_id+ '&client_secret=' + client_secret + '&v=20160118' + '&query=' + this.title;

    $.ajax({
        type: "GET",
        url: FSURL,
        dataType: "json",
        cache: false,
        success: function(data) {
            var results = data.response.venues[0];
            self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: 'N/A';
            self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
          
        }
      }).fail(function() {
        alert('error occured while Requesting forsquare');
    });
  
  
    // Create a marker per location
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon
    });    



    self.filter = ko.computed(function () {
        if(self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });
    
    // Create an onclick even to open an indowindow at each marker
    this.marker.addListener('click', function() {
        populateInfoWindow(this,self.street,self.city,infoWindow);
        toggle(this);
        map.panTo(this.getPosition());
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    // show item info when selected from list
    this.show = function(location) {
        google.maps.event.trigger(self.marker, 'click');
    };

    // creates bounce effect when item selected
    this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};

};

/* View Model */
var ViewModel = function() {
    var self = this;

    this.Item = ko.observable('');

    this.markerList = ko.observableArray([]);

    // add location markers for each location
    locations.forEach(function(location) {
        self.markerList.push( new LocationMarker(location) );
    });

    // locations viewed on map
    this.locationList = ko.computed(function() {
        var searchFilter = self.Item().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.markerList(), function(location) {
                var str = location.title.toLowerCase();
                var result = str.includes(searchFilter);
                location.visible(result);
				return result;
			});
        }
        self.markerList().forEach(function(location) {
            location.visible(true);
        });
        return self.markerList();
    }, self);
};

// This function get the information when the pplace is clicked 

function populateInfoWindow(marker, street, city,infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        var windowContent = '<h4>' + marker.title + '</h4>'+'<p>' + street + "<br>" + city + '</p>' ;
          

        // position of the streetview image, then calculate the heading, then get a
        var getStreetView = function (data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent(windowContent + '<div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 20
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                // in case there is no  street  found for this place
                infowindow.setContent(windowContent + '<div style="color: red">No Street View Found</div>');
            }
        };
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

function toggle(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

 
  function zoomToArea() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-to-area-text').value;
    // Make sure the address isn't blank.
    if (address == '') {
      window.alert('You must enter an area, or address.');
    } else {
      // Geocode the address/area entered to get the center. Then, center the map
      // on it and zoom in
      geocoder.geocode(
        { address: address,
          componentRestrictions: {locality: 'cairo'}
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
          } else {
            window.alert('We could not find that location - try entering a more' +
                ' specific place.');
          }
        });
    }
  }

  function Errors() {
    alert('oops! An error has been occured ;) ');
}
