// Self-executing wrapper
(function($){
    
    var Item = Backbone.Model.extend({
    defaults: {
      concept: 'description',
      choice: 'random'
    }
  });
  
  var List = Backbone.Collection.extend({
    model: Item
  });
    
    

  var ListView = Backbone.View.extend({
      
    el: $('div#right'), // attaches `this.el` to an existing element.
      
    // `initialize()`: Automatically called upon instantiation. Where you make all types of bindings, _excluding_ UI events, such as clicks, etc.
    initialize: function(){
      _.bindAll(this, 'render','addItem'); // every function that uses 'this' as the current object should be in here
        
        this.collection = new List();
        this.collection.bind('add', this.appendItem); // collection event binder
        this.counter = 0;
         
       this.render(); // not all views are self-rendering. This one is.
    },
      
      events: {
      'click button#add': 'addItem'
    },
      
    // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
    render: function(){
        
        //var self = this;
        
        $(this.el).append("<button id='add'>Add list item</button>");
        $(this.el).append("<ul></ul>");
    }
      
    , addItem: function(){
        
      this.counter++;
        item =  new Item();
        item.set({ concept : prompt("ahoao"), choice: "random" });
        this.collection.add(item);
                
        
      $('ul', this.el).append("<li>hello world"+this.counter+ item.get('concept') + item.get('choice') + " </li>");
    }
  });

  // **listView instance**: Instantiate main app view.
  var listView = new ListView();
})(jQuery);