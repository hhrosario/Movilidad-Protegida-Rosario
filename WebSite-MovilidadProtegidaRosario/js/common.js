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
    myApp.init();
});


function setCommonLabels()
{
    $('#lblTitleApp').text('Movilidad Protegida Rosario');
    $('#lblMnuCapture, #lblHeaderCapture').text('Movilidad Protegida Rosario');
	$('#lblMnuAbout, #lblHeaderAbout').text('Acerca de ...'); 
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


function validateEmail(email) 
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function openBrowser(url)
{
    window.open(url, '_system');
}


function showMessage(message)
{
	myApp.alert(message);
}


function focusOut()
{
	$(':focus').blur();
}


function showToastInternetConnectionError()
{
	var messageToast = myApp.toast('Por favor, revise su conexión a Internet y vuelva intentarlo...');
	messageToast.show(3000);
}


function openFacebook(urlFacebook)
{
    window.open(urlFacebook, '_system');
}




