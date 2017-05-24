var carTypeSelected = '';

jQuery(document).ready(function ()
{
	$('#txt-patent').bind('keyup blur',function()
	{
		$(this).val($(this).val().toUpperCase());
   	});
	
	// Agrego handler para el keypress de la Búsqueda
	$("#txt-patent").on("keypress", function(e)
	{               
        if(e.keyCode == 13)
        {
        	searchPatent();
        }
	 });
});


myApp.onPageInit('page-check-car', function (page)
{
	 
});


myApp.onPageBeforeAnimation('page-check-car', function (page)
{
	//activateStateItemMenu(myApp.getCurrentView().activePage.name);
});


function searchPatent()
{
	var messageValidate = validatePatent();
			
	if(messageValidate.trim() != '')
	{
		focusOut();
		showMessage(messageValidate);
		return;
	}
			
	getPatentInformationWS();
}


function validatePatent()
{
	var strBuilderValidateSearch = [];
	strBuilderValidateSearch.push('<div>');
	//strBuilderValidateSearch.push('<ul>');
	var mustShowMessage = false;
	
	// TIPO DE VEHÍCULO
	if(carTypeSelected == '')
	{
		strBuilderValidateSearch.push('<li>' + 'Debe seleccionar un Tipo de Vehículo' + '</li>');
		mustShowMessage = true;
	}
	
	// PATENTE
	var patentToValidate = $('#txt-patent').val().trim();
	if (patentToValidate == "")
	{		
		strBuilderValidateSearch.push('<li>' + 'Debe ingresar una patente' + '</li>');
		mustShowMessage = true;
	}
	else
	{
		// Expresión regular para el formato de patente: ABC123
		var regularExpressionFormat_1 = /^[a-zA-Z]{3}\d{3}$/;
		
		// Expresión regular para el formato de patente: AB123CD
		var regularExpressionFormat_2 = /^[a-zA-Z]{2}\d{3}[a-zA-Z]{2}$/;
		
		if(	(patentToValidate.length == 6 && !regularExpressionFormat_1.test(patentToValidate)) ||
			(patentToValidate.length == 7 && !regularExpressionFormat_2.test(patentToValidate)) ||
			(patentToValidate.length < 6 || patentToValidate.length > 7))
		{
			strBuilderValidateSearch.push('<li>' + 'El formato de la Patente es incorrecto. Debe respetar el siguiente formato: <br/><b>ABC123</b> <br> <b>AB123CD</b>' + '</li>');
			mustShowMessage = true;
		}
	}
	
	//strBuilderValidateSearch.push('</ul>');
	strBuilderValidateSearch.push('</div>');
	
	if(mustShowMessage)
	{
		return strBuilderValidateSearch.join("")
	}
	else
	{
		return '';
	}
}


function getPatentInformationWS()
{
	var urlWebService = '';
	
	// CAR TYPE
	// 1: Taxi --- 2:Remis --- 3: Transporte Escolar --- 3: Transporte Especial
	// 4: Transporte Especial --- 5: Transporte Accesible
	switch(carTypeSelected) 
	{
	    case '1':
	    	urlWebService = 'http://datos.rosario.gob.ar/api/action/datastore/search.jsonp?resource_id=4f89b313-35fe-4e08-be0a-831bca834c7e&filters[dominio]=' + $('#txt-patent').val().trim() + '&limit=1'
	        break;
	    case '2':
	    	urlWebService = 'http://datos.rosario.gob.ar/api/action/datastore/search.jsonp?resource_id=7865c1a9-8310-440a-bb2b-c3a2ad5d9b25&filters[dominio]=' + $('#txt-patent').val().trim() + '&limit=1'
	        break;
	    case '3':
	    	urlWebService = 'http://datos.rosario.gob.ar/api/action/datastore/search.jsonp?resource_id=3bbadf02-dfb0-45b7-9de5-1d56964a747a&filters[dominio]=' + $('#txt-patent').val().trim() + '&limit=1'
	        break;
	    case '4':
	    	urlWebService = 'http://datos.rosario.gob.ar/api/action/datastore/search.jsonp?resource_id=eee58184-c79e-4467-b7c6-053526c76aa6&filters[dominio]=' + $('#txt-patent').val().trim() + '&limit=1'
	    	break;
	    case '5':
	    	urlWebService = 'http://datos.rosario.gob.ar/api/action/datastore/search.jsonp?resource_id=76dd1ce3-07dd-4973-a9a4-a9e1514ee97d&filters[dominio]=' + $('#txt-patent').val().trim() + '&limit=1'
	    break;	    	
	}
	
	myApp.showPreloader();
	
	$.ajax({
		url: urlWebService,
        type: 'GET',	
        dataType: 'jsonp',
        timeout: TIME_OUT,
			success: function(response)
		{
			if(response.result.records.length == 0)
			{
				buildPatentInformation('');
			}
			else
			{
				buildPatentInformation(response);
			}
			
			myApp.hidePreloader();
		},
		error: function (data, status, error)
		{
			myApp.hidePreloader();
	        showToastInternetConnectionError();
	    }
	});
}


