$( document ).ready(function() {
  var input = document.getElementById('address');
  var options = {componentRestrictions: {country: 'us'}};
  var geocoder = new google.maps.Geocoder();
  var infowindow = new google.maps.InfoWindow();
  var place = new google.maps.LatLng(34.0500, -118.2500);

  new google.maps.places.Autocomplete(input, options);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: place,
    zoom: 11
  });

  $('#geocoding_form').submit(function(e){
    console.log("hey");
    e.preventDefault();
    var address = document.getElementById('address').value;
    geocoder.geocode({
      'address': address
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var type = document.getElementById('type').value;
        var latlng = results[0].geometry.location;
        map.setCenter(results[0].geometry.location);

        circle = new google.maps.Circle({
          center: latlng,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "transparent",
          map: map
        });

        switch($("#radius").val()) {
          case "one":
            circle.setRadius(1609.34);
            var request = {
              location: latlng,
              radius: 1609.34,
              types: [type]
            };
            break;
          case "five":
            circle.setRadius(8046.72);
            var request = {
              location: latlng,
              radius: 8046.72,
              types: [type]
            };
            break;
          case "ten":
            circle.setRadius(16093.4);
            var request = {
              location: latlng,
              radius: 16093.4,
              types: [type]
            };
            break;
          case "twenty":
            circle.setRadius(32186.9);
            var request = {
              location: latlng,
              radius: 16093.4,
              types: [type]
            };
            break;
        }

        var bounds = circle.getBounds();
        map.fitBounds(bounds);

        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          }
        }

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        var markers = [];
        function createMarker(place) {
          var placeLoc = place.geometry.location;
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });

          google.maps.event.addListener(marker, 'click', function(e) {
            var request = {
              reference: place.reference
            };

            service.getDetails(request, function(details, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                var infoContent = "";
                if (details.name) infoContent += details.name + "<br />";
                if (details.formatted_address) infoContent += details.formatted_address + "<br />";
                if (details.website) infoContent += details.website + "<br />";
                if (details.rating) infoContent += details.rating + "<br />";
                if (details.formatted_phone_number) infoContent += details.formatted_phone_number + "<br>";
                infowindow.setContent(infoContent);
              }
              else {
                infowindow.setContent("request failed, status=" + status);
              }
              infowindow.open(map, marker);
            });
          });

          markers.push(marker);
        }

        $('#geocoding_form').submit(function(e){
          circle.setMap(null);
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }
        });
      }
    });
  });

});
google.maps.event.addDomListener(window, 'load', initialize);