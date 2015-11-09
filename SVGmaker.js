Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

var SVGmaker = (function(){

  var downloadA;
  var dataKinds = ['water', 'ocean', 'water-layer', 'river', 'stream', 'canal', 'riverbank',
'major_road', 'minor_road', 'highway', 'buildings-layer', 'park', 'nature_reserve', 'wood', 'protected-land', 'rail'];

  var getSVG = function(){

    var lefts = [];
    var tops = [];
    $("body svg").each(function(){
      console.log($(this).css('top'));
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
    var backgroundRectangle = "<rect width = \"" + svgViewWidth + "px\" height = \"" + svgViewHeight + "px\" style=\"stroke: none; fill: #d9d9d9;\" />";
    var gWidth = svgViewWidth/horTileNum;
    var gHeight = svgViewHeight/verTileNum;
    var gs = [];

    $("body svg").each(function(){
      var $this = $(this);


      $this.find('path').each(function(){
        var $thisPath = $(this);
        var className = $thisPath.attr('class');
        className = className.split(' ')[1];
        $thisPath.attr('stroke-width', $thisPath.css('stroke-width'))
                .attr('stroke', $thisPath.css('stroke'))
                .attr('fill', $thisPath.css('fill'));
      });



      var thisTop = parseInt($this.css('top').replace('px',''));
      var thisLeft = parseInt($this.css('left').replace('px',''));
      thisTop -= minTop;
      thisLeft -= minLeft;
      var gStart = "<g transform = \"translate(" + thisLeft + " " + thisTop+ ")\">";
      var thisHTML = this.innerHTML;
      var gEnd = "</g>";
      var group = gStart + thisHTML + gEnd;
      gs.push(group);
    });

    var finalSVG = viewSVG;
    finalSVG += backgroundRectangle;
    finalSVG += $("#pattern-svg").html();
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

    var updateButton = document.createElement('button');
    updateButton.innerHTML = "Get Map";
    updateButton.addEventListener('click',updateDownloadLink,true);
    //a.href = url;
    downloadA.textContent = "Download SVG "
    divEL.appendChild(downloadA);
    divEL.appendChild(updateButton);
    document.body.appendChild(divEL);
  };


  return{
    createDownloadButton : createDownloadButton,
    updateDownloadLink : updateDownloadLink
  }

})();


