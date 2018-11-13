function tourMe(){

  this.$arr = [];

  var $global = this;

  this.start = function(){
      
    var $els = document.querySelectorAll('[data-tourme-seq]');

    if( $els.length == 0 ){
      return;
    }

    if( $els == null )

    for( var $i = 0; $i < $els.length; $i++ ){
      //generate a unique id
      var $id = $i+'_'+this.generateUID();

      $els[$i].classList.add('tourMe'); //add class tourMe
      $els[$i].setAttribute('data-tourme-id',$id); // set id attribute for later reference

      var $anim = ( $els[$i].getAttribute('data-tourme-anim') == null ) ? false : $els[$i].getAttribute('data-tourme-anim');
      var $content = ( $els[$i].getAttribute('data-tourme-content') == null ) ? false : $els[$i].getAttribute('data-tourme-content');

      var $anchor = ( $els[$i].getAttribute('data-tourme-anchor') == null ) ? false : $els[$i].getAttribute('data-tourme-anchor');
      

      //
      this.$arr.push({ 
        id : $id,
        seq : parseInt( $els[$i].getAttribute('data-tourme-seq') ),
        anim :  $anim,
        content : $content,
        anchor : $anchor,
        active : 0
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
      var $tourme_bg_el = document.querySelector('#tourme-bg');
      $tourme_bg_el.parentNode.removeChild($tourme_bg_el);
      var $tourme_content_el = document.querySelector('#tourme-content');
      $tourme_content_el.parentNode.removeChild($tourme_content_el); 

    });
    document.querySelector('#tourme-button-prev').addEventListener('click',function(e){
       e.preventDefault();

      // show the first box
      var $data = JSON.parse(document.querySelector('#tourme-data').value);

      // get the current active on the data
      var $curr_active = $data.findIndex(x => x.active == 1 );

      if( $curr_active != 0 ){ // if not last child of the data array (-1)

        if( !$data[$curr_active-1].anchor ){
          document.querySelector('#tourme-content .content').innerHTML = ( $data[$curr_active-1].content );
        }else{
          document.querySelector('#tourme-content .content').innerHTML = document.querySelector($data[$curr_active-1].anchor).innerHTML;
        }

        // scroll top the element first
        $global.scrollToEl(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]'));

        // add offset top of the element so it moves to its origin element
        document.querySelector('#tourme-content').style.top = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]') ).top+'px';
        document.querySelector('#tourme-content').style.left = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active-1].id+'"]')).left+'px';

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

      // get the current active on the data
      var $curr_active = $data.findIndex(x => x.active == 1 );

      if( $curr_active != ( $data.length - 1 ) ){ // if not last child of the data array (-1)

        if( !$data[$curr_active+1].anchor ){
          document.querySelector('#tourme-content .content').innerHTML = ( $data[$curr_active+1].content );
        }else{
          document.querySelector('#tourme-content .content').innerHTML = document.querySelector($data[$curr_active+1].anchor).innerHTML;
        }

        // scroll top the element first
        $global.scrollToEl(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]'));

        // add offset top of the element so it moves to its origin element
        document.querySelector('#tourme-content').style.top = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]') ).top+'px';
        document.querySelector('#tourme-content').style.left = $global.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[$curr_active+1].id+'"]')).left+'px';

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

    // scroll top the element first
    this.scrollToEl(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]'));

    
    // add offset top of the element so it moves to its origin element
    document.querySelector('#tourme-content').style.top = this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).top+'px';
    document.querySelector('#tourme-content').style.left = this.getOffset(document.querySelector('.tourMe[data-tourme-id="'+$data[0].id+'"]')).left+'px';


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

