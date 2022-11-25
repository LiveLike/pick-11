
players = []
widgetsMap = new Map()

GK_LIMIT = 3
MID_LIMIT = 8
FWD_LIMIT = 7 
DEF_LIMIT = 8 


function initLiveLike() {
    LiveLike.init({
        clientId: 'mOBYul18quffrBDuq2IACKtVuLbUzXIPye5S3bq5',
      }).then(() => {
        fetchWidgets()
      });
}

function fetchWidgets() {
    LiveLike.getWidgets({
        programId: data.programId,
        status: "pending", //Valid status values are 'scheduled', 'pending', 'published'
        widgetKinds: ["image-number-prediction"],
        ordering: "recent"
      }).then(res => {
        widgetsArray = res.results
        widgetsArray.forEach(widget => {
              widget.options.forEach(option =>{
                players.push({"name":option.description,"age":34, "tag":widget.question,"club":option.description,"widgetId":widget.id, "optionId":option.id,"image":option.image_url})
              })
            
            widgetsMap.set(widget.question,[])
          });

          fetchPreviousSelection()
          createList()
      });
}

function fetchPreviousSelection() {
    widget_interaction_array = []
    widgetsArray.forEach(widget => {
        widget_interaction_array.push({"kind":"image-number-prediction", "id":widget.id,"tag":widget.question})
    })

    LiveLike.getWidgetInteractions({programId:data.programId,widgets:widget_interaction_array}).then(interactions => {
        imagePredInteractions = interactions['image-number-prediction']
        if(imagePredInteractions) {
            imagePredInteractions.forEach(interaction => {
                interaction.votes.forEach(vote => {
                    if(vote.number === 1) {
                        players.forEach(player => {
                            if(player.optionId === vote.option_id){ 
                                processSelection(player.tag,vote.option_id,player)
                                return
                            }
                        })
                        
                    }
                })
            })
        }
        
    })
}

function createList() {

    let container = document.querySelector(".list-group")
    players.forEach(player => {
        const entryRow = document.createElement('div');
        entryRow.setAttribute('href', '#');
        entryRow.setAttribute('class', 'list-group-item flex-column align-items-start');
        
        entryRow.innerHTML = `
        <div class="d-flex justify-content-between">

            <div class="flex-column align-items-start">
                <div class="d-flex justify-content-start">
                    <h5 class="mb-1">${player.name}</h5>
                    <div class="d-flex justify-content-center align-items-center" style="background:rgba(120, 221, 58, 0.4); border-radius:4px; margin-left:8px; padding:2px">
                        ${player.tag}
                    </div>

                </div>
                <p class="mb-1">Age:${player.age} | Club: ${player.club}</p>
            </div>
            <button tag=${player.tag} player = ${escape(JSON.stringify(player))} optionId=${player.optionId} class="ml-auto left-pane-btn" style="background: transparent;border: none;" onclick="select(this)">
                   <img></img>
            </button>
        </div>
        `;

        container.appendChild(entryRow)
    })
}

function select(optionElm) {
    let tag = optionElm.getAttribute('tag')
    let optionId = optionElm.getAttribute('optionId')
    player_info = JSON.parse(unescape(optionElm.getAttribute('player')))
    processSelection(tag, optionId, player_info)
}

function processSelection(tag, optionId, player_info){
    let selectedArr = widgetsMap.get(tag)
    let optionIndex = selectedArr.indexOf(optionId)
    if( optionIndex != -1){
        selectedArr.splice(optionIndex, 1)
        widgetsMap.set(tag,selectedArr)
        document.querySelector(`[optionid='${optionId}']`).removeAttribute('remove')
        removeFromRightPane(tag, optionId)
    } else {
        if(tag === "GK" && selectedArr.length >= GK_LIMIT) {
            alert("You can have maximum of "+GK_LIMIT+" goalkeepers")
        } else if (tag === "MID" && selectedArr.length >= MID_LIMIT){
            alert("You can have maximum of "+MID_LIMIT+" mid players")
        } else if (tag === "FWD" && selectedArr.length >= FWD_LIMIT){
            alert("You can have maximum of "+FWD_LIMIT+" forward players")
        } else if (tag === "DEF" && selectedArr.length >= DEF_LIMIT){
                alert("You can have maximum of "+DEF_LIMIT+" defence players")
        } else{
            document.querySelector(`[optionid='${optionId}']`).setAttribute('remove','')
            selectedArr.push(optionId)
            widgetsMap.set(tag,selectedArr)
            addToRightPane(tag, optionId, player_info)
        }
        
    }
}