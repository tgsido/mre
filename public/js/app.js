// This class will represent the music visualizer as a whole, similar to the

class App {
  constructor() {

    // Client ID and API key from the Developer Console
    this.CLIENT_ID = '57138272784-fpk078olbnv33vme7uubi2088hht633c.apps.googleusercontent.com';

    // Array of API discovery doc URLs for APIs used by the quickstart
    this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    this.SCOPES = "https://www.googleapis.com/auth/calendar";


    // Methods
    this.onGetStartedClicked = this.onGetStartedClicked.bind(this);
    this._onJsonReady = this._onJsonReady.bind(this);
    this._onResponse = this._onResponse.bind(this);
    this.onUserLogIn = this.onUserLogIn.bind(this);
    this.onUserLogOut = this.onUserLogOut.bind(this);
    this.onInsertEventClicked = this.onInsertEventClicked.bind(this);
    this.onNewMeetingSubmitted = this.onNewMeetingSubmitted.bind(this);
    this.getTimeZone = this.getTimeZone.bind(this);
    this.getDateTime = this.getDateTime.bind(this);


    // show/hide methods
    this.showAuthScreen = this.showAuthScreen.bind(this);
    this.hideAuthScreen = this.hideAuthScreen.bind(this);
    this.showHomeScreen = this.showHomeScreen.bind(this);
    this.hideHomeScreen = this.hideHomeScreen.bind(this);
    this.showNavBar = this.showNavBar.bind(this);
    this.hideNavBar = this.hideNavBar.bind(this);
    this.showEventScreen = this.showEventScreen.bind(this);
    this.hideEventScreen = this.hideEventScreen.bind(this);
    this.showNewMeetingForm = this.showNewMeetingForm.bind(this);
    this.hideNewMeetingForm = this.hideNewMeetingForm.bind(this);
    this.showPre = this.showPre.bind(this);
    this.hidePre = this.hidePre.bind(this);
    this.showMeetingContainer = this.showMeetingContainer.bind(this);
    this.hideMeetingContainer = this.hideMeetingContainer.bind(this);

    this.onMeetingPlaceChanged = this.onMeetingPlaceChanged.bind(this);
    this.onQuerySubmitted = this.onQuerySubmitted.bind(this);
    this.onQueryObjSubmitted = this.onQueryObjSubmitted.bind(this);
    this.onNewMeetingScheduled = this.onNewMeetingScheduled.bind(this);
    this.onNewMeetingClosed = this.onNewMeetingClosed.bind(this);
    this.onYourMeetingsLinkClicked = this.onYourMeetingsLinkClicked.bind(this);
    this.onBrandLinkClicked = this.onBrandLinkClicked.bind(this);


    // containers
    this.newsfeed = document.querySelector('#newsfeed');
    this.contentContainer = document.querySelector('#content');
    this.searchResultsContainer = document.querySelector('#search-results');
    this.meetingsContainer = document.querySelector('#meetings');



    // buttons
    this.getStartedButton = document.querySelector('#go-button');
    this.getStartedButton.addEventListener('click',this.onGetStartedClicked);
    this.authorizeButton = document.getElementById('authorize-button');
    //this.authorizeButton.addEventListener('click',this.handleAuthClick);
    this.signoutButton = document.getElementById('signout-button');
    //this.signoutButton.addEventListener('click',this.handleSignoutClick);
    this.insertEventButton = document.getElementById('insert-event-button');
    this.insertEventButton.addEventListener('click',this.onInsertEventClicked);
    this.submitNewMeeting = document.querySelector('#new-button-submit');
    this.submitNewMeeting.addEventListener('click',this.onNewMeetingSubmitted);
    this.closeNewMeetingButton = document.querySelector('#close-new-meeting');
    this.closeNewMeetingButton.addEventListener('click',this.onNewMeetingClosed);

    //nav-links
    this.yourMeetingsLink = document.querySelector('#your-meetings-link');
    this.yourMeetingsLink.addEventListener('click',this.onYourMeetingsLinkClicked);
    this.brandLink = document.querySelector('#brand');
    this.brandLink.addEventListener('click',this.onBrandLinkClicked);

    // screens
    this.authorizationScreen = document.querySelector('#auth-screen');
    this.homeScreen = document.querySelector('#home-screen');
    this.eventScreen = document.querySelector('#event-screen');
    this.navigationBar = document.querySelector('#navigation-bar');

    // forms
    this.newMeetingForm = document.querySelector('#new-meeting');

    // query-input form
    this.queryForm = document.querySelector('#mre-input-form');
    this.queryForm.addEventListener('submit', this.onQuerySubmitted);
    this.queryInput = document.querySelector('#event-query-input');




    // meeting place input: Places API stuff
    this.meetingPlace = null;
    var input = document.getElementById('autocomplete');
    this.autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(this.autocomplete, 'place_changed', this.onMeetingPlaceChanged);

      /* var place = autocomplete.getPlace();
      debugger; */
    document.addEventListener('user-loggedin',this.onUserLogIn);
    document.addEventListener('user-loggedout',this.onUserLogOut);
    document.addEventListener('query-submitted',this.onQueryObjSubmitted);
    document.addEventListener('new-meeting-scheduled',this.onNewMeetingScheduled);

    /* document.addEventListener('genre-choice-submitted', this.onUserSelectionsSubmitted); */
  }

