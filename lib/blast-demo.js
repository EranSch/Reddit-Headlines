$(function(){
	$('p, h1').slabText();
	$('p').blast({ delimiter: 'word' });
	setTimeout(function(){
		$('p').addClass('loaded');
	}, 500);
});