function Slider() {
  var self = this;
  settings = {
    time: 10000,
    album: new Array(),
    index: 0,
    urlFetch: '/api/photos/aproved',
    tag: 'equipeamigos',
    idPhoto: ''
  };

  Slider.prototype.init = function() {
    setInterval(self.mostraProxima, settings.time);
  }
  
  // Função que pode ser utilizada para marcar se uma foto já foi vista usando
  // uma requisição a uma URL para isso
  Slider.prototype.marcarVisualizada = function() {
    $.ajaxSetup({
      async: true
    });
    $.post('/api/photos/viewered', {'idPhoto': settings.idPhoto});
  };

  Slider.prototype.mostraProxima = function() {
    if (settings.index == settings.album.length) {
      self.carregaFotos(settings.urlFetch, settings.tag);

      //Se não tiver fotos aprovadas mostre fotos padrão.
      if (settings.index == settings.album.length) {
        var urlPadrao = '';
        var tag = '';
        self.carregaFotos(url, tag);
      }
    }

    if (settings.index == 0) {
      $('#slider img:eq(0)').fadeIn(1000);
      settings.idPhoto = settings.album[settings.index].id;
    } else {
      var anterior = (settings.index - 1);
      $('#slider img:eq('+ anterior +')').fadeOut(1500);
      $('#slider img:eq('+ settings.index +')')
        .fadeIn(1500);
      settings.idPhoto = settings.album[settings.index].id;
    }
    self.marcarVisualizada(settings.idPhoto);
    settings.index++;
  };

  Slider.prototype.carregaFotos = function(url, tag) {
    var that = settings;
    $.ajaxSetup({
      async: false
    });

    $.getJSON(
      url, 
      {'tag': tag},
      function(data) {
        if (data.length > 0 ) {
         var i = 0;
          $('#slider').append("<figure id='slide'></figure>");
          for (i=0; i<data.length; i++) {
            $('#slide').append(
              "<img class='center' src="+data[i].link+
              " title="+data[i].owner+"/>"  
            );
            that.album.push(data[i]);
          }
        }
      }
    );
  }
};
