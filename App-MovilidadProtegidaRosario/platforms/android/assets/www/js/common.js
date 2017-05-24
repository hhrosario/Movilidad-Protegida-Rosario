// Initialize your app
var myApp = new Framework7({
    modalTitle: 'Movilidad Protegida Rosario',
    fastClicks: true,
    reloadPages: false,
    init: false,
    swipeBackPage: false,
    //swipePanel: 'left',
    material: true
});

var $$ = Dom7;
var xhReq = new XMLHttpRequest();
var TIME_OUT = 12000;
var carTypeList;

// Determina si la plataforma en la cual estoy corriendo la app es browser o mobile
var isMobilePlatform = false;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});


jQuery(document).ready(function ()
{		
    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i))
	{
    	isMobilePlatform = true;
	}
	
	xhReq.open("GET", "pages/page-check-car.html", false);
	xhReq.send(null);
	document.getElementById("page-check-car").innerHTML=xhReq.responseText;
	
	xhReq.open("GET", "pages/page-about.html", false);
	xhReq.send(null);
	document.getElementById("page-about").innerHTML=xhReq.responseText;
	

	$.getJSON('json/car-type.json', function(data){
		carTypeList = data;
	});

    setCommonLabels();
    //activateStateItemMenu('page-check-car');
    myApp.init();
});


function setCommonLabels()
{
	$('#lblTitleApp').text('Movilidad Protegida Rosario');   
	$('#lblMnuCapture, #lblHeaderCapture').text('Movilidad Protegida Rosario'); 
	$('#lblMnuAbout, #lblHeaderAbout').text('Información ...'); 
}


//#################################################################################################################
//########################################          PHONE-GAP          ############################################
//#################################################################################################################

// Attach an event listener - This is an event that fires when PhoneGap is fully loaded
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady()
{	
	// Attach an event listener - This is an event that fires when the user presses the device's back button
	document.addEventListener("backbutton", onBackKeyDown, false);
	
    // Hide Splash Screen when Phonegap Library is ready
	setTimeout(function(){ navigator.splashscreen.hide(); }, 1000);
}


function existInternetConnection()
{
	try
	{
		var networkState = navigator.connection.type;
		return (networkState != Connection.NONE);
		//return true;
	}
	catch(e)
	{
	
	}
}


function onBackKeyDown() 
{
	var currentPage = myApp.getCurrentView().activePage.name;
	
	if ($('.modal.modal-in').length > 0) 
    {
		myApp.closeModal();
		return;
    }
	else if ($$('body').hasClass('with-panel-left-cover')) 
	{
		myApp.closePanel();
	}
	else if(currentPage == 'page-check-car')
    {
		navigator.app.exitApp();
    }
    else
    {
    	mainView.router.back();
    }
}
//#################################################################################################################
//########################################          FRAMEWORK7          ############################################
//#################################################################################################################


function showLoadSpinnerWS(message)
{
	if(message == undefined)
	{
		message = 'Procesando';
	}
	
	myApp.showPreloader(message);
}


function activateStateItemMenu(activePage)
{
	$('#ulListMenu').children().removeClass('activeStateMenu');
	
	switch (activePage)
	{
		case "page-check-car":
			$('#liCheckCarItemMenu').addClass('activeStateMenu');
			break;
		case "page-about":
			$('#liAboutItemMenu').addClass('activeStateMenu');
			break;
		default:
			break;
	}
}


function validateEmail(email) 
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function openPhoneCaller(phoneNumber)
{
	window.open('tel:' + phoneNumber, '_system');
}


function openBrowser(url)
{
	// If there is no internet connection
	if(!existInternetConnection())
	{
		showMessage(lblErrorConnectionText);
		return;
	}
	
	window.open(url, '_system');
}


function viewMap(lat, lon)
{
	window.open('http://maps.google.com/?q=' + lat + ',' + lon + '', '_system');
}


function showMessage(message)
{
	myApp.alert(message);
}


function focusOut()
{
	$(':focus').blur();
}


//Sound effect Phone
function soundEffectPhone(fileName)
{
    var path = getPathSoundEffect(fileName);
	var snd = new Media(path, function()
	{
	    this.release();
	});
	snd.play();
}


function getPathSoundEffect(fileName)
{
	var path = window.location.pathname;
	var pathArray = path.split('/');
	
	if(pathArray.length > 0)
	{
		return path.replace(pathArray[pathArray.length - 1], fileName);
	}
	else
	{
		return '';
	}
}


function showToastInternetConnectionError()
{
	var messageToast = myApp.toast('Por favor, revise su conexión a Internet y vuelva intentarlo...');
	messageToast.show(3000);
}


function openFacebook(urlFacebook)
{
	window.open('fb://facewebmodal/f?href=' + urlFacebook, '_system');
}


function vibrate()
{
	navigator.notification.vibrate(50);	
}

