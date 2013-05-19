snake-js
========

Play snake on top of any webpage with HTML5 canvas.

The only dependency is jQuery.

To use, put the following at the bottom of your webpage:
    
    <script src="path/to/snake.js"></script>
    <script>Snake.run();</script>

To install as a bookmarklet, use the following in a bookmark URL:
    
    javascript:(function(){function t(){var e=document.createElement('script');e.src='https://raw.github.com/jlkravitz/snake-js/master/snake.js';e.onload=function(){Snake.run()};document.body.appendChild(e)}if(!($=window.jQuery)){var e=document.createElement('script');e.src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';e.onload=t;document.body.appendChild(e)}else{t()}})()
