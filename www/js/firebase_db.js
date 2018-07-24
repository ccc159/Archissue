// Initialize Firebase
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBUFEbq2gZdasv7RmW9N00W_5gZ76PYp5Y",
  authDomain: "forge-issue.firebaseapp.com",
  databaseURL: "https://forge-issue.firebaseio.com",
  projectId: "forge-issue",
  storageBucket: "forge-issue.appspot.com",
  messagingSenderId: "955354631922"
}

var firebaseApp = firebase.initializeApp(FIREBASE_CONFIG)
var db = firebaseApp.database()
Vue.use(VueFire)
