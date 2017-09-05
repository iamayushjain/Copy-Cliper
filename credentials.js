
// Initialize Firebase

var config = {
  apiKey: "AIzaSyA6dqc5N8_RuG4bMIr1qoj4HxgmxQnCspQ",
  authDomain: "copycliper.firebaseapp.com",
  databaseURL: "https://copycliper.firebaseio.com",
  projectId: "copycliper",
  storageBucket: "copycliper.appspot.com",
  messagingSenderId: "84458212725"
};
firebase.initializeApp(config);

var uid ;
var consoleLog;
function initApp() {
  // Listen for auth state changes.
  // [START authstatelistener]
  consoleLog=document.getElementById('demo_log');
  consoleLog.textContent="okay in init";
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      uid= user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign out';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed in as '+displayName;
      document.getElementById('quickstart-account-details').textContent = 'login success'
      // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');

      var x = document.getElementById('form-for-submit');
      x.style.display = 'block';
      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
      document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      document.getElementById('quickstart-account-details').textContent = 'null';
      var x = document.getElementById('form-for-submit');
      x.style.display = 'none';
    }
    document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
  document.getElementById('submit-button').addEventListener('click', onButtonPressed, false);
}

/**  * Start the auth flow and authorizes to Firebase.  * @param{boolean}
interactive True if the OAuth flow should request with an interactive mode.
*/  function startAuth(interactive) {   
// Request an OAuth token from the Chrome Identity API.   
consoleLog.textContent="start is cool";

chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
  if (chrome.runtime.lastError && !interactive) {
    console.log('It was not possible to get a token programmatically.');
    consoleLog.textContent="It was not possible to get a token programmatically.";
  } else if(chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    consoleLog.textContent=chrome.runtime.lastError;
  } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        consoleLog.textContent="token nis cool";

        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
      consoleLog.textContent="token null";

    }
  });
}

/**
 * Starts the sign-in process.
 */

 function onButtonPressed() {

  var title= document.getElementById('title').value; 
  var message = document.getElementById('message').value;
  var d = new Date();
  var n = -d.getTime();
  writeUserData(uid,title,message,n);
}


function writeUserData(userId, title,message, time) {
  document.getElementById('quickstart-account-details').textContent = time;
  firebase.database().ref(uid).push().set({
    title: title,
    message: message,
    time : time
  });
}


function startSignIn() {
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

window.onload = function() {
  initApp();
};