  onBrandLinkClicked(event){
    this.hideEventScreen();
    this.showHomeScreen();
  }

  onYourMeetingsLinkClicked(event){
    this.showPre();
    this.hideMeetingContainer();
    this.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 20,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;
      appendPre('Upcoming events:');

        // clear container
        var pre = document.getElementById('content');
        pre.innerHTML = '';

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }

          let newEventSection = document.createElement("section");
          let meetingName = document.createElement("h1");
          let meetingLocation = document.createElement('p');
          let meetingTiming = document.createElement('p');
          var options = {
           weekday: "long", year: "numeric", month: "short",
           day: "numeric", hour: "2-digit", minute: "2-digit"
          };

         let startDate = new Date(event.start.dateTime);
         let endDate = new Date(event.end.dateTime);

          meetingName.textContent = event.summary;
          meetingLocation.textContent = 'Location: ' + event.location;
          meetingTiming.textContent = 'Time: ' + startDate.toLocaleTimeString("en-us", options) + ' - ' + endDate.toLocaleTimeString("en-us", options);

          newEventSection.appendChild(meetingName);
          newEventSection.appendChild(meetingTiming);
          newEventSection.appendChild(meetingLocation);

          pre.appendChild(newEventSection);

        }
      } else {
        appendPre('No upcoming events found.');
      }
    });
  }

  onNewMeetingClosed(event){
    this.hideNewMeetingForm();
    this.hidePre();
  }

  onNewMeetingScheduled(event){
    let dateObj = event.detail.dateObj;
    let meetingEvent = event.detail.meetingEvent;
    let meetingTag = event.detail.meetingTag;

    const message = {};
    message.dateObj = dateObj;
    message.meetingEvent = meetingEvent;
    message.meetingTag = meetingTag;
    const fetchOptions = {
      method: "POST",
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    };
    fetch('/save',fetchOptions);


  }
  // query obj from custom event
  onQueryObjSubmitted(event){
    let currentDate = event.detail.currentDate;
    let queryString = event.detail.query;
    // fetch from DB
    const query = "/" + currentDate.toISOString() + "/" + queryString;
    const method = {
      method: "GET"
    }
    fetch(query,method).then(this._onResponse).then(this._onJsonReady);
  }

  // query from form
  onQuerySubmitted(event){
    event.preventDefault();
    let newDate = new Date();
    let currentDate = new Date(newDate.toISOString());
    let query = this.queryInput.value;
    console.log('date: ' + currentDate +  'query: ' + query);
    const eventInfo = {};
    eventInfo.currentDate = currentDate;
    eventInfo.query = query;
    document.dispatchEvent(new CustomEvent('query-submitted', { detail: eventInfo }));
  }

  getTimeZone(tz){
    switch (tz) {
      case 'Pacific':
        return 'America/Los_Angeles';
      case 'Mountain':
        return 'America/Denver';
      case 'Central':
        return 'America/Chicago';
      case 'Eastern':
        return 'America/New_York';
      default:
        return 'not working ...';
    }
  }

  getDateTime(time,timezone){
    switch (timezone) {
      case 'America/Los_Angeles':
        return time + ':00-07:00';
      case 'America/Denver':
        return time + ':00-06:00';
      case 'America/Chicago':
        return time + ':00-05:00';
      case 'America/New_York':
        return time + ':00-04:00';
      default:
        return 'not working ...';
    }
  }

  onMeetingPlaceChanged(){
    this.meetingPlace = this.autocomplete.getPlace();
  }

  onNewMeetingSubmitted(event){
    event.preventDefault();

    this.hidePre();
    this.hideMeetingContainer();

    console.log('new meeting been submitted!');


    let meetingEvent = {};

    // meeting title
    console.log('new meeting submitted');
    let meetingTitle = document.querySelector('#meeting-title').value;
    console.log('meeting title' + meetingTitle);

    // meeting location
    let meetingLocation = document.querySelector('#autocomplete').value;
    console.log('meeting loc' + meetingLocation);

    // timezone
    let meetingTimezoneContainer = document.querySelector('#meeting-timezone');
    let timezoneIndex = meetingTimezoneContainer.selectedIndex;
    let meetingTimezone = meetingTimezoneContainer.options[timezoneIndex].value;
    console.log('meeting timeZone' + meetingTimezone);

    // start & end times
    let startTime = document.querySelector('#meeting-start-time').value;
    let endTime = document.querySelector('#meeting-end-time').value;
    let timezone = this.getTimeZone(meetingTimezone);
    let start = {};
    //start.dateTime = startTime + ':00-07:00';
    start.dateTime = this.getDateTime(startTime,timezone);
    start.timeZone = timezone;
    let end = {};
    //end.dateTime = endTime + ':00-07:00';
    end.dateTime = this.getDateTime(endTime,timezone);
    end.timeZone = timezone;

    let meetingAttendee = document.querySelector('#meeting-attendee').value;
    console.log('meeting attendee' + meetingAttendee);
    let attendees = [];
    let attendeeObj = {};
    attendeeObj.email = meetingAttendee;
    attendees.push(attendeeObj);

    let meetingDescription = document.querySelector('#meeting-description').value;
    console.log('meeting-desc' + meetingDescription);

    if(meetingTitle !== '') meetingEvent.summary = meetingTitle;
    if(meetingLocation !== '') meetingEvent.location = meetingLocation;
    if(meetingDescription !== '') meetingEvent.description = meetingDescription;
    meetingEvent.start = start;
    meetingEvent.end = end;
    if(attendees !== '') meetingEvent.attendees = attendees;


    meetingEvent.anyoneCanAddSelf = true;
    meetingEvent.visibility = 'public';
    meetingEvent.locked = false;


    var request = this.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': meetingEvent
    });


      // other eventObj components
      let eventStartDate = new Date(start.dateTime);
      let isoDateObj = new Date(eventStartDate.toISOString());
      let eventTag = document.querySelector('#meeting-tag').value;


      request.execute(function(meetingEvent) {
        console.log('Event created: ' + meetingEvent.htmlLink);
        console.log('event id: ' + meetingEvent.id);

        const eventInfo = {};
        /*
        const dateObj = req.body.dateObj;
        const event = req.body.event;
        const meetingTag = req.body.meetingTag; */
        eventInfo.dateObj = isoDateObj;
        eventInfo.meetingEvent = meetingEvent;
        eventInfo.meetingTag = eventTag;
        document.dispatchEvent(new CustomEvent('new-meeting-scheduled', { detail: eventInfo }));
      });

    this.hideNewMeetingForm();

  }

  showAuthScreen(){
    this.authorizationScreen.classList.remove('inactive');
  }

  hideAuthScreen(){
    this.authorizationScreen.classList.add('inactive');
  }

  showHomeScreen(){
    this.homeScreen.classList.remove('inactive');
  }

  hideHomeScreen(){
    this.homeScreen.classList.add('inactive');
  }

  showEventScreen(){
    this.eventScreen.classList.remove('inactive');
  }

  hideEventScreen(){
    this.eventScreen.classList.add('inactive');
  }

  showNavBar(){
    this.navigationBar.classList.remove('inactive');
  }

  hideNavBar(){
    this.navigationBar.classList.add('inactive');
  }

  showNewMeetingForm(){
    this.newMeetingForm.classList.remove('inactive');
  }

  hideNewMeetingForm(){
    this.newMeetingForm.classList.add('inactive');
  }

  showPre(){
    this.contentContainer.classList.remove('inactive');
  }

  hidePre(){
    this.contentContainer.classList.add('inactive');
  }

  showMeetingContainer(){
    this.meetingsContainer.classList.remove('inactive');
  }

  hideMeetingContainer(){
    this.meetingsContainer.classList.add('inactive');
  }

  onUserLogOut(event){
    this.hideHomeScreen();
    this.hideEventScreen();
    this.hideNavBar();
    this.showAuthScreen();
    this.hidePre();
    this.hideMeetingContainer();
  }

  onUserLogIn(event){
    console.log('user logged in yay!!!');
    this.gapi = event.detail.gapi;
    this.hideAuthScreen();
    this.showHomeScreen();
    this.showNavBar();
  }


  onInsertEventClicked(event){
    this.showNewMeetingForm();
    /*
    var event = {
    'summary': 'redoing some shit',
    'location': 'green',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2017-07-20T10:00:00-07:00',
      'timeZone': 'America/Los_Angeles'
    },
    'end': {
      'dateTime': '2017-07-20T15:00:00-09:00',
      'timeZone': 'America/Los_Angeles'
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'}
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }
  };

  var request = this.gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

    request.execute(function(event) {
      console.log('Event created: ' + event.htmlLink);
    }); */
  }

  onGetStartedClicked(event){
    console.log('onGetStartedClicked ..');
    this.hideHomeScreen();
    this.showEventScreen();
    /*
    const query = "/events";
    const method = {
      method: "GET"
    }
    fetch(query,method).then(this._onResponse).then(this._onJsonReady); */
  }

  _onJsonReady(json) {

    this.contentContainer.classList.add('inactive');
    this.searchResultsContainer.classList.remove('inactive');

   if (!json) {
     return;
   }

   // clear container out
   this.meetingsContainer.innerHTML = '';
   this.showMeetingContainer();
   this.meetingsContainer.classList.add('container');

   // adding searchResultHeader
   /*
   let searchResultHeader = document.createElement("h1");
   searchResultHeader.textContent = 'Search Results:';
   this.meetingsContainer.appendChild(searchResultHeader);*/

   for (var index = json.length - 1; index >= 0; index--) {
     let eventObj = json[index];

     let newEventSection = document.createElement("section");
     let meetingName = document.createElement("h1");
     let meetingLocation = document.createElement('p');
     let meetingTiming = document.createElement('p');
     let meetingContact = document.createElement('p');

     meetingName.textContent = eventObj.meetingEvent.summary;
     meetingLocation.textContent = 'Location: ' + eventObj.meetingEvent.location;

     var options = {
      weekday: "long", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };

    let startDate = new Date(eventObj.meetingEvent.start.dateTime);
    let endDate = new Date(eventObj.meetingEvent.end.dateTime);

     meetingTiming.textContent = 'Time: ' + startDate.toLocaleTimeString("en-us", options) + ' - ' + endDate.toLocaleTimeString("en-us", options);
     meetingContact.textContent = 'Want to join? Contact ' + eventObj.meetingEvent.organizer.email + ' for more information';


     newEventSection.appendChild(meetingName);
     newEventSection.appendChild(meetingTiming);
     newEventSection.appendChild(meetingLocation);
     newEventSection.appendChild(meetingContact);


     this.meetingsContainer.appendChild(newEventSection);
     //this.newsfeedContainer.appendChild(newShuffleSection);


   }

 }

 _onResponse(response) {
   return response.json();
 }



}