function buildPatentInformation(carResult)
{
	var strBuilderPatentInformationResult = [];
	$('#div-info-detail-container').hide();
	$('#div-container-information-result').html('');
	$('#div-clain-147-container').hide();
	strBuilderPatentInformationResult.push('<ul>');
	
	if(carResult != '')
	{
		// HABILITADO
		strBuilderPatentInformationResult.push('<li class="item-content">');
		strBuilderPatentInformationResult.push('<div class="item-inner">');
		strBuilderPatentInformationResult.push('<table>');
		strBuilderPatentInformationResult.push('<tr>');
		strBuilderPatentInformationResult.push('<td>');
		strBuilderPatentInformationResult.push('<img src="img/icon-success.png" class="img-success animated infinite pulse">');
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('<td>');
		strBuilderPatentInformationResult.push('<div id="div-enabled-car-label" class="animated infinite flash">HABILITADO</div>');
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('</tr>');
		strBuilderPatentInformationResult.push('</table>');
		strBuilderPatentInformationResult.push('</div>');
		strBuilderPatentInformationResult.push('</li>');
		
		
		// NOMBRE Y APELLIDO
		strBuilderPatentInformationResult.push('<li class="item-content">');
		strBuilderPatentInformationResult.push('<div class="item-inner">  ');
		strBuilderPatentInformationResult.push('<table>');
		strBuilderPatentInformationResult.push('<tr>');
		strBuilderPatentInformationResult.push('<td>');
		strBuilderPatentInformationResult.push('<div class="item-after patent-search-results-label">' + 'Titular' + '</div>');
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('</tr>');
		strBuilderPatentInformationResult.push('<tr>');;
		strBuilderPatentInformationResult.push('<td>');
		
		if(carTypeSelected == '3' || carTypeSelected == '4' || carTypeSelected == '5')
		{
			// Nombres de Campos en Dataset en Mayuscula
			strBuilderPatentInformationResult.push('<div class="item-title patent-search-results-value">' + 
												carResult.result.records[0].Nombre + ' ' + 
												carResult.result.records[0].Apellido + '</div>');
		}
		else
		{
			strBuilderPatentInformationResult.push('<div class="item-title patent-search-results-value">' + 
												carResult.result.records[0].nombre + ' ' + 
												carResult.result.records[0].apellido + '</div>');
		}
		
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('</tr>');
		strBuilderPatentInformationResult.push('</table>');
		strBuilderPatentInformationResult.push('</div>');
		strBuilderPatentInformationResult.push('</li>');
		
		// PATENTE
		strBuilderPatentInformationResult.push('<li class="item-content">');
		strBuilderPatentInformationResult.push('<div class="item-inner">  ');
		strBuilderPatentInformationResult.push('<table>');
		strBuilderPatentInformationResult.push('<tr>');
		strBuilderPatentInformationResult.push('<td>');
		strBuilderPatentInformationResult.push('<div class="item-after patent-search-results-label">' + 'Marca y Modelo' + '</div>');
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('</tr>');
		strBuilderPatentInformationResult.push('<tr>');;
		strBuilderPatentInformationResult.push('<td>');
		strBuilderPatentInformationResult.push('<div class="item-title patent-search-results-value">' + 
												carResult.result.records[0].marcaymodelo + '</div>');
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('</tr>');
		strBuilderPatentInformationResult.push('</table>');
		strBuilderPatentInformationResult.push('</div>');
		strBuilderPatentInformationResult.push('</li>');
		
		soundEffectPhone('enabled.mp3');
	}
	else
	{
		// DESHABILITADO
		strBuilderPatentInformationResult.push('<li class="item-content">');
		strBuilderPatentInformationResult.push('<div class="item-inner">');
		strBuilderPatentInformationResult.push('<table>');
		strBuilderPatentInformationResult.push('<tr>');
		strBuilderPatentInformationResult.push('<td>');
		strBuilderPatentInformationResult.push('<img src="img/icon-error.png" class="img-error animated infinite pulse">');
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('<td>');
		strBuilderPatentInformationResult.push('<div id="div-disabled-car-label" class="animated infinite flash">DESHABILITADO</div>');
		strBuilderPatentInformationResult.push('</td>');
		strBuilderPatentInformationResult.push('</tr>');
		strBuilderPatentInformationResult.push('</table>');
		strBuilderPatentInformationResult.push('</div>');
		strBuilderPatentInformationResult.push('</li>');
		
		$('#div-clain-147-container').show();
		setTimeout(function(){ soundEffectPhone('disabled.mp3'); }, 300);
	}
	
    $('#div-container-information-result').append(strBuilderPatentInformationResult.join(""));
    focusOut();
}


