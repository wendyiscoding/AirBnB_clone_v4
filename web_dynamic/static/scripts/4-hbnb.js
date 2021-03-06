$(function () {
  let amenDict = {};
  let amenKeys = Object.keys(amenDict);
  $('input').on('click', function () {
    let amenStr = '';
    if (this.checked) {
      amenDict[(this.getAttribute('data-id'))] = (this.getAttribute('data-name'));
      amenStr = Object.values(amenDict).join(', ');
      amenKeys = Object.keys(amenDict);
      $('.amenities h4').empty();
      $('.amenities h4').append(amenStr);
    }
    if (!(this.checked)) {
      let toDelete = this.getAttribute('data-id');
      delete amenDict[toDelete];
      amenStr = Object.values(amenDict).join(', ');
      amenKeys = Object.keys(amenDict);
      $('.amenities h4').empty();
      $('.amenities h4').append(amenStr);
    }
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').toggleClass('available');
    }
  });
  function postData (amenFilter) {
    const Url = 'http://0.0.0.0:5001/api/v1/places_search';
    $.ajax({
      method: 'POST',
      url: Url,
      contentType: 'application/json',
      data: JSON.stringify(amenFilter)
    }).done(function (data) {
      data.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      $('section.places').empty();
      $.each(data, function (index, place) {
        $('section.places').append(
          '<article>' +
                          '<div class="title">' +
                          '<h2>' + place.name + '</h2>' +
                          '<div class="price_by_night">' +
                          '$' + place.price_by_night +
                          '</div>' +
                          '</div>' +
                          '<div class="information">' +
                          '<div class="max_guest">' +
                          '<i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' +
                          place.max_guest + 'Guests' +
                          '</div>' +
                          '<div class="number_rooms">' +
                          '<i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' +
                          place.number_rooms + 'Bedrooms' +
                          '</div>' +
                          '<div class="number_bathrooms">' +
                          '<i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' +
                          place.number_bathrooms + 'Bathroom' +
                          '</div>' +
                          '</div>' +
          // <div class="user">
          //  <strong>Owner: {{ users[place.user_id] }}</strong>
          // </div>
                          '<div class="description">' +
                          place.description +
                          '</div>' +
                  '</article>'
        );
      });
    });
  }

  postData({});

  $('button').click(function () {
    let toFilter = {};
    let key = 'amenities';
    toFilter[key] = amenKeys;
    postData(toFilter);
  });
});
