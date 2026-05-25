ipelem = document.getElementById("yourip");
locelem = document.getElementById("yourloc");
gpuelem = document.getElementById("yourgpu");
cpuelem = document.getElementById("yourcpu");
oselem = document.getElementById("youros");
osverelem = document.getElementById("yourosver");
browserelem = document.getElementById("yourbrowser");
browserverelem = document.getElementById("yourbrowserver");
browsermajorverelem = document.getElementById("browserMajorVersion");
cookiesenabledelem = document.getElementById("cookiesEnabled?");
ismobileelem = document.getElementById("ismobile");
screensizeelem = document.getElementById("screensize");

function success(position) {
  locelem.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

function error(err) {

  switch(err.code) {
    case err.PERMISSION_DENIED:
      locelem.innerHTML = "Location denied by user";
      break;
    case err.POSITION_UNAVAILABLE:
      locelem.innerHTML = "Location unavailable";
      break;
    case err.TIMEOUT:
      locelem.innerHTML = "Location request timed out";
      break;
    default:
      locelem.innerHTML = "Unknown error: " + err.message;
  }
}

function getLocation(retries=3){
    const geoOptions = {
        enableHighAccuracy: false, 
        timeout: 10000,            
        maximumAge: 60000          
    };

    if (!navigator.geolocation){
        locelem.innerHTML = "Geolocation not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(success, 
        (err)=>{
            if (retries > 0 && err.code === err.POSITION_UNAVAILABLE){
                locelem.innerHTML = `Position Unavailable, Retries Left: ${retries}`
                setTimeout(()=> getLocation(retries-1), 2000);
            }else{
                switch(err.code) {
                    case err.PERMISSION_DENIED:
                    locelem.innerHTML = "Location denied by user";
                    break;
                    case err.POSITION_UNAVAILABLE:
                    locelem.innerHTML = "Location unavailable";
                    break;
                    case err.TIMEOUT:
                    locelem.innerHTML = "Location request timed out";
                    break;
                    default:
                    locelem.innerHTML = "Unknown error: " + err.message;
                }
            }
        },
        geoOptions);
}

async function getData(){
    //getip
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ipelem.innerHTML = `IP: ${data.ip}`;

    //get loc
    

    getLocation();

    //get gpu
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl){
        gpuelem.innerHTML = "webGL not supported";
    }else{
        gpuelem.innerHTML = `gpu: ${gl.getParameter(gl.RENDERER)}`;
    }

    //get client data
    var unknown = '-';

    /**
    * JavaScript Client Detection
    * (C) viazenetti GmbH (Christian Ludwig)
    */
    var screenSize = '';
    if (screen.width) {
        width = (screen.width) ? screen.width : '';
        height = (screen.height) ? screen.height : '';
        screenSize += '' + width + " x " + height;
    }

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(nVer);
    var nameOffset, verOffset, ix;

    //yandex browser
    if ((verOffset = nAgt.indexOf("YaBrowser")) != -1){
        browser = 'Yandex';
        version = nAgt.substring(verOffset + 10);
    }
    //samsung browser
    else if ((verOffset = nAgt.indexOf('SamsungBrowser')) != -1){
        browser = 'Samsung';
        version = nAgt.substring(verOffset + 15);
    }
    //uc browser
    else if ((verOffset = nAgt.indexOf('UCBrowser')) != -1){
        browser = "UC Browser";
        version = nAgt.substring(verOffset + 10);
    }
    //opera next
    else if ((verOffset = nAgt.indexOf('OPR')) != -1){
        browser = 'Opera Next';
        version = nAgt.substring(verOffset + 4);
    }
    //opera
    else if ((verOffset = nAgt.indexOf('Opera')) != -1){
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1){
            version = nAgt.substring(verOffset + 8);
        }
    }
    //legacy edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1){
        browser = 'Microsoft Legacy Edge';
        version = nAgt.substring(verOffset + 4);
    }
    //edge chromium
    else if ((verOffset = nAgt.indexOf("Edg")) != -1){
        browser = "Microsoft Edge";
        version = nAgt.substring(verOffset + 4);
    }
    //MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1){
        browser = "Microsoft Internet Explorer";
        version = nAgt.substring(verOffset + 5);
    }
    //Chrome
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1){
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    //Safari
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1){
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    //MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1){
        browser = 'Microsoft Internet Explorer 11+';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    //other broswers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))){
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()){
            browser = navigator.appName;
        }
    }
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(nVer);
        majorVersion = parseInt(nVer, 10);
    }

    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // cookie
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
    }
    
    // system
    var os = unknown;
    var clientStrings = [
        {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 3.11', r:/Win16/},
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Chrome OS', r:/CrOS/},
        {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
    	if (osVersion == 10 && navigator.userAgentData) {
            navigator.userAgentData.getHighEntropyValues(["platformVersion"])
            	.then((ua) => window.jscd.osVersion = (parseInt(ua.platformVersion.split('.')[0]) < 13 ? 10 : 11));
        }
        os = 'Windows';
    }

    switch (os) {
        case 'Mac OS':
        case 'Mac OS X':
        case 'Android':
            osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(nAgt)[1];
            break;

        case 'iOS':
            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
            break;
    }

    oselem.innerHTML = `OS: ${os}`;
    osverelem.innerHTML = `OS Ver: ${osVersion}`;
    ismobileelem.innerHTML = `Mobile: ${mobile}`;
    cookiesenabledelem.innerHTML = `Cookies: ${cookieEnabled}`;
    browserelem.innerHTML = `Browser: ${browser}`;
    browserverelem.innerHTML = `Browser Ver: ${version}`;
    browsermajorverelem.innerHTML = `Browser Major Ver: ${majorVersion}`;
    screensizeelem.innerHTML = `Screen Size: ${screenSize}`;
}   

getData();
