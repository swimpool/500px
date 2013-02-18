var photos = []
var widget = null

$(document).ready(function() {

  _500px.init({
    sdk_key: '6a534bad4652ce1ee60566b5de899aaab90c05d7'
  })

  widget = $('#chameleon-widget')

  chameleon.widget({
    onLoad: function() {
      loadPhotoFeed()
    },
    onResume: function() {
      updateSizes()
    },
    onLayout: function() {
      updateSizes()
    },
    onConfigure: function() {
      chameleon.promptHTML({
        url:"settings.html",
        result: postConfigure
      })
    },
    onRefresh: function() {
      if (chameleon.devMode()) {
        gecko.reloadWidget()
      }
    },
    notChameleon: function () {
      loadPhotoFeed()
    }
  })

  widget.on('click', '.photo-div', photoClicked)
})

function photoClicked(event) {
  var $photo = $(event.currentTarget)
  gecko.openUrl('http://500px.com/photo/' + $photo.data('id'))
}

function loadPhotos(type, callback) {
  photos = []
  var options = {
    feature: type,
    page: 1
  }
  if (gecko.getInstanceData('nudity')) {
    options.exclude = 'Nude'
  }
  _500px.api('/photos', options, function (response) {
    _.each(response.data.photos, function(photo) {
      photos.push(photo)
    })
    callback()
  })
}

function renderPhotos() {
  _.each(photos, function(photo) {
    photo.image_url = photo.image_url.replace('2.jpg', '3.jpg')
    widget.append(ich.photo(photo))
  })
  widget.append($('<div style="clear: both"></div>'))
  updateSizes()
}

function loadPhotoFeed() {
  widget.html('')
  var type = gecko.getInstanceData('feed-type', defaultFeed)
  gecko.setTitle(['500px', publicFeeds[type]].join(': '))
  loadPhotos(type, renderPhotos)
}

function postConfigure(success) {
  if (success) {
    loadPhotoFeed()
  }
}

function updateSizes() {

  var cols = Math.ceil(widget.width() / 280)
  var image_width = Math.floor((widget.width() - ((cols - 1) * 20)) / cols)
  if ($(window).height() < ((image_width + 40) * 2)) {
    cols += 1
    image_width = Math.floor((widget.width() - ((cols - 1) * 20)) / cols)
  }

  $('.photo-div').hide()

  $('.photo-div img').css('width', image_width + 'px')
  $('.photo-div img').css('height', image_width + 'px')
  $('.photo-div p').css('width', (image_width - 8) + 'px')

  $('.photo-div.endofrow').removeClass('endofrow')
  $('.photo-div:nth-child(' + cols + 'n)').addClass('endofrow')

  $('.photo-div').show()
}
