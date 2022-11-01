let gapi;

const GOOGLE_CLIENT_ID= '1033262249782-eo9p1mab0egluovie0uma33tl2mbjo0q.apps.googleusercontent.com' 
const GOOGLE_CLIENT_SECRET= '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' 
const GOOGLE_OAUTH_SCOPE= 'https://www.googleapis.com/auth/calendar' 
const REDIRECT_URI= 'http://localhost:3000/admin/appoinments' 
const API_KEY ='AIzaSyD7uTqXRKv4B8Dc30EZ-pS_5XY_d9UqIXM'
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]

export const googleOauthURL = `https://accounts.google.com/o/oauth2/auth?scope= ${GOOGLE_OAUTH_SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=code&client_id=${GOOGLE_CLIENT_ID}&access_type=online`; 

export const initClient = async (callback)=> {
  gapi = await import('gapi-script').then((pack) => pack.gapi);
  gapi.load('client:auth2',()=>{
      try {
          gapi.client.init({
              apiKey: API_KEY,
              clientId: GOOGLE_CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: GOOGLE_OAUTH_SCOPE,
              plugin_name:'GHC Growth Lab'
          }).then(function () {
              if (typeof(callback)==='function'){
                  callback(true)
              }
          }, function(error) {
              console.log(error);
          });
      } catch (error) {
          console.log(error);
      }
  });
};

export const signInToGoogle = async ()=>{
  try {
      let googleuser = await gapi.auth2.getAuthInstance().signIn({prompt:'consent'});
      if (googleuser){
          return true;
      }
  } catch (error) {
      console.log(error)
  }
};

export const checkSignInStatus =async () =>{
  try {
      let status = await gapi.auth2.getAuthInstance().isSignedIn.get();
      return status;
  } catch (error) {
      console.log(error);
  }
}

export const getSignedInUserEmail = async () => {
    console.log('getsignedemail');
  try {
      let status = await checkSignInStatus();
      if (status){
          var auth2 = gapi.auth2.getAuthInstance();
          var profile = auth2.currentUser.get().getBasicProfile();
          return profile.getEmail()
      } else {
          return await signInToGoogle()
      }
      
  } catch (error) {
      console.log(error)
  }
}

export const publishTheCalenderEvent = (event,cb) => {
    console.log(event);
  try {
      gapi.client.load('calendar', 'v3', () => {
          var request = gapi.client.calendar.events.insert({
              'calendarId': 'primary',
              'resource': event
          });
      
          request.execute(function(event) {
              console.log('Event created: ' + JSON.stringify(event));
              if(event.status === 'confirmed'){
                cb(false)
              }else{
                cb(true)
              }
              
          });
      })
        
  } catch (error) {
      console.log(error)
  }
}

export const signOut = ()=> {
    gapi.auth2.getAuthInstance().signOut().then(function () {
        auth2.disconnect();
});

}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}