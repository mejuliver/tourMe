# tourMe
A simple javascript tour plugin for your website

#### How To Use

Just link the tourMe.min.js and the tourMe.min.css to your HTML

then initialize the plugin

```
var $tour = new tourMe();
$tour.start();
```

but first, you should set up your group presentation. To set up, add 'data-tourme-seq' attribute to element that you want to bind its popup presentation, this attribute indicate the order of your presentation obviously (start with 1) and add 'data-tourme-content' for the presentation contents e.g.

```
<div data-tourme-seq="1" data-tourme-content="This is the start">First</div>
<div data-tourme-seq="2" data-tourme-content="This is the 2nd">Second</div>
<div data-tourme-seq="3" data-tourme-content="This is the 3rd presentation">Third</div>
```
You can also bind a custom container by adding 'data-tourme-anchor' attribute e.g.

```
<div data-tourme-seq="4" data-tourme-anchor="#custom-container">Fourth</div>
<div id="custom-container">Hi, I am presenation from a custom container</div>
```