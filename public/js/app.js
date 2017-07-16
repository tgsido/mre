// This class will represent the music visualizer as a whole, similar to the

class App {
  constructor() {
    // Methods
    this.onGetStartedClicked = this.onGetStartedClicked.bind(this);
    this._onJsonReady = this._onJsonReady.bind(this);
    this._onResponse = this._onResponse.bind(this);

    // newsfeed
    this.newsfeed = document.querySelector('#newsfeed');

    // buttons
    this.getStartedButton = document.querySelector('#go-button');
    this.getStartedButton.addEventListener('click',this.onGetStartedClicked);

    /* document.addEventListener('genre-choice-submitted', this.onUserSelectionsSubmitted); */
  }

  onGetStartedClicked(event){
    console.log('onGetStartedClicked ..');
    const query = "/events";
    const method = {
      method: "GET"
    }
    fetch(query,method).then(this._onResponse).then(this._onJsonReady);
  }

  _onJsonReady(json) {

   if (!json) {
     return;
   }


   for (var index = json.length - 1; index >= 0; index--) {
     let event = json[index];
     let newEventSection = document.createElement("section");
     let meetingName = document.createElement("h1");
     let meetingLocation = document.createElement('p');
     meetingName.textContent = event.description;
     meetingLocation.textContent = event.location;

     newEventSection.appendChild(meetingName);
     newEventSection.appendChild(meetingLocation);

     this.newsfeed.appendChild(newEventSection);
     //this.newsfeedContainer.appendChild(newShuffleSection);


   }

 }

 _onResponse(response) {
   return response.json();
 }



}
