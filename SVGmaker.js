Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

var SVGmaker = (function(){

  var downloadA;

  var getSVG = function(){

    var lefts = [];
    var tops = [];
    $("svg").each(function(){
      tops.push(parseInt($(this).css('top').replace('px','')));
      lefts.push(parseInt($(this).css('left').replace('px','')));
    });

    var minTop = Array.min(tops);
    var maxTop = Array.max(tops);
    var minLeft = Array.min(lefts);
    var maxLeft = Array.max(lefts);
    var verTileNum = 0;
    var horTileNum = 0;
    var i;

    for(i = 0; i < lefts.length; i++){
      if(lefts[i] == minLeft) verTileNum++;
      if(tops[i] == minTop) horTileNum++;
    }

    var svgViewWidth = maxLeft - minLeft;
    var svgViewHeight = maxTop - minTop;
    var viewSVG = "<svg width = \"" + svgViewWidth + "px\" height = \"" + svgViewHeight +"px\">";
    var gWidth = svgViewWidth/horTileNum;
    var gHeight = svgViewHeight/verTileNum;
    var gs = [];

    $("svg").each(function(){
      var thisTop = parseInt($(this).css('top').replace('px',''));
      var thisLeft = parseInt($(this).css('left').replace('px',''));
      thisTop -= minTop;
      thisLeft -= minLeft;
      var gStart = "<g transform = \"translate(" + thisLeft + " " + thisTop+ ")\">";
      var thisHTML = this.innerHTML;
      var gEnd = "</g>";
      var group = gStart + thisHTML + gEnd;
      gs.push(group);
    });

    var finalSVG = viewSVG;
    gs.forEach(function(g){
      finalSVG += g;
    });
    finalSVG += "</svg>";

    return finalSVG;
  };

  var updateDownloadLink = function(){
    var svg = getSVG();
    var blob = new Blob([svg], {type: 'text/xml'});
    var url = URL.createObjectURL(blob);
    downloadA.href = url;
  };

  var createDownloadButton = function(){
    var divEL = document.createElement('div');
    divEL.setAttribute('id','download');
    downloadA = document.createElement('a');
    downloadA.download = 'map.svg';
    //a.href = url;
    downloadA.textContent = "Download SVG"
    divEL.appendChild(downloadA);
    document.body.appendChild(divEL);
  };

  return{
    createDownloadButton : createDownloadButton,
    updateDownloadLink : updateDownloadLink
  }

})();