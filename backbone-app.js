// Self-executing wrapper
(function ($) {

    Backbone.sync = function (method, model, success, error) {
        success();
    }

    var Item = Backbone.Model.extend({
        defaults: {
            concept: 'description',
            choice: 'random',
            counter: 0
        }
    });

    var List = Backbone.Collection.extend({
        model: Item
    });

    var ItemView = Backbone.View.extend({

        tagName: 'tr',

        events: {
            'click button.delete': 'remove'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove'); // every function that uses 'this' as the current object should be in here

            //this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },


        render: function () {
            
            
            //workaround per accedere a this.model e this.counter
            var model = this.model
            
            //non posso aggiornare html di un tr
                $(this.el).each(function(){                    
                    
              jQuery(this)[0].innerHTML = '<tr><td>' + model.get('counter') + '</td>' + '<td>' + '<div class="form-group">' + '<div class="form-control-wrapper"><input value="' + model.get('concept') + '" id="concept' + model.get('counter') + '_text" class="form-control"  type="text"><span class="material-input"></span></div>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" name="concept' + model.get('counter') + '_choice" id="concept' + model.get('counter') + '_choice" value="mandatory">' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" name="concept' + model.get('counter') + '_choice" id="concept' + model.get('counter') + '_choice" value="random" checked="checked">' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" name="concept' + model.get('counter') + '_choice" id="concept' + model.get('counter') + '_choice" value="disabled" >' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<button class="btn btn-primary delete" type="button">Remove</button>' + '</td></tr>';
    });
       /*     $(this.el).html('<td>' + this.counter + '</td>' + '<td>' + '<div class="form-group">' + '<div class="form-control-wrapper"><input value="' + this.model.get('concept') + '" id="concept' + this.model.get('counter') + '_text" class="form-control"  type="text"><span class="material-input"></span></div>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" name="concept' + this.model.get('counter') + '_choice" id="concept' + this.model.get('counter') + '_choice" value="mandatory">' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" name="concept' + this.model.get('counter') + '_choice" id="concept' + this.model.get('counter') + '_choice" value="random" checked="checked">' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" name="concept' + this.model.get('counter') + '_choice" id="concept' + this.model.get('counter') + '_choice" value="disabled" >' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<button class="btn btn-primary delete" type="button">Remove</button>' + '</td>');
       */
            return this; // for chainable calls, like .render().el
        },
        // `unrender()`: Makes Model remove itself from the DOM.
        unrender: function () {
            $(this.el).remove();
        },
        // `swap()` will interchange an `Item`'s attributes. When the `.set()` model function is called, the event `change` will be triggered.
        /*swap: function(){
      var swapped = {
        part1: this.model.get('part2'),
        part2: this.model.get('part1')
      };
      this.model.set(swapped);
    },*/
        // `remove()`: We use the method `destroy()` to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
        remove: function () {
            this.model.destroy();
        }
    });

    var ListView = Backbone.View.extend({

        el: $('div#left'), // attaches `this.el` to an existing element.

        // `initialize()`: Automatically called upon instantiation. Where you make all types of bindings, _excluding_ UI events, such as clicks, etc.
        initialize: function () {
            _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here

            this.collection = new List();
            this.collection.bind('add', this.appendItem); // collection event binder

            this.counter = 0;
            this.render(); // not all views are self-rendering. This one is.
        },

        events: {
            'click button#add': 'addItem',
            'click button#random': 'displayRandom'
        },

        // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
        render: function () {

            //var self = this;

            $(this.el).append("<button id='add'>Add list item</button>");
             $(this.el).append("&nbsp;<button id='random'>Random link objects</button>");
            $(this.el).append("<table class=\"table table-striped table-hover \">" + "<thead>" + "<tr>" + "<th>#</th>" + "<th>Concept</th>" + "<th>Mandatory</th>" + "<th>Random</th>" + "<th>Disabled</th>" + "<th>Remove</th>" + "</tr>" + "</thead><tbody></tbody></table>");

            _(this.collection.models).each(function (item) { // in case collection is not empty
                self.appendItem(item);
            }, this);
        }


        ,
        addItem: function () {

            this.counter++;
            var item = new Item();
            item.set({
                concept: prompt("ahoao"),
                choice: "random",
                counter: this.counter
            });
            this.collection.add(item);
        },
        
        
        appendItem: function (item) {
            var itemView = new ItemView({
                model: item
            });
            $('tbody', this.el).append(itemView.render().el);
        },
        
        displayRandom: function() {
                        
            for (var i=0; i < this.collection.models.length; i++) {
                var model = this.collection.models[i];                
                model.get('concept');
                
            }
            
            spalaflashalert(this.collection.models);
        }


    });

    // **listView instance**: Instantiate main app view.
    var listView = new ListView();
})(jQuery);


function spalaflashalert(concepts) {
    
    //pulizia
    $("#rightCanvas").html("");
    
    //grafo vuoto
      var g2 = {
  "nodes": [ 
      {
      "id": "n2",
      "label": "And a last one",
      "x": 100,
      "y": 3,
      "size": 1
    }
  ],
  "edges": [ ]
};
    
    
     for (var i=0; i < concepts.length; i++) {
                
                concepts[i].get('concept');
                var concept = { 
                    "id" : "n" + i,
                    "label" : concepts[i].get('concept'),
                    "x" : Math.random(),
                    "y" : Math.random(),
                    size: Math.random()
                }
                 g2.nodes.push(concept)   
                               
            }
    
    var g = {
  "nodes": [
    {
      "id": "n0",
      "label": "A node",
      "x": 0,
      "y": 0,
      "size": 3
    },
    {
      "id": "n1",
      "label": "Another node",
      "x": 3,
      "y": 1,
      "size": 2
    },
    {
      "id": "n2",
      "label": "And a last one",
      "x": 1,
      "y": 3,
      "size": 1
    }
  ],
  "edges": [
    {
      "id": "e0",
      "source": "n0",
      "target": "n1"
    },
    {
      "id": "e1",
      "source": "n1",
      "target": "n2"
    },
    {
      "id": "e2",
      "source": "n2",
      "target": "n0"
    }
  ]
};

    
var s  = new sigma({
  graph: g2,
  container: 'rightCanvas'
});
    
}