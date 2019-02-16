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
    let client = new Twitter(context.secrets)
    let tweet = card.name + '\nSet: ' + card.set_name + '\nRarity: ' + card.rarity + '\nRelease Date: ' + card.released_at
    request.get({url: card.image_uris.normal, encoding: null}, function (err, res, bdy) {
      if (!err && res.statusCode === 200) {
        client.post('media/upload', {media: bdy}, function (error1, media, resp) {
          if (error1) {
            console.error('Error from media/upload: ' + error1)
            cb(error1)
          }

          console.log('Image uploaded to Twitter')

          var status = {
            status: tweet,
            media_ids: media.media_id_string
          }

          client.post('statuses/update', status, function (error2, twt, rsp) {
            if (!error2) {
              console.log('Tweeted OK!')
            }
          })
        }) 
      }
    })
  })
  cb(null, {status: 'Ok'})
}
