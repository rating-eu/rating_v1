

$(document).ready( function (){

	// Precompila i campi degli asset in base al tipo di azienda selezionata
	var radioTypeCompany = $('input[type=radio][name=radioTypeCompany]');
   	$(radioTypeCompany).change(function() {
        $("#1, #3").addClass("active");
        if (radioTypeCompany[0].checked) {
            $("#checkboxAsset0").prop("checked", false);
        	$("#checkboxAsset1").prop("checked", false);
        	$("#checkboxAsset2").prop("checked", true);
        	$("#checkboxAsset3").prop("checked", false);
        }
        else if (radioTypeCompany[1].checked) {
        	$("#checkboxAsset0").prop("checked", false);
        	$("#checkboxAsset1").prop("checked", true);
        	$("#checkboxAsset2").prop("checked", false);
        	$("#checkboxAsset3").prop("checked", false);
        }
        else if (radioTypeCompany[2].checked) {
        	$("#checkboxAsset0").prop("checked", true);
        	$("#checkboxAsset1").prop("checked", true);
        	$("#checkboxAsset2").prop("checked", false);
        	$("#checkboxAsset3").prop("checked", true);
        }
    });

    // Precompila la matrice di threat agent e motivations
    $(function() {
       for (var i = 0; i < 32; i++) {
           if (i % 2 != 0) {
               $('#radioQuestion' + i).prop("checked", true);
           }
           if (i == 20 || i == 22) {
               $('#radioQuestion' + i).prop("checked", true);
           }
       }
    });
    
    // Precompila la matrice di threat agent e motivations
    var radioThreatAgent = $('#checkboxQuestion31, #checkboxQuestion35, #checkboxQuestion32, #checkboxQuestion38, #checkboxQuestion36, #checkboxQuestion68, #checkboxQuestion66, #checkboxQuestion61');
    $(function() {
       radioThreatAgent.prop("checked", true);
    });

    //Precompila le domande del self assessment del ciso
    var questionCiso = $('input[name=radioSACiso5], input[name=radioSACiso9], input[name=radioSACiso14], input[name=radioSACiso19], input[name=radioSACiso25]');
    $(function() {
        questionCiso.prop("checked", true);
    });

    function removeClass(colorBotton) {
        if ($('button.btn.center-block').hasClass(colorBotton)) {
            $('button.btn.center-block').removeClass(colorBotton);
        }
    }

    //set the color (likelihood) to the attack strategy
    function setColor(id, likelihood) {
        if (likelihood == 5) {
            removeClass('btn-default')
            $('#' + id).addClass('btn-danger')
        }
        else if (likelihood == 4) {
            removeClass('btn-default')
            $('#' + id).addClass('btn-mediumHigh')
        }
        else if (likelihood == 3) {
            removeClass('btn-default')
            $('#' + id).addClass('btn-warning')
        }
        else if (likelihood == 2) {
            removeClass('btn-default')
            $('#' + id).addClass('btn-lowMedium')
        }
        else if (likelihood == 1) {
            removeClass('btn-default')
            $('#' + id).addClass('btn-success')
        }
    }

    function resetAll() {
        removeClass('btn-success')
        removeClass('btn-lowMedium')
        removeClass('btn-warning')
        removeClass('btn-mediumHigh')
        removeClass('btn-danger')
        $('button.btn.center-block').addClass('btn-default')
    }

    function resetSpecific(id) {
        $(id).removeClass('btn-success')
        $(id).removeClass('btn-lowMedium')
        $(id).removeClass('btn-warning')
        $(id).removeClass('btn-mediumHigh')
        $(id).removeClass('btn-danger')
    }

    function attackPlan(threatAgent) {
        for (var i = 0; i < sqlAttack[0].values.length; i++) {
            if (sqlAttack[0].values[i][1] <= threatAgent) {
                setColor(sqlAttack[0].values[i][3], sqlAttack[0].values[i][2])
            }
        }
    }

    $('#attackPlanList').change(function() {
        if ($(this).val() == '1') {
            attackPlan(3);
        }
        else if ($(this).val() == '2') {
            resetAll()
            attackPlan(1);
        }
        //else if ($(this).val() == '3') {
        //    resetAll()
        //    attackPlan(2);
        //}
        else if ($(this).val() == '100') {
            resetAll()
        }
    });

    function changeColorSA(questionID, nameID, idBlock) {
        $(questionID).change(function() {
            if ($('#' + nameID + ':checked').val() == '1') {
                resetSpecific(idBlock)
                $(idBlock).addClass('btn-danger')
            }
            else if ($('#' + nameID + ':checked').val() == '2') {
                resetSpecific(idBlock)
                $(idBlock).addClass('btn-mediumHigh')
            }
            else if ($('#' + nameID + ':checked').val() == '3') {
                resetSpecific(idBlock)
                $(idBlock).addClass('btn-warning')
            }
            else if ($('#' + nameID + ':checked').val() == '4') {
                resetSpecific(idBlock)
                $(idBlock).addClass('btn-lowMedium')
            }
            else if ($('#' + nameID + ':checked').val() == '5') {
                resetSpecific(idBlock)
                $(idBlock).addClass('btn-success')
            }
        });
    }

    changeColorSA('#questionSA', 'radioSA0', '#abc0')
    changeColorSA('#questionSA', 'radioSA1', '#abc1')
    changeColorSA('#questionSA', 'radioSA2', '#abc2')
    changeColorSA('#questionSA', 'radioSA3', '#abc6')
    changeColorSA('#questionSA', 'radioSA4', '#abc10')

    changeColorSA('#questionSACiso', 'radioSACiso0', '#abc0')
    changeColorSA('#questionSACiso', 'radioSACiso1', '#abc1')
    changeColorSA('#questionSACiso', 'radioSACiso2', '#abc2')
    changeColorSA('#questionSACiso', 'radioSACiso3', '#abc6')
    changeColorSA('#questionSACiso', 'radioSACiso4', '#abc10')

    


    // circle final likelihood
    if (document.getElementById("cicleProb")) {
        var bar = new ProgressBar.Circle(cicleProb, {
        color: '#111',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 3000,
        text: {
          autoStyleContainer: false
        },
        from: { color: '#0F0', width: 1 },
        to: { color: '#F00', width: 4 },
        // Set default step function for all animate calls
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0) {
              circle.setText('');
            } else {
              circle.setText(value + '%');
            }

          }
        });
        bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        bar.text.style.fontSize = '11rem';

        bar.animate(0.65);  // Number from 0.0 to 1.0
    }

    // 

    function semiCircleElement(idElement, valueElem) {
        var bar = new ProgressBar.SemiCircle(idElement, {
          strokeWidth: 6,
          color: '#FFEA82',
          trailColor: '#eee',
          trailWidth: 1,
          easing: 'easeInOut',
          duration: 1400,
          svgStyle: null,
          text: {
            value: '',
            alignToBottom: false
          },
          from: {color: '#0F0'},
          to: {color: '#F00'},
          // Set default step function for all animate calls
          step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
            var value = Math.round(bar.value() * 100);
            if (value === 0) {
              bar.setText('');
            } else {
              bar.setText(value + ' %');
            }

            bar.text.style.color = state.color;
          }
        });
        bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        bar.text.style.fontSize = '2rem';

        bar.animate(valueElem);  // Number from 0.0 to 1.0
    }

    if (document.getElementById("potentialContainerIT")) {
        semiCircleElement(potentialContainerIT, 0.25);
    }

    if (document.getElementById("potentialTAIT")) {
        semiCircleElement(potentialTAIT, 0.05);
    }

    if (document.getElementById("potentialTAPD")) {
        semiCircleElement(potentialTAPD, 0.10);
    }

    if (document.getElementById("potentialContainerBrand")) {
        semiCircleElement(potentialContainerBrand, 0.90);
    }

    if (document.getElementById("potentialTABrand")) {
        semiCircleElement(potentialTABrand, 0.55);
    }

    if (document.getElementById("potentialTAS")) {
        semiCircleElement(potentialTAS, 0.65);
    }


});