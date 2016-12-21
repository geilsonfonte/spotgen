var request = require('request')

module.exports = function (key) {
  var lastfm = {}

  /**
   * Perform a Last.fm request.
   * @param {string} url - The URL to look up.
   */
  lastfm.request = function (url) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log(url.replace('&api_key=' + key, ''))
        request(url, function (err, response, body) {
          if (err) {
            reject(err)
          } else if (response.statusCode !== 200) {
            reject(response.statusCode)
          } else {
            try {
              body = JSON.parse(body)
            } catch (e) {
              reject(e)
            }
            if (body.error) {
              reject(body)
            } else {
              resolve(body)
            }
          }
        })
      }, 100) // 10
    })
  }

  /**
   * Get the Last.fm metadata for a track.
   * @param {String} artist - The artist.
   * @param {String} title - The title.
   * @param {boolean} [correct] - Whether to autocorrect misspellings,
   * default true.
   * @return {Promise | JSON} The track info.
   */
  lastfm.getInfo = function (artist, title, correct) {
    correct = (correct !== false)
    artist = encodeURIComponent(artist)
    title = encodeURIComponent(title)
    key = encodeURIComponent(key)

    // http://www.last.fm/api/show/track.getInfo
    var url = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo'
    url += '&api_key=' + key
    url += '&artist=' + artist
    url += '&track=' + title
    url += '&format=json'

    return lastfm.request(url).then(function (result) {
      if (result && !result.error && result.track) {
        return Promise.resolve(result)
      } else {
        return Promise.reject(result)
      }
    })
  }

  return lastfm
}