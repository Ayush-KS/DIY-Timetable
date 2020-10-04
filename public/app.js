var firebaseConfig = {
  apiKey: "AIzaSyBCQhdQnscUfoiGXqUjzg-6sIRoXSC_cE8",
  authDomain: "diy-timetable.firebaseapp.com",
  databaseURL: "https://diy-timetable.firebaseio.com",
  projectId: "diy-timetable",
  storageBucket: "diy-timetable.appspot.com",
  messagingSenderId: "313912208976",
  appId: "1:313912208976:web:099529092278bc19fe6b55"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('welcome');


const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

var userName;

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h6>Hey ${user.displayName}!</h6>`;
        userName = user.displayName;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

var tables = $("#tables");

const db = firebase.firestore();
var ref = db.collection("tables");
ref.get()
.then(function(querySnapshot) {
    //var i = 0;
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots

        var columnDefs = [
          {headerName: "Day", field: "day", width: 120},
          {headerName: "8-9", field: "eight", width: 120 },
          {headerName: "9-10", field: "nine", width: 120 },
          {headerName: "10-11", field: "ten", width: 120 },
          {headerName: "11-12", field: "eleven", width: 120 },
          {headerName: "12-1", field: "twelve", width: 120 },
          {headerName: "1-2", field: "one", width: 120 },
          {headerName: "2-3", field: "two", width: 120 },
          {headerName: "3-4", field: "three", width: 120 },
        ];

        //console.log(i);
        var currId = "tab" + doc.id.substr(0,doc.id.indexOf(' '));;
        //console.log(currId);
        
        tables.append("<div style='height: 20px; width:100%'> </div>")
        tables.append("<h3>" + doc.id + "'s timetable</h3>")
        tables.append("<div id='" + currId + "' style='height: 300px;width:1100px;' class='ag-theme-alpine'></div>");

        //console.log(tables);

        // specify the data
        var rowData = [];

        var sub = doc.data().subjects;
        //console.log(sub);

        var days = ["Monday", "Tueday", "Wednesday", "Thursday", "Friday"];

        for(var i = 0; i < 5; i++) {
          var obj = {};
          obj.day = days[i];
          obj.eight = sub[8*i + 0];
          obj.nine = sub[8*i + 1];
          obj.ten = sub[8*i + 2];
          obj.eleven = sub[8*i + 3];
          obj.twelve = sub[8*i + 4];
          obj.one = sub[8*i + 5];
          obj.two = sub[8*i + 6];
          obj.three = sub[8*i + 7];

          rowData.push(obj);
        }

        // let the grid know which columns and what data to use
        var gridOptions = {
          columnDefs: columnDefs,
          rowData: rowData
        };

        // lookup the container we want the Grid to use
        var eGridDiv = document.querySelector("#" + currId);

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid(eGridDiv, gridOptions);

        // console.log(doc.id, " => ", doc.data());
        i++;
    });
})
.catch(function(error) {
    console.log("Error getting documents: ", error);
});



$("#make").click(function() {
  var inputs = $("td input");
  var arr = [];
  for(var i = 0; i < inputs.length; i++) {
    arr.push(inputs[i].value);
  }
  db.collection("tables").doc(userName).set({subjects: arr});
  setTimeout(function(){ location.reload() }, 1000);
  // console.log(arr);
})