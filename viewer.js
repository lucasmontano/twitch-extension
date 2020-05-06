let token = ""
let tuid = ""
let ebs = ""

const twitch = window.Twitch.ext

twitch.onContext(function (context) {
  twitch.rig.log(context)
})

twitch.onAuthorized(function () {
  $.ajax({
    type: "GET",
    url: "https://montano-twitch-extension.herokuapp.com/",
    success: renderTopParticipants,
    error: logError,
  })
})

function renderTopParticipants(topParticipants) {
  topParticipants.forEach((participant) => {
    $("#list").append(`<p>${participant.name}</p>`)
  })
}

function logError(_, error, status) {
  twitch.rig.log("EBS request returned " + status + " (" + error + ")")
}

function logSuccess(hex, status) {
  twitch.rig.log("EBS request returned " + hex + " (" + status + ")")
}
