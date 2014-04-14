
/*
 * 
 * Killing Kenny w/ BackBone
 * 
 * 
 * Notables:
 *  -SO much boilerplate!
 *  -So much effort for simple things like the reset button
 *  -So much effort to coordinate views through meassaging
 *  -Since runtime errors are so time consuming to debug in BackBone, I do 
 *        go nutz on try/catches.  Maybe this is only for development mode
 * 
 *  ** currently showing two ways to update the lists.  Passing Ids and 
 *        remaking models and actually passing models.  We could also pass views?  
 *        This is largely to facilitate discussions on how Backbone can be used 
 *        in many many different ways
 * 
 *  MOST OF ALL: a Marionnette version will demonstrate a lot of the power of said framework
 * 
 * 
 */



(function($){
  
  var SPWorld_BB = SPWorld_BB || {};
  
  // `Backbone.sync`: Overrides persistence storage with dummy function. This enables use of `Model.destroy()` without raising an error.
  // Backbone.sync = function(method, model, success, error){
    // success();
  // };
  SPWorld_BB.initIconList = [
    "cartman",
    "ike",
    "kenny",
    "kyle",
    "stan",
    "tweak",
    "wendy"
  ];

  SPWorld_BB.Icon = Backbone.Model.extend({
    defaults: {
      id: 'cartman'
    }
    
    
  });

  SPWorld_BB.IconCollection = Backbone.Collection.extend({
    model: SPWorld_BB.Icon
  });

  SPWorld_BB.IconView = Backbone.View.extend({
    tagName: 'div', // name of tag to be created
    className: 'spIcon',

    events: {
      'click':  'moveIcon'
    },

    initialize: function(attributes){
      _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here

      /* 
       * If we were updating the models directly, this would be more useful.  Note many BBone implimentations 
       * assume this will be here
       */
      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
      
      if ( attributes.clickable === true ) {
        this.clickable = true;
      } else {
        this.clickable = false;
      }
    },
    moveIcon: function() {

      if (this.clickable === true) {
        this.unrender();
        //This is the alternative way to switch lists.  Its effectively creating a new model AND new view
        //Maybe use remove when using this method?
        //SPWorld_BB.mainMsgs.trigger("item_select", this.model.id); 
        
        SPWorld_BB.mainMsgs.trigger("icon_selected_move", this.model);
        
        this.clickable = false;
      }
    },
    // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
    render: function(){
      
      try{
       //TODO: remove data tag?
        var the_html = "<img class='southParkIcon " + this.model.id + "'/><div class='name'>" +this.model.id+ "</div>";

        this.$el.html( the_html );
      
      } catch(e) {
        console.log("ISSUE: " + e.message);
      }
      return this; // for chainable calls, like .render().el
    },
    // `unrender()`: Makes Model remove itself from the DOM.
    //TODO: confirm this is necessary
    unrender: function(){
      this.unbind();
      $(this.el).remove();
    },

    // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
    remove: function(){
      this.unbind();
      this.model.destroy();
    }
  });

  // Because the new features (swap and delete) are intrinsic to each `Item`, there is no need to modify `ListView`.
  SPWorld_BB.IconListView = Backbone.View.extend({

    initialize: function( attributes ){

      this.el = attributes.el;  //TODO: consider a default
      _.bindAll(this, 'render', 'addIcon', 'appendItem', 'removeItem'); // every function that uses 'this' as the current object should be in here

      if( attributes && attributes.initIconList ) {
        this.initIconList = attributes.initIconList;  //.slice(0);  ?
        this.resetCollection(this.initIconList.slice(0) );
        
      } else {
        this.resetCollection( );
      }
      this.counter = 0;
      
      if( attributes && attributes.clickable ) {
        this.clickable = true;
        //I've learned the hard way that stopListening is a good practice
        this.stopListening();
        this.listenTo(SPWorld_BB.mainMsgs, 'icon_selected_move',  $.proxy(function(icon){
          this.collection.remove(icon);

          this.render();
          SPWorld_BB.mainMsgs.trigger("item_moved", icon); 
        }, this));
        this.listenTo(SPWorld_BB.mainMsgs, 'item_select',  $.proxy(function(iconID){

          this.removeItem(iconID);
          this.render();
          SPWorld_BB.mainMsgs.trigger("item_select_add", iconID); 
        }, this));
        this.listenTo(SPWorld_BB.mainMsgs, 'reset_unselected',  $.proxy(function(){
          this.resetCollection(  this.initIconList  );
        }, this));
        
      } else {
        this.clickable = false;
        //I've learned the hard way that stopListening is a good practice
        this.stopListening();
        this.listenTo(SPWorld_BB.mainMsgs, 'item_select_add',  $.proxy(function(iconID){
          this.addIcon(iconID);  
          this.render();   
        }, this));
        this.listenTo(SPWorld_BB.mainMsgs, 'item_moved',  $.proxy(function(icon){
          this.appendItem(icon);  
          //this.render();   
        }, this));
        this.listenTo(SPWorld_BB.mainMsgs, 'clear_selected',  $.proxy(function(){
          this.resetCollection(   );
        }, this));
      }
      
      this.render();
    },
    resetCollection: function(iconList){
      var that = this;

      this.collection = new SPWorld_BB.IconCollection();
      if(iconList&& iconList.length) {
        _(iconList).each(function(iconname){
          that.addIcon(iconname);
        });
      } 
      this.render();
    },
    render: function(){
      var self = this;
      $(this.el).empty();
      
      if (this.collection && this.collection.length > 0) {
        console.log(this.collection);
        _(this.collection.models).each(function(item){ // in case collection is not empty
          self.appendItem(item);
        }, this);
        console.log(this.el + " RENDERED");
      }
    },
    addIcon: function(icnNm){
      try{
        this.counter++;
        var icon = new SPWorld_BB.Icon();
        //todo: init normal?
        icon.set({
          id: icnNm // modify item defaults
        });
        this.collection.add(icon);
      } catch(e) {
        console.log("ISSUE addIcon: " + e.message);
      }
    },
    removeItem: function(icnNm){
      console.debug(this);
      this.counter--;

      this.collection.remove(this.collection.get(icnNm));
      this.render();
      
    },
    appendItem: function(item){
      try {
        var iconView = new SPWorld_BB.IconView({
          model: item,
          clickable: this.clickable
        });

        $(this.el, 'body').append(iconView.render().el);

     } catch(e) {
        console.log("%%%% ISSUE appendItem: " + e.message);
     }
    }
  });
  SPWorld_BB.ButtonsView = Backbone.View.extend({
    // `ItemView`s now respond to two clickable actions for each `Item`: swap and delete.
    events: {
      'click #reset':  'resetLists'
    },
    initialize: function(){

    },
    resetLists: function() {
      SPWorld_BB.mainMsgs.trigger("clear_selected"); 
      SPWorld_BB.mainMsgs.trigger("reset_unselected"); 
    },
    // `render()` now includes two extra `span`s corresponding to the actions swap and delete.
    render: function(){
      
      try{
       //TODO: remove data tag?
        var the_html = "<p></p><p></p><button type='button' id='save'>Save</button><button type='button' id='reset'>Reset</button>";

        this.$el.html( the_html );
      
      } catch(e) {
        console.log("ISSUE: " + e.message);
      }
      return this; // for chainable calls, like .render().el
    },
    // `unrender()`: Makes Model remove itself from the DOM.
    //TODO: confirm this is necessary
    unrender: function(){
      $(this.el).remove();
    },

    // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
    remove: function(){
      this.model.destroy();
    }
  });
  
  $( document ).ready(function() {
    SPWorld_BB.mainMsgs = {};
    _.extend(SPWorld_BB.mainMsgs, Backbone.Events);
    
    SPWorld_BB.selectListView = new SPWorld_BB.IconListView({el: "#select_list", initIconList: SPWorld_BB.initIconList , clickable: true} );
    
    SPWorld_BB.targetListView = new SPWorld_BB.IconListView({el: "#target_list", initIconList: [] , clickable: false } );
    
    SPWorld_BB.buttonsView = new SPWorld_BB.ButtonsView({el: ".ins_buttons"} );
  });
  
})(jQuery);