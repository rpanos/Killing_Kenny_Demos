

/*
 * 
 * 
 * Depends on Dojo!
 * 
 * 
 */

require([
           'dojo/dom',
           "dojo/ready",
           "dojo/query",
           "dojo/dom-construct",
           "dojo/dom-attr"
        ], function (dom, ready, query, domConstruct, domAttr) {  //domConstruct
          
  var SPWorld = {}; 
  var initIconList = [
    "cartman", 
    "ike",
    "kenny",
    "kyle",
    "stan",
    "tweak",
    "wendy"
  ];
  //TODO - consider killing init array?
  var unselectedIconList = initIconList.slice(0); //SPWorld.initIconList;
  
  var selectedIconList = [];

  //very temp bc templating would be better
  var giveIconHTML = function( iconName ) {
    return "<div class='spIcon' data-name='" + iconName + "'> <img class='southParkIcon " + iconName + "'/><div class='name'>" +iconName+ "</div></div>";
  };
  
  var displayIconObjectsList = function( iconList, targetDivId, clickable ) {
    var targetDiv = query("#" + targetDivId);
    
    //targetDiv.empty();
    domConstruct.empty(targetDivId);
    //alert
    if (targetDiv) {       //TEST THIS!
      iconList.forEach(function( icon ) {
        try {
          //Ideally utilize a template system
          temp = giveIconHTML(icon);
         // console.log("new node w " + icon +" AND " +  targetDiv  +" + "+ temp  +" - FROM - "+ targetDivId );
          
          domConstruct.place(temp, targetDivId, "last");
          
          //targetDiv.append
        } catch (e) {
          console.log("ERR " + e.message + " from " + query("#" + targetDivId));
        }
      });
      console.log("Done - -");
      if ( clickable ) {  
        console.log("ADDING CLICK - -");
        //query(".clickMe").on("click", myObject.onClick);
        query(".spIcon").on("click", clickAction);

      }
    } else {
      console.log("selector " +targetDivId+ "  not found");
    }
  
  };
  
  var clickAction =  function(event) {
      var name = domAttr.get(this, "data-name");
      console.log("_______________CLICKED " + name);
      
      var index = unselectedIconList.indexOf(name);
      if (index > -1) {
          unselectedIconList.splice(index, 1);
      }
      //unselectedIconList.remove( SPWorld.unselectedIconList.item( name ) );
      selectedIconList.push(name);
      
      displayIconObjectsList( unselectedIconList, 'select_list', true );
      displayIconObjectsList( selectedIconList, 'target_list', false ); 
  };
  
  dojo.ready(function(){
  ///MAIN
    displayIconObjectsList( unselectedIconList, 'select_list', true );
  
    dojo.connect(dom.byId("reset"), "onclick", function(evt) {
  
      //unselectedIconList = initIconList;
      unselectedIconList = initIconList.slice(0); 
      selectedIconList = [];
      displayIconObjectsList( unselectedIconList, 'select_list', true );
      //SPWorld.displayIconObjectsList( SPWorld.unselectedIconList, 'select_list' );
      displayIconObjectsList( selectedIconList, 'target_list', false ); 
  
    });
  
  });


});










