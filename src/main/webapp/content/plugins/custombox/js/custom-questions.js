$('.next').click(function(){
    
  var nextId = $(this).parents('.tab-pane').next().attr("id");
  $('a[href=\\#'+nextId+']').tab('show');
  
})

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  console.lo
  //update progress
  var step = $(e.target).data('step');
  var percent = (parseInt(step) / 5) * 100;
  
  $('.progress-bar').css({width: percent + '%'});
  $('.progress-bar').text("Question " + step + " of 5");
  
  //e.relatedTarget // previous tab
  
})

