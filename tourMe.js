function tourMe(){
  var $global = this;
  this.$arr = [];

  this.start = function($onetime){
    var $els = document.querySelectorAll('[data-tourme-seq]');
    console.log(this.getCookie('tourmecookie_id'));
    if( typeof $onetime != typeof undefined ){
      if( $onetime == true){
        if( this.getCookie('tourmecookie_id')){
          return;
        }else{
           this.setCookie('tourmecookie_id','one time only',365);
        }
      }else{
        this.setCookie('tourmecookie_id','one time only',-665);
      }
    }else{
      if( this.getCookie('tourmecookie_id')){
        return;
      }else{
         this.setCookie('tourmecookie_id','one time only',365);
         this.getCookie('tourmecookie_id');
      }
    }

    for( var $i = 0; $i < $els.length; $i++ ){
      //generate a unique id
      var $id = $i+'_'+this.generateUID();

      $els[$i].classList.add('tourMe'); //add class tourMe
      $els[$i].setAttribute('data-tourme-id',$id); // set id attribute for later reference

      var $anim = ( $els[$i].getAttribute('data-tourme-anim') == null ) ? false : $els[$i].getAttribute('data-tourme-anim');
      var $content = ( $els[$i].getAttribute('data-tourme-content') == null ) ? false : $els[$i].getAttribute('data-tourme-content');
      var $anchor = ( $els[$i].getAttribute('data-tourme-anchor') == null ) ? false : $els[$i].getAttribute('data-tourme-anchor');
      var $classes = ( $els[$i].getAttribute('data-tourme-classes') == null ) ? false : $els[$i].getAttribute('data-tourme-classes');
      var $top = ( $els[$i].getAttribute('data-tourme-top') == null ) ? false : $els[$i].getAttribute('data-tourme-top');
      var $left = ( $els[$i].getAttribute('data-tourme-left') == null ) ? false : $els[$i].getAttribute('data-tourme-left');
      //
      this.$arr.push({ 
        id : $id,
        seq : parseInt( $els[$i].getAttribute('data-tourme-seq') ),
        anim :  $anim,
        content : $content,
        anchor : $anchor,
        active : 0,
        classes : $classes,
        top : $top,
        left : $left
      });

      // sort array base on their sequence attributes
      this.$arr.sort( function(a,b){
          if (a.seq < b.seq)
            return -1;
          if (a.seq > b.seq)
            return 1;
          return 0;
      });

    }

    var $tourme_el_bg = document.createElement('div');
    $tourme_el_bg.setAttribute('id','tourme-bg');
    document.querySelector('body').appendChild($tourme_el_bg);

    var $tourme_content = document.createElement('div');
    $tourme_content.setAttribute('id','tourme-content');

    $data = JSON.stringify(this.$arr);
    $tourme_content.innerHTML = "<div class='content'></div><input type='hidden' value='"+$data+"' id='tourme-data'><div id='tourme-buttons'><a href='#' id='tourme-button-prev'>Prev</a><a href='#' id='tourme-button-next'>Next</a><a href='#' id='tourme-button-end'>End</a></div>";
    document.querySelector('body').appendChild($tourme_content);

    this.init();

  }
  // COOKIE
  this.setCookie = function(name,value,days) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
          var expires = "; expires=" + date.toGMTString();
      }
      else {
          var expires = "";
      }
      document.cookie = name + "=" + value + expires + "; path=/";
  }
  this.getCookie = function(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return false;
  }
  this.scrollToEl = function(el){
    const y = ( el.getBoundingClientRect().top + window.scrollY ) - 100;
    window.scroll({
      top: y,
      behavior: 'smooth'
    });
  }
  this.init = function(){
    
    document.querySelector('#tourme-button-end').addEventListener('click',function(e){
      e.preventDefault();
      if( document.querySelector('.tourme-pointer') !== null ){
         document.querySelector('.tourme-pointer').classList.remove('tourme-pointer');
      }
      var $tourme_bg_el = document.querySelector('#tourme-bg');
      $tourme_bg_el.parentNode.removeChild($tourme_bg_el);
      var $tourme_content_el = document.querySelector('#tourme-content');
      $tourme_content_el.parentNode.removeChild($tourme_content_el); 

    });
    document.querySelector('#tourme-button-prev').addEventListener('click',function(e){
       e.preventDefault();

      // show the first box
      var $data = JSON.parse(document.querySelector('#tourme-data').value);
      if( document.querySelector('.tourme-pointer') !== null ){
         document.querySelector('.tourme-pointer').classList.remove('tourme-pointer');
      }
      // get the current active on the data
      var $curr_active = $data.findIndex(x => x.active == 1 );

      if( $curr_active != 0 ){ // if not last child of the data array (-1)

        if( !$data[$curr_active-1].anchor ){
          document.querySelector('#tourme-content .content').innerHTML = ( $data[$curr_active-1].content );
        }else{
          document.querySelector('#tourme-content .content').innerHTML = document.querySelector($data[$curr_active-1].anchor).innerHTML;
        }        

        // add the classes if there are
        if( $data[$curr_active-1].classes ){
          document.querySelector('#tourme-content').className =  $data[$curr_active-1].classes;
        }else{
          document.querySelector('#tourme-content').className = '';
        }

        // add offset top of the element so it moves to its origin element
        // add top css
        if( !$data[$curr_active-1].top ){
          document.querySelector('#tourme-content').style.top = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).top+'px';
        }else{
          if( $data[$curr_active-1].top.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).top + $data[$curr_active-1].top )+'px';
          }else{
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).top - parseInt( $data[$curr_active-1].top.replace('-','') ) )+'px';
          }
        }
        // add left css
        if( !$data[$curr_active-1].left ){
          document.querySelector('#tourme-content').style.left = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).left+'px';
        }else{
          if( $data[$curr_active-1].left.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).left + $data[$curr_active-1].left )+'px';
          }else{
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).left - parseInt( $data[$curr_active-1].left.replace('-','') ) )+'px';
          }
        }

        document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]').classList.add('tourme-pointer');
        // scroll top the element first
        $global.scrollToEl(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]'));

        // set the current active element to 0
        $data[$curr_active].active = 0;
        // set the next data to 
        $old_data = JSON.parse(document.querySelector('#tourme-data').value);
        $old_data_active = $old_data.findIndex(x => x.active == 1 );

        if( $old_data_active != 0 ){
           $data[$curr_active-1].active = 1;
        }
        // reset the array
        document.querySelector('#tourme-data').value = JSON.stringify($data);

      }

    });
    document.querySelector('#tourme-button-next').addEventListener('click',function(e){
      e.preventDefault();

      // show the first box
      var $data = JSON.parse(document.querySelector('#tourme-data').value);
      if( document.querySelector('.tourme-pointer') !== null ){
         document.querySelector('.tourme-pointer').classList.remove('tourme-pointer');
      }
      // get the current active on the data
      var $curr_active = $data.findIndex(x => x.active == 1 );

      if( $curr_active != ( $data.length - 1 ) ){ // if not last child of the data array (-1)

        if( !$data[$curr_active+1].anchor ){
          document.querySelector('#tourme-content .content').innerHTML = ( $data[$curr_active+1].content );
        }else{
          document.querySelector('#tourme-content .content').innerHTML = document.querySelector($data[$curr_active+1].anchor).innerHTML;
        }

        // add the classes if there are
        if( $data[$curr_active+1].classes ){
          document.querySelector('#tourme-content').className = $data[$curr_active+1].classes;
        }else{
          document.querySelector('#tourme-content').className = '';
        }

        // add offset top of the element so it moves to its origin element
        // add top css
        if( !$data[$curr_active+1].top ){
          document.querySelector('#tourme-content').style.top = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).top+'px';
        }else{
          if( $data[$curr_active+1].top.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).top + $data[$curr_active+1].top )+'px';
          }else{
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).top - parseInt( $data[$curr_active+1].top.replace('-','') ) )+'px';
          }
        }
        // add left css
        if( !$data[$curr_active+1].left ){
          document.querySelector('#tourme-content').style.left = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).left+'px';
        }else{
          if( $data[$curr_active+1].left.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).left + $data[$curr_active+1].left )+'px';
          }else{
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).left - parseInt( $data[$curr_active+1].left.replace('-','') ) )+'px';
          }
        }

      document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]').classList.add('tourme-pointer');
        // scroll top the element first
        $global.scrollToEl(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]'));

        // set the current active element to 0
        $data[$curr_active].active = 0;
        // set the next data to 
        $old_data = JSON.parse(document.querySelector('#tourme-data').value);
        $old_data_active = $old_data.findIndex(x => x.active == 1 );

        if( $old_data_active != ( $old_data.length - 1) ){
           $data[$curr_active+1].active = 1;
        }
        // reset the array
        document.querySelector('#tourme-data').value = JSON.stringify($data);

      }else{
        var $tourme_bg_el = document.querySelector('#tourme-bg');
        $tourme_bg_el.parentNode.removeChild($tourme_bg_el);
        var $tourme_content_el = document.querySelector('#tourme-content');
        $tourme_content_el.parentNode.removeChild($tourme_content_el); 
      }
    });

    // show the first box
    var $data = JSON.parse(document.querySelector('#tourme-data').value);
    if( document.querySelector('.tourme-pointer') !== null ){
       document.querySelector('.tourme-pointer').classList.remove('tourme-pointer');
    }
    // add the classes if there are
    if( $data[0].classes ){
      document.querySelector('#tourme-content').className = $data[0].classes;
    }else{
      document.querySelector('#tourme-content').className = '';
    }

    // add offset top of the element so it moves to its origin element
    // add top css
    if( !$data[0].top ){
      document.querySelector('#tourme-content').style.top = this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).top+'px';
    }else{
      if( $data[0].top.indexOf('-') == -1){
        document.querySelector('#tourme-content').style.top = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).top + $data[0].top )+'px';
      }else{
        document.querySelector('#tourme-content').style.top = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).top - parseInt( $data[0].top.replace('-','') ) )+'px';
      }
    }
    // add left css
    if( !$data[0].left ){
      document.querySelector('#tourme-content').style.left = this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).left+'px';
    }else{
      if( data[0].left.indexOf('-') == -1){
        document.querySelector('#tourme-content').style.left = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).left + $data[0].left )+'px';
      }else{
        document.querySelector('#tourme-content').style.left = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).left - parseInt( $data[0].left.replace('-','') ) )+'px';
      }
    }
    document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]').classList.add('tourme-pointer');
    // scroll top the element first
    this.scrollToEl(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]'));


    if( !$data[0].anchor ){
      document.querySelector('#tourme-content .content').innerHTML = ( $data[0].content );
    }else{
      document.querySelector('#tourme-content .content').innerHTML = document.querySelector($data[0].anchor).innerHTML;
    }

    // show the tourme content
    document.querySelector('#tourme-bg').style.display = 'block';
    document.querySelector('#tourme-content').style.display = 'block';

    // set the first data to active
    $data[0].active = 1;

    // reset the array
    document.querySelector('#tourme-data').value = JSON.stringify($data);


  }

  this.getOffset = function(el) {

    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  this.generateUID = function(){
    var $length = 8;
    var $timestamp = +new Date;
   

    var ts = $timestamp.toString();
    var parts = ts.split( "" ).reverse();
    var id = "";
     
    for( var i = 0; i < $length; ++i ) {
      var index = Math.floor( Math.random() * ( ( ( parts.length - 1 ) - 0 ) + 1 ) ) + 0;
      id += parts[index];  
    }
     
    return id;
  } // end of generateID
} // end of tourme function

  