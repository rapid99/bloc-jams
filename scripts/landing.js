var animatePoints = function(){
    var points = document.getElementsByClassName('point');
    
    var revealPoint = function(indexNum){
        points[indexNum].style.opacity = 1;
        points[indexNum].style.transform = "scaleX(1) translateY(0)";
        points[indexNum].style.msTransform = "scaleX(1) translateY(0)";
        points[indexNum].style.WebKitTransform = "scaleX(1) translateY(0)"; 
    }
    
    for(var i = 0; i < points.length; i++){
        revealPoint(i);
    }
};

animatePoints();
