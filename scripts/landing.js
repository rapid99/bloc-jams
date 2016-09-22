var pointsArray = document.getElementsByClassName('point');
 
 var animatePoints = function(points) {
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


window.onload = function(){
    //if height of page is greater than 950 pixels, animate functions runs when window loads
    if (window.innerHeight > 950){
        animatePoints(pointsArray);
    }
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    window.addEventListener('scroll', function(event){
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance){
            animatePoints(pointsArray);
        }
    });
}
