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
      
    el: $('div#left'), // attaches `this.el` to an existing element.
      
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
        $(this.el).append("<table class=\"table table-striped table-hover \">"
                +"<thead>"
                    +"<tr>"
                        +"<th>#</th>"
                        +"<th>Concept</th>"
                        +"<th>Mandatory</th>"
                        +"<th>Random</th>"
                        +"<th>Disabled</th>"
                        +"<th>Remove</th>"
                    +"</tr>"
                +"</thead><tbody></tbody></table>");
    }
      
    , addItem: function(){
        
        this.counter++;
        item =  new Item();
        item.set({ concept : prompt("ahoao"), choice: "random", counter: this.counter });
        this.collection.add(item);
                
        
      $('tbody', this.el).append(
            '<tr id="concept1">' 
                        +'<td>' +  this.counter + '</td>'
                        +'<td>'
                            +'<div class="form-group">'
                                +'<div class="form-control-wrapper"><input value="' + item.get('concept') +'" id="concept' +  item.get('counter') + '_text" class="form-control"  type="text"><span class="material-input"></span></div>'
                            +'</div>'
                        +'</td>'
                        +'<td>'
                            +'<div class="radio radio-primary">'
                                +'<label>'
                                    +'<input type="radio" name="concept' + item.get('counter') + '_choice" id="concept' + item.get('counter') + '_choice" value="mandatory">'
                                    +'<span class="circle"></span><span class="check"></span>'
                                +'</label>'
                            +'</div>'
                        +'</td>'
                        +'<td>'
                            +'<div class="radio radio-primary">'
                                +'<label>'
                                    +'<input type="radio" name="concept' +  item.get('counter') + '_choice" id="concept' +  item.get('counter') + '_choice" value="random" checked="checked">'
                                    +'<span class="circle"></span><span class="check"></span>'
                                +'</label>'
                            +'</div>'
                        +'</td>'
                        +'<td>'
                            +'<div class="radio radio-primary">'
                                +'<label>'
                                    +'<input type="radio" name="concept' +  item.get('counter') + '_choice" id="concept' +  item.get('counter') + '_choice" value="disabled" >'
                                    +'<span class="circle"></span><span class="check"></span>'
                                +'</label>'
                            +'</div>'
                        +'</td>'
                        +'<td>'
                            +'<button class="btn btn-primary" type="button">Remove</button>'
                        +'</td>'
                    +'</tr>');
    }
  });

  // **listView instance**: Instantiate main app view.
  var listView = new ListView();
})(jQuery);