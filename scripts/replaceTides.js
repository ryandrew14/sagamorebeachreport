// NOAA-formatted TideObjects are a class with three elements;
// t, the time and date; v, the height of the tide; and type, high or low tide;
// t, the NOAA time string, will be formatted as "YYYY-MM-DD hh:mm"

var todayDate = new Date();
var todayDate2 = new Date();
var tomorrowDate = todayDate2.setDate(todayDate2.getDate() + 1);
var today = formatDate(todayDate);
var tomorrow = formatDate(tomorrowDate);

// XHR stuff
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://tidesandcurrents.noaa.gov/api/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date="+today+"&end_date="+tomorrow+"&datum=MLLW&station=8447173&time_zone=lst_ldt&units=english&interval=hilo&format=json",);
xhr.responseType = "json";

// takes in a date and formats it YYYYMMDD
// borrowed from user o-o on StackOverflow
function formatDate(d) {
  var nd = new Date(d);
  var mm = nd.getMonth() + 1;
  var dd = nd.getDate();
  return [nd.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
}

// gets the NOAA-formatted date from a TideObject and formats it as "YYYYMMDD"
function getNOAADate(tide) {
  // a string formatted as described
  var tideDate = tide.t;
  // useful elements of this date
  var tideMonth = tideDate.substring(5, 7);
  var tideDay = tideDate.substring(8, 10);
  var tideYear = tideDate.substring(0, 4);
  // the substring containing only the date, formatted YYYYMMDD
  var formattedDate = tideYear + tideMonth + tideDay;

  return formattedDate;
}

// given a TideObject, gets a string telling the type of tide ("high" or "low")
function getType(tide) {
  var NOAAType = tide.type;

  if (NOAAType == "H") {
    return "high";
  } else if (NOAAType == "L") {
    return "low";
  } else {
    return;
  }
}

// tells the time at which a TideObject will occur, formatted as a string
function getTime(tide) {
  var NOAADate = tide.t;
  var time = NOAADate.substring(11, 16);

  return time;
}

// places the first four tides into div with the "tides" id
// where tide is a TideObject and index is a number, 1-4, representing which
// tide to print
function placeOneTide(tide, index) {
  var tideDate = getNOAADate(tide);
  var indexString = index.toString();
  var prefix = "tide";
  var tideElement = document.getElementById(prefix.concat(indexString));
  if (tideDate == today) {
    tideElement.innerHTML = "Today, a " + getType(tide) + " tide will occur at " + getTime(tide) + ".";
  } else if (tideDate == tomorrow) {
    tideElement.innerHTML = "Tomorrow, a " + getType(tide) + " tide will occur at " + getTime(tide) + ".";
  } else {
    return;
  }
  return;
}

// places the first four tides at their respective positions on the webpage
// data is an array of TideObjects
xhr.onreadystatechange = function() {
  if (this.readyState == 4) {
    rawTideData = this.response.predictions;
    console.log(rawTideData);
    //tideArray = JSON.parse(rawTideData);

    for (i = 0; i < 4; i++) {
      placeOneTide(rawTideData[i], i + 1)
    }
  }
};

xhr.send();
