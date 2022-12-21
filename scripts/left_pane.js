players = [];
widgetsMap = new Map();

GK_LIMIT = 3;
MID_LIMIT = 8;
FWD_LIMIT = 7;
DEF_LIMIT = 8;

function initLiveLike() {
  LiveLike.init({
    clientId: "mOBYul18quffrBDuq2IACKtVuLbUzXIPye5S3bq5",
  }).then(() => {
    document.querySelectorAll('.profile_nickname').forEach(e => e.innerHTML = LiveLike.userProfile.nickname + "'s Team");
    fetchWidgets();
  });
}

function fetchWidgets() {
  LiveLike.getWidgets({
    programId: data.programId,
    status: "pending", //Valid status values are 'scheduled', 'pending', 'published'
    widgetKinds: ["image-number-prediction"],
    ordering: "recent",
  }).then((res) => {
    widgetsArray = res.results;
    widgetsArray.forEach((widget) => {
      widget.options.forEach((option) => {
        players.push({
          name: option.description,
          age: 34,
          tag: widget.question,
          club: option.description,
          widgetId: widget.id,
          optionId: option.id,
          image: option.image_url,
        });
      });

      widgetsMap.set(widget.question, []);
    });

    fetchPreviousSelection();
    createList();
  });
}

function fetchPreviousSelection() {
  widget_interaction_array = [];
  widgetsArray.forEach((widget) => {
    widget_interaction_array.push({
      kind: "image-number-prediction",
      id: widget.id,
      tag: widget.question,
    });
  });

  LiveLike.getWidgetInteractions({
    programId: data.programId,
    widgets: widget_interaction_array,
  }).then((interactions) => {
    imagePredInteractions = interactions["image-number-prediction"];
    if (imagePredInteractions) {
      imagePredInteractions.forEach((interaction) => {
        interaction.votes.forEach((vote) => {
          if (vote.number === 1) {
            document.querySelector('#teamListMainBlock').style.display = "none"
            document.querySelector('.team-list-show').style.display = "block"
            players.forEach((player) => {
              if (player.optionId === vote.option_id) {
                processSelection(player.tag, vote.option_id, player);
                return;
              }
            });
          }
        });
      });
    }
  });
}

function createList() {
  let container = document.querySelector(".left-pane-block");
  players.forEach((player) => {
    //console.log(player)
    const entryRow = document.createElement("div");
    entryRow.setAttribute("href", "#");
    entryRow.setAttribute("class", "players-list");

    entryRow.innerHTML = `

            <div class="players-info-box">
                <div class="img-block">
                <img src="${player.image}" />
                </div>
                <div class="content-block">
                    <div class="d-flex align-items-center justify-content-start">
                        <h5>${player.name}</h5>
                        <div class="badge text-bg-danger">
                            ${player.tag}
                        </div>

                    </div>
                    <p>Age:${player.age} | Club: ${player.club}</p>
                </div>
            </div>
            <button tag=${player.tag} player = ${escape(
      JSON.stringify(player)
    )} optionId=${
      player.optionId
    } class="ml-auto left-pane-btn" style="background: transparent;border: none;" onclick="select(this)">
                   <img  />
            </button>
       
        `;

    container.appendChild(entryRow);
  });
}

function select(optionElm) {
  let tag = optionElm.getAttribute("tag");
  let optionId = optionElm.getAttribute("optionId");
  player_info = JSON.parse(unescape(optionElm.getAttribute("player")));
  processSelection(tag, optionId, player_info);
}

function processSelection(tag, optionId, player_info) {
  let selectedArr = widgetsMap.get(tag);
  let optionIndex = selectedArr.indexOf(optionId);

  if (optionIndex != -1) {
    selectedArr.splice(optionIndex, 1);
    widgetsMap.set(tag, selectedArr);
    document
      .querySelector(`[optionid='${optionId}']`)
      .removeAttribute("remove");
    removeFromRightPane(tag, optionId);
  } else {
    if (tag === "goalkeeper" && selectedArr.length >= GK_LIMIT) {
      alert("You can have maximum of " + GK_LIMIT + " goalkeepers");
    } else if (tag === "midfielder" && selectedArr.length >= MID_LIMIT) {
      alert("You can have maximum of " + MID_LIMIT + " mid players");
    } else if (tag === "FWD" && selectedArr.length >= FWD_LIMIT) {
      alert("You can have maximum of " + FWD_LIMIT + " forward players");
    } else if (tag === "defender" && selectedArr.length >= DEF_LIMIT) {
      alert("You can have maximum of " + DEF_LIMIT + " defence players");
    } else {
      document
        .querySelector(`[optionid='${optionId}']`)
        .setAttribute("remove", "");
      selectedArr.push(optionId);
      widgetsMap.set(tag, selectedArr);
      addToRightPane(tag, optionId, player_info);
      addToSubmitPage(tag, optionId, player_info);
    }
  }
  console.log(tag)
  document.querySelector(`#${tag}_Counter`).innerHTML = selectedArr.length;
}
