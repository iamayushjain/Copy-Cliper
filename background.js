// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase

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

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
}


function writeUserData(userId, title,message, time) {
  document.getElementById('quickstart-account-details').textContent = time;
  firebase.database().ref(uid).push().set({
    title: title,
    message: message,
    time : time
  });
}


window.onload = function() {
  initApp();
};
