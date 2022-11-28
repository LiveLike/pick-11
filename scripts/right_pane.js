function removeFromRightPane(tag, optionId){
    let elmToRemove = document.querySelector(`[option_id='${optionId}']`)
    if (elmToRemove) {
        elmToRemove.remove()
    }
}

function remove(tag, optionId){
    processSelection(tag, optionId, undefined)
}


function addToRightPane(tag, optionId, player_data){
   // player_data = JSON.parse(player_data)
    let container = document.querySelector(`#${tag.toLowerCase()}_container`)
    let div = document.createElement('div')
    div.setAttribute('class','col')
    div.setAttribute('option_id',optionId)

    div.innerHTML = 
    `<div class="card mb-3" style="max-width: 240px;min-width: 240px;">
        <div class="row g-0">
            
            <div class="col-md-8">
                <div class="card-body">
                <h5 class="card-title">${player_data.name}</h5>
                <p class="card-text">${player_data.age}</p>
                <p class="card-text"><small class="text-muted">${player_data.tag}</small></p>
                </div>
            </div>
            <button optionId=${optionId} style="background: transparent;border: none; position:absolute; right:0; width:auto" onclick="remove(\'${player_data.tag}\',\'${optionId}\')">
                   <img src ="./close.png" ></img>
            </button>
            <div class="col-md-4">
                <img style="position: absolute;bottom: 0;right: 0; height:70%" src="${player_data.image}" class="img-fluid rounded-start" alt="...">
            </div>
        </div>  
    </div>`
    container.appendChild(div)

}


submitVotes = function(){
    widgetsArray.forEach(element => {
        selectedOptions = widgetsMap.get(element.question)
        const data = {
        votes:
          element.options &&
          element.options instanceof Array &&
          element.options.map((option) => {
            voteValue = 0
            if (selectedOptions.indexOf(option.id) != -1){
                voteValue = 1
            }
            return {
              option_id: option.id,
              number: voteValue,
            };
          }),
      }

      postVote(element.vote_url, data)
    });
}

function postVote(vote_url, data) {
    return axios({
        method: "post",
        url: vote_url,
        headers: {
            Authorization: 'Bearer '+LiveLike.userProfile.access_token
        },
        data: data
    }).then((w) => {
        console.log(w);
    });
}