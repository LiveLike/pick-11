
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
        programId: "665f9294-71f3-4b49-9beb-b248026d14d0",
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

    LiveLike.getWidgetInteractions({programId:"665f9294-71f3-4b49-9beb-b248026d14d0",widgets:widget_interaction_array}).then(interactions => {
        imagePredInteractions = interactions['image-number-prediction']
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
            <button tag=${player.tag} player = ${escape(JSON.stringify(player))} optionId=${player.optionId} class="ml-auto" style="background: transparent;border: none;" onclick="select(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-file-plus" viewBox="0 0 16 16">
                        <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"/>
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                    </svg>
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
    console.log(selectedArr)
    
    let optionIndex = selectedArr.indexOf(optionId)
    if( optionIndex != -1){
        selectedArr.splice(optionIndex, 1)
        widgetsMap.set(tag,selectedArr)
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
            selectedArr.push(optionId)
            widgetsMap.set(tag,selectedArr)
            addToRightPane(tag, optionId, player_info)
        }
        
    }
}