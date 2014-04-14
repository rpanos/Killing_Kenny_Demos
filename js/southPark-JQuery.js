

/*
 * 
 * 
 * Depends on Jquery and Underscore
 * 
 * 
 */


var SPWorld = {};

SPWorld.initIconList = [
  "cartman",
  "ike",
  "kenny",
  "kyle",
  "stan",
  "tweak",
  "wendy"
];

SPWorld.unselectedIconList = SPWorld.initIconList.slice(0); 

SPWorld.selectedIconList = [
];

//templating would be better
SPWorld.giveIconHTML = function( iconName ) {
  return "<div class='spIcon' data-name='" + iconName + "'> <img class='southParkIcon " + iconName + "'/><div class='name'>" +iconName+ "</div></div>";
};


SPWorld.displayIconObjectsList = function( iconList, targetDivId, clickable ) {
  var targetDiv = $("#" + targetDivId);
  
  targetDiv.empty();
  //alert
  if (targetDiv) {       //TEST THIS!
    _.each(iconList, function( icon ) {
      try {
      //Ideally utilize a template system
      temp = SPWorld.giveIconHTML(icon);
      console.log("new node w " + icon +" AND " +  targetDiv  +" + "+ temp  +" - FROM - "+ targetDivId );
      
      $("#" + targetDivId).append(temp);
      //targetDiv.append
      } catch (e) {
        console.log("ERR " + e.message);
      }
    });
    console.log("Done");

    if (clickable) {
      $(".spIcon").click( SPWorld.clickAction );
    }

  } else {
    console.log("selector " +targetDivId+ "  not found");
  }

};

SPWorld.clickAction =  function(event) {
    var name = $(this).attr('data-name');
    
    console.log("CLICKED " + name);
    
    SPWorld.unselectedIconList = jQuery.grep(SPWorld.unselectedIconList, function(value) {
      return value != name;
    });
    SPWorld.selectedIconList.push(name);
    
    SPWorld.displayIconObjectsList( SPWorld.unselectedIconList, 'select_list', true );
    SPWorld.displayIconObjectsList( SPWorld.selectedIconList, 'target_list', false ); 
};

// "MAIN"
$( document ).ready(function() {

  SPWorld.displayIconObjectsList( SPWorld.unselectedIconList, 'select_list', true );

  $("#reset").click(function() {

    SPWorld.unselectedIconList = SPWorld.initIconList.slice(0);
    SPWorld.selectedIconList = [];
    SPWorld.displayIconObjectsList( SPWorld.unselectedIconList, 'select_list', true );
    SPWorld.displayIconObjectsList( SPWorld.selectedIconList, 'target_list', false ); 
    
  });

});



