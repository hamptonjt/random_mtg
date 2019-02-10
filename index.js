'use strict'
let Twitter = require('twitter')
let request = require('request')

const randomUrl = 'https://api.scryfall.com/cards/random'

/**
 * @param context {WebtaskContext}
 */
module.exports = function (context, cb) {
  request({method: 'GET', url: randomUrl, json: true}, function (e, response, body) {
    if (e) {
      console.error(e)
      cb(e)
    }
    let card = body
    // console.log(card.name, '-', card.set_name)
    // console.log('Release Date:', card.released_at)
    // console.log(card.image_uris.normal)

    let client = new Twitter(context.secrets)
    let tweet = card.name + ' - ' + card.set_name + '\nRelease Date: ' + card.released_at
    request.get({url: card.image_uris.normal, encoding: null}, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        client.post('media/upload', {media: body}, function (error, media, response) {
          if (error) {
            console.error('Error from media/upload: ' + error)
            cb(error)
          }

          console.log('Image uploaded to Twitter')

          var status = {
            status: tweet,
            media_ids: media.media_id_string
          }

          client.post('statuses/update', status, function (error, tweet, response) {
            if (!error) {
              console.log('Tweeted OK!')
            }
          })
        }) 
      }
    })
  })
  cb(null, {status: 'Ok'})
}
