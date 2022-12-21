function removeFromRightPane(tag, optionId) {
  let elmToRemove = document.querySelector(`[option_id='${optionId}']`);
  if (elmToRemove) {
    elmToRemove.remove();
  }
}

function remove(tag, optionId) {
  processSelection(tag, optionId, undefined);
}

function addToRightPane(tag, optionId, player_data) {
  // player_data = JSON.parse(player_data)
  let container = document.querySelector(`#${tag.toLowerCase()}_container`);
  let div = document.createElement("div");
  div.setAttribute("class", "player-card-items");
  div.setAttribute("option_id", optionId);
  div.innerHTML = `
  <div class="player-card-info-header">
    <div class="player-card-infobox">
        <h5>${player_data.name}</h5>
        <h6>Age : ${player_data.age}</h6>
        <div class="badge text-bg-danger">${player_data.tag}</div>
        
    </div>
    <img src ="images/close.png" optionId=${optionId} class="close-btn" onclick="remove(\'${player_data.tag}\',\'${optionId}\')" />
    </div>
    <img src="${player_data.image}" class="player-img" alt="${player_data.name}" />`;
  container.appendChild(div);
}

function addToSubmitPage(tag, optionId, player_data) {
  let container = document.querySelector(`.teamlist-${tag.toLowerCase()}s`)
  let li = document.createElement("li");
  li.innerHTML = 
  `
    <div class="teamlist-set-list-item">
      <div class="img-block">
        <img src="${player_data.image}">
      </div>
      <div class="content-block">
        <h4>${player_data.name}</h4>
        <h6>${player_data.tag}</h6>
      </div>
    </div>
  `
  console.log(tag)
  console.log(`teamlist-${tag.toLowerCase()}s`)
  container.appendChild(li);
}

download = function () {
  htmlToImage.toJpeg(document.querySelector(".team-list-show"), { quality: 0.95 })
  .then(function (dataUrl) {
    var link = document.createElement('a');
    link.download = 'image.jpeg';
    link.href = dataUrl;
    link.click();
  });
}

submitVotes = function () {
  widgetsArray.forEach((element) => {
    selectedOptions = widgetsMap.get(element.question);
    const data = {
      votes:
        element.options &&
        element.options instanceof Array &&
        element.options.map((option) => {
          voteValue = 0;
          if (selectedOptions.indexOf(option.id) != -1) {
            voteValue = 1;
          }
          return {
            option_id: option.id,
            number: voteValue,
          };
        }),
    };

    postVote(element.vote_url, data);
  });
};

function postVote(vote_url, data) {
  return axios({
    method: "post",
    url: vote_url,
    headers: {
      Authorization: "Bearer " + LiveLike.userProfile.access_token,
    },
    data: data,
  }).then((w) => {
    console.log(w);
  });
}