function openModalCarType()
{
    var strBuilderCarTypeList = [];
    strBuilderCarTypeList.push('<div id="div-car-type-container-modal" class="list-block media-list">');
    strBuilderCarTypeList.push('<ul>');

    $.each(carTypeList, function (i, item)
    {
    	strBuilderCarTypeList.push('<li>');
    	strBuilderCarTypeList.push('<a onclick="selectCarType(\'' + item.idCarType + '\', \'' + 
    								item.descripcionCarType + '\', \'' + item.imgUrlBlue + '\')" href="#" class="item-link item-content">');
    	strBuilderCarTypeList.push('<div class="item-media item-icon-car-type-container">');
    	//strBuilderCarTypeList.push('<i class="fa fa-car icon-item-list"></i>');
    	strBuilderCarTypeList.push('<img src="' + item.imgUrl + '" class="icon-car-type-item-list">');
    	strBuilderCarTypeList.push('</div>');
    	strBuilderCarTypeList.push('<div class="item-inner div-item-list-car-type">');
    	strBuilderCarTypeList.push('<div class="item-title">' + item.descripcionCarType + '</div>');
    	strBuilderCarTypeList.push('<div class="item-after div-more-details">' + item.moreDetails + '</div>');
    	strBuilderCarTypeList.push('</div>');
    	strBuilderCarTypeList.push('</a>');
    	strBuilderCarTypeList.push('</li>');    	
    });
    
    strBuilderCarTypeList.push('</ul>');
    strBuilderCarTypeList.push('</div>');
	
	myApp.modal({
	    title:  '<div><span id="spn-title-modal">Tipo de Vehículo</span><i class="fa fa-times" id="icon-close-car-type" onClick="myApp.closeModal();"></i></div>',
	    
	    text: 	strBuilderCarTypeList.join("")
	})
}


function selectCarType(id, description, urlImageBlue)
{
	carTypeSelected = id;
	$('#div-car-type').text(description);
	$('#div-car-type').css('color', 'black');
	$('#icon-car-type-selected').attr("src", urlImageBlue);
	//$('#icon-car-type-selected').addClass( "animated infinite flash" );
	
	myApp.closeModal();
}
