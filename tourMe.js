function tourMe(){
  var $global = this;
  this.$arr = [];

  this.start = function($options){
    var $duration = 0;
    var $arrow = false;

    if( typeof $options != 'undefined'){
      $duration = $options.repeat;
      $arrow = ( screen.width > 768 ) ? $options.arrow : false;
    }

    var $els = document.querySelectorAll('[data-tourme-seq]');

    if( $duration == 0){
      this.setCookie('tourmecookie_id',0,-665);
    }else{
      // get the tourme cookie first
      var $tourme_ck = this.getCookie('tourmecookie_id');
      if( !$tourme_ck ){ // if not found then reset it since an iteration value was given          
        this.setCookie('tourmecookie_id',JSON.stringify([parseInt($duration)-1,$duration]),365);
      }else{ // if there is then check the duration value and compare to the cookie
        $ck_val = JSON.parse($tourme_ck)
        if( parseInt( $ck_val[0] ) == 0 ){
          return; // if same to duration then it means, iteration count must be reset, or if its 0 already then return, don't run
        }else{
          if( parseInt($ck_val[1]) != parseInt($duration) ){
            this.setCookie('tourmecookie_id',JSON.stringify([parseInt($duration)-1,$duration]),365);
          }else{
            var $tourme_val = parseInt( $ck_val[0] ) - 1; // minus 1
            // update the value tourme cookie value
            this.setCookie('tourmecookie_id',JSON.stringify([$tourme_val,$duration]),365);
          }
          
        }
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
      var $arrow_pos = ( $els[$i].getAttribute('data-tourme-arrow') == null ) ? false : $els[$i].getAttribute('data-tourme-arrow');

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
        left : $left,
        arrow_pos : $arrow_pos
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
    
    if( $arrow ){
      $tourme_content.classList.add('with-arrow');
      $tourme_content.innerHTML = "<div class='tourme-content-wrapper'><div class='tourme-arrow'></div><div class='tourme-content-container'><div class='content'></div><input type='hidden' value='"+$data+"' id='tourme-data'><div id='tourme-buttons'><a href='#' id='tourme-button-prev'>Prev</a><a href='#' id='tourme-button-next'>Next</a><a href='#' id='tourme-button-end'>Skip</a></div></div></div>";
    }else{
      $tourme_content.innerHTML = "<div class='tourme-content-wrapper'><div class='tourme-content-container'><div class='content'></div><input type='hidden' value='"+$data+"' id='tourme-data'><div id='tourme-buttons'><a href='#' id='tourme-button-prev'>Prev</a><a href='#' id='tourme-button-next'>Next</a><a href='#' id='tourme-button-end'>Skip</a></div></div></div>";
    }
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

        if( document.querySelector('#tourme-content').classList.contains('with-arrow') ){
          var $arrow_pos = $data[$curr_active-1].arrow_pos;
          if( $arrow_pos ){
            if( $arrow_pos == 'arrow-left' || $arrow_pos == 'arrow-right'){
              var $tourme_h = document.querySelector('#tourme-content .tourme-content-container').offsetHeight;
              document.querySelector('#tourme-content .tourme-arrow').style.top = (  $tourme_h / 2 ) - 20;
            }else{
              document.querySelector('#tourme-content .tourme-arrow').removeAttribute('style');
            }
            document.querySelector('#tourme-content').classList.remove('arrow-up','arrow-down','arrow-left','arrow-right');
            document.querySelector('#tourme-content').classList.add($arrow_pos);
          }
        }

        var $old_classes =  document.querySelector('#tourme-content').className;
        // add the classes if there are
        if( $data[$curr_active-1].classes ){
          document.querySelector('#tourme-content').className =  $old_classes+' '+$data[$curr_active-1].classes;
        }else{
          document.querySelector('#tourme-content').className = $old_classes;
        }

        // add offset top of the element so it moves to its origin element
        // add top css
        if( !$data[$curr_active-1].top || screen.width < 768 ){
          document.querySelector('#tourme-content').style.top = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).top + 'px';
        }else{
          if( $data[$curr_active-1].top.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).top + parseInt(  $data[$curr_active-1].top ) ) + 'px';
          }else{
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).top - parseInt( $data[$curr_active-1].top.replace('-','') ) ) + 'px';
          }
        }
        // add left css
        if( !$data[$curr_active-1].left || screen.width < 768 ){
          document.querySelector('#tourme-content').style.left = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).left + 'px';
        }else{
          if( $data[$curr_active-1].left.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).left + parseInt(  $data[$curr_active-1].left ) ) + 'px';
          }else{
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).left - parseInt( $data[$curr_active-1].left.replace('-','') ) )  + 'px';
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

        if( document.querySelector('#tourme-content').classList.contains('with-arrow') ){
          var $arrow_pos = $data[$curr_active+1].arrow_pos;
          if( $arrow_pos ){
            if( $arrow_pos == 'arrow-left' || $arrow_pos == 'arrow-right'){
              var $tourme_h = document.querySelector('#tourme-content .tourme-content-container').offsetHeight;
              document.querySelector('#tourme-content .tourme-arrow').style.top = (  $tourme_h / 2 ) - 20;
            }else{
              document.querySelector('#tourme-content .tourme-arrow').removeAttribute('style');
            }
            document.querySelector('#tourme-content').classList.remove('arrow-up','arrow-down','arrow-left','arrow-right');
            document.querySelector('#tourme-content').classList.add($arrow_pos);

          }
        }

        var $old_classes =  document.querySelector('#tourme-content').className;

        // add the classes if there are
        if( $data[$curr_active+1].classes ){
          document.querySelector('#tourme-content').className = $old_classes+' '+$data[$curr_active+1].classes;
        }else{
          document.querySelector('#tourme-content').className = $old_classes;
        }

        // add offset top of the element so it moves to its origin element
        // add top css
        if( !$data[$curr_active+1].top || screen.width < 768 ){
          document.querySelector('#tourme-content').style.top = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).top + 'px';
        }else{
          if( $data[$curr_active+1].top.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).top + parseInt( $data[$curr_active+1].top ) ) + 'px';
          }else{
            document.querySelector('#tourme-content').style.top = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).top - parseInt( $data[$curr_active+1].top.replace('-','') ) ) + 'px';
          }
        }
        // add left css
        if( !$data[$curr_active+1].left || screen.width < 768 ){
          document.querySelector('#tourme-content').style.left = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).left + 'px';
        }else{
          if( $data[$curr_active+1].left.indexOf('-') == -1){
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).left + parseInt(  $data[$curr_active+1].left ) ) + 'px';
          }else{
            document.querySelector('#tourme-content').style.left = ( $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).left - parseInt( $data[$curr_active+1].left.replace('-','') ) ) + 'px';
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
        if( document.querySelector('.tourme-pointer') !== null ){
           document.querySelector('.tourme-pointer').classList.remove('tourme-pointer');
        }
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

    var $old_classes =  document.querySelector('#tourme-content').className;
    // add the classes if there are
    if( $data[0].classes ){
      document.querySelector('#tourme-content').className = $old_classes+' '+$data[0].classes;
    }else{
      document.querySelector('#tourme-content').className = $old_classes;
    }

    // add offset top of the element so it moves to its origin element
    // add top css
    if( !$data[0].top || screen.width < 768 ){
      document.querySelector('#tourme-content').style.top = this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).top + 'px';
    }else{
      if( $data[0].top.indexOf('-') == -1){
        document.querySelector('#tourme-content').style.top = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).top + parseInt( $data[0].top ) ) + 'px';
      }else{
        document.querySelector('#tourme-content').style.top = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).top - parseInt( $data[0].top.replace('-','') ) ) + 'px';
      }
    }
    // add left css
    if( !$data[0].left || screen.width < 768 ){
      document.querySelector('#tourme-content').style.left = this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).left + 'px';
    }else{
      if( $data[0].left.indexOf('-') == -1){
        document.querySelector('#tourme-content').style.left = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).left + parseInt( $data[0].left ) ) + 'px';
      }else{
        document.querySelector('#tourme-content').style.left = ( this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).left - parseInt( $data[0].left.replace('-','') ) ) + 'px';
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

    if( document.querySelector('#tourme-content').classList.contains('with-arrow') ){
      var $arrow_pos = $data[0].arrow_pos;
      if( $arrow_pos ){
        document.querySelector('#tourme-content').classList.add($arrow_pos);
      }
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

  this.elInViewport = function( el ) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      (top + height) <= (window.pageYOffset + window.innerHeight) &&
      (left + width) <= (window.pageXOffset + window.innerWidth)
    );
  }
} // end of tourme function

  