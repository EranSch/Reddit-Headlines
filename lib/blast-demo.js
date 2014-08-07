$(function(){
	$('p, h1').slabText();
	$('p').blast({ delimiter: 'word' });
	setTimeout(function(){
		$('p, h1, footer').addClass('loaded');
	}, 500);
});