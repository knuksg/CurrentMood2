function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 16,
    minZoom : 15,
    maxZoom : 17,
    zoomControl: true,
    disableDefaultUI: true,
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(pos);

        var geocoder = new google.maps.Geocoder

        geocoder.geocode({'location': pos}, function(results, status) {
          if (status === 'OK') {
            var placeId1 = results[0].place_id
            var request1 = {
              placeId: placeId1,
              fields: ['address_component', 'adr_address', 'business_status', 'formatted_address', 'geometry', 'icon', 'icon_mask_base_uri', 'icon_background_color', 'name', 'photo', 'place_id', 'plus_code', 'type', 'url', 'utc_offset_minutes', 'vicinity'],
            };

            var placeId2 = results[1].place_id
            var request2 = {
              placeId: placeId2,
              fields: ['address_component', 'adr_address', 'business_status', 'formatted_address', 'geometry', 'icon', 'icon_mask_base_uri', 'icon_background_color', 'name', 'photo', 'place_id', 'plus_code', 'type', 'url', 'utc_offset_minutes', 'vicinity'],
            };

            var placeId3 = results[2].place_id
            var request3 = {
              placeId: placeId3,
              fields: ['address_component', 'adr_address', 'business_status', 'formatted_address', 'geometry', 'icon', 'icon_mask_base_uri', 'icon_background_color', 'name', 'photo', 'place_id', 'plus_code', 'type', 'url', 'utc_offset_minutes', 'vicinity'],
            };

            service = new google.maps.places.PlacesService(map);
            service.getDetails(request1, callback1);
            service.getDetails(request2, callback2);
            service.getDetails(request3, callback3);
            
            function callback1(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                  var markerView = new google.maps.Marker({
                  map: map,
                  position: pos,
                  })
                
                  const searchPlaceInput = document.querySelector('#search-place-input')
                  searchPlaceInput.value = place.name
                  const place1 = document.querySelector('#place-1')
                  place1.innerText = place.name

                  var value = place.name
                  document.cookie = "key=" + value
                  console.log(document.cookie)
              }
            }

            function callback2(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                const place2 = document.querySelector('#place-2')
                  place2.innerText = place.name
              }
            }

            function callback3(place, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                  const place3 = document.querySelector('#place-3')
                  place3.innerText = place.name
              }
            }
          } else {
            console.log('잘못된 주소.')
          }
        })
      },
      
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  map.addListener("click", () => {
    window.setTimeout(() => {
      if (document.querySelector('div.poi-info-window')) {
        const searchPlace = document.querySelector('div.poi-info-window').querySelector('div.title').innerText
        const searchPlaceInput = document.querySelector('#search-place-input')
        searchPlaceInput.value = searchPlace
      }
    }, 1000);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;

function placeToView(place) {
  const placeToViewForm = document.querySelector('#place-to-view-form')
  const placeToViewInput = document.querySelector('#place-to-view-input')
  placeToViewInput.value = place
  placeToViewForm.submit()
}

const mapBtn = document.querySelector('#map-btn')
  mapBtn.addEventListener('click', function (e) {
    initMap()
  })
  
function placeInput(place) {
  const searchPlaceInput = document.querySelector('#search-place-input')
  searchPlaceInput.value = place
}