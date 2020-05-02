var token = ""
var tuid = ""
var ebs = ""

// because who wants to type this every time?
var twitch = window.Twitch.ext

// create the request options for our Twitch API calls
var requests = {
  set: createRequest("POST", "cycle"),
  get: createRequest("GET", "query"),
  setTopParticipants: createRequest("POST", "participants"),
}

function createRequest(type, method) {
  return {
    type: type,
    url: location.protocol + "//localhost:8081/color/" + method,
    success: updateBlock,
    error: logError,
  }
}

function setAuth(token) {
  Object.keys(requests).forEach((req) => {
    twitch.rig.log("Setting auth headers")
    requests[req].headers = { Authorization: "Bearer " + token }
  })
}

twitch.onContext(function (context) {
  twitch.rig.log(context)
})

twitch.onAuthorized(function (auth) {
  // save our credentials
  token = auth.token
  tuid = auth.userId

  setAuth(token)
  $.ajax(requests.get)
})

function updateBlock(topParticipants) {
  twitch.rig.log(`Top Participants: ${topParticipants}`)
  topParticipants.forEach((participant) => {
    $("#list").append(`<p>${participant.name}</p>`)
  })
}

function logError(_, error, status) {
  twitch.rig.log("EBS request returned " + status + " (" + error + ")")
}

function logSuccess(hex, status) {
  // we could also use the output to update the block synchronously here,
  // but we want all views to get the same broadcast response at the same time.
  twitch.rig.log("EBS request returned " + hex + " (" + status + ")")
}

$(function () {
  // listen for incoming broadcast message from our EBS
  twitch.listen("broadcast", function (target, contentType, topParticipants) {
    twitch.rig.log("Received broadcast color:" + topParticipants)
  })
})
