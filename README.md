# tourMe
A simple javascript tour plugin for your website

#### How To Use

Just link the tourMe.min.js and the tourMe.min.css to your HTML

then initialize the plugin

```
var $tour = new tourMe();
$tour.start({
	duration : 5,
	arrow : true
});
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

You can also addjust the generated top and left offset by adding 'data-tourme-top', 'data-tourme-left' attribute(s), whatever the value will be appended to the generated offset value (top|left). Negative values ( ex: -65) will be automatically treated as a reduce value to the generated offset values
```
<div data-tourme-seq="4" data-tourme-top="78" data-tourme-left="-56" data-tourme-anchor="#custom-container">Fourth</div>
<div id="custom-container">Hi, I am presenation from a custom container</div>
```

By default, each active presentation origin element will be added a class of 'tourme-pointer', you can override this styling if you wish to.

By default, it will show every time but you can set the iteration count
```
var $tour = new tourMe();
$tour.start({
	duration : 5, <-- 0 means show everytime or the counter will reset
});
```