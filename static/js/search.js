const searchInput = document.querySelector('#search-form > input.form-control').placeholder
console.log(searchInput)

getSearchList(searchInput)

function getSearchList(kw) {
  const apiKey = "AIzaSyC6_bB2PiPp_Vtf8cPdnhoQ-hzL4gNVFIE"
  axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      key: apiKey,
      part: "snippet",
      order: "viewCount",
      q: kw,
      type: "video",
      maxResults: 10,
    }
  })
    .then(function (response) {
      console.log('good', response)
      const searchList = document.querySelector('#search-list')
      searchList.innerHTML = ''
      const searchItems = response.data.items
      searchItems.forEach((searchItem) => {
        searchList.innerHTML += `
        <hr>
        <div id="song-container">
          <img src="`+ searchItem.snippet.thumbnails.high.url + `" alt="">
          <div id="` + searchItem.id.videoId + `">
            <p class="title">`+ searchItem.snippet.title +`</p>
            <p class="channel">`+ searchItem.snippet.channelTitle +`</p>
          </div>
        </div>
        `
      })
    })
}