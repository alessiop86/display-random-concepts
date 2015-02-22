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
            
            for (var i=0;i<10;i++) {
                this.counter++;
                var item = new Item();
                item.set({
                    concept: "Concetto" + i,
                    choice: "random",
                    counter: this.counter
                });
                this.collection.add(item);
            }
            
            
            
            this.render(); // not all views are self-rendering. This one is.
        },

        events: {
            'click button#add': 'addItem',
            'click button#random': 'displayRandom'
        },

        appendItem: function (item) {
            var itemView = new ItemView({
                model: item
            });
            $('tbody', this.el).append(itemView.render().el);
        },
        
        // `render()`: Function in charge of rendering the entire view in `this.el`. Needs to be manually called by the user.
        render: function () {

            var self = this;

            $(this.el).append("<button id='add'>Add list item</button>");
            
            $(this.el).append("&nbsp;<button id='random'>Random link objects</button>");
            
            $(this.el).append("<table class=\"table table-striped table-hover \">" + "<thead>" + "<tr>" + "<th>#</th>" + "<th>Concept</th>" + "<th>Mandatory</th>" + "<th>Random</th>" + "<th>Disabled</th>" + "<th>Remove</th>" + "</tr>" + "</thead><tbody></tbody></table>");

            this.collection.each(function (item) { 
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
        
        

        
        displayRandom: function() {
                        
        /*    for (var i=0; i < this.collection.models.length; i++) {
                var model = this.collection.models[i];                
                alert( model.get('concept') );
                
            }*/
            
            spalaflashalert(this.collection.models);
        }


    });

    // **listView instance**: Instantiate main app view.
    var listView = new ListView();
})(jQuery);


/*var s =  new sigma({      
        renderers: [ {
            container: document.getElementById('innerRightCanvas'),
            type:'canvas'   
        }
        ],
        settings: {
            sideMargin:80,
            labelThreshold:1,
            mouseEnabled:false,
            enableHovering: true,
            autoRescale: true,
            autoResize:false,
            rescaleIgnoreSize: true
            
        }
        
    });
*/

var  g2 = {
  "nodes": [], /*[ {id:"ciao", "x":1,"y":1, size:2}   ],*/
  "edges": []
};

var s2 =  new sigma(  {
      renderers: [ {
            container: document.getElementById('innerRightCanvas'),
            type:'canvas'   
        } ],
        settings: {
            sideMargin:80,
            labelThreshold:1,
            mouseEnabled:false,
            enableHovering: true,
            autoRescale: true,
            autoResize:false,
            rescaleIgnoreSize: true
            
        }, graph: g2
        
    });


function spalaflashalert(concepts) {
    
    //pulizia
    //$("#innerRightCanvas").html("");
    
    console.log("BEFORE")
    s2.graph.clear()
//    console.log(g2);
 var g2 = { }
 g2.nodes = []
  g2.edges = []
    //grafo vuoto
  /* var    g2 = {
  "nodes": [ ],
  "edges": [ ]
};*/
    
    
    var nNodes = 0;
    for (var i=0; i < concepts.length; i++) {
                
        var display = concepts[i].get("choice");
        
        if (display == "disabled" || (display == "random" && Math.random() < 0.55) )
            continue;
        
        //NODI 
        var id = "n" + nNodes;
        var concept = { 
            "id" : id,
            "label" : concepts[i].get('concept'),
            "x" : Math.round(200 * (0.5 - Math.random())), //Math.round(Math.random() * 100), //
            "y" : Math.round(200 * (0.5 - Math.random())), //Math.round(Math.random() * 100 ), 
            'size': Math.round(Math.random() * 6) + 2,
            'color': 'rgb('+Math.round(Math.random()*256)+','+
                  Math.round(Math.random()*256)+','+
                  Math.round(Math.random()*256)+')'
            }
            //console.log(concept)
            nNodes++;
            g2.nodes.push(concept)                
            s2.graph.addNode(concept)
        }
    
    var nEdges = 0;
    for (var i=0; i < nNodes; i++) {
         //COLLEGAMENTI 
        var edgesForCurrentNode = Math.round(Math.pow(Math.random(),2) * 3);
        for (var j=0; j<edgesForCurrentNode;j++) {

            var start = g2.nodes[i].id
            var end = start;
            while (end == start) {            
                end = "n" + Math.round(Math.random()*(nNodes -1));
            }
            
            
            
            
            
            var edge = {
              "id": "e" + nEdges,
              "source": start,
              "target": end
            };
            nEdges++;
          //  console.log(edge)
            g2.edges.push(edge)  
            s2.graph.addEdge(edge)
        }

    }
    
   console.log("AFTER")
   console.log(g2)
    /*console.log(s2)
      
    s2.addRenderer({
            container: document.getElementById('innerRightCanvas'),
            type:'canvas'   
        });*/
        
   /* var s =  new sigma({      
        renderers: [ {
            container: document.getElementById('innerRightCanvas'),
            type:'canvas'   
        }
        ],
        graph: g2,
        settings: {
            sideMargin:80,
            labelThreshold:1,
            mouseEnabled:false,
            enableHovering: true,
            autoRescale: true,
            autoResize:false,
            rescaleIgnoreSize: true
            
        }
        
    });*/
    
    
   //s.graph(g2);
    
    /*var s  = new sigma({
      graph: g2,
        type:'canvas',
      container: 'innerRightCanvas',
        settings: {
            sideMargin:80,
            labelThreshold:1,
            mouseEnabled:false,
            enableHovering: true,
            autoRescale: true,
            autoResize:false,
            rescaleIgnoreSize: true
            
        }
        
    });*/
    //Singleton.getInstance(g2);

    //s2.refresh()
   
   //s2.graph.addNode({id:"ciao", "x":1,"y":1, size:2})
   //s2.graph.addNode({id:"ciao2", "x":3,"y":3, size:2})
   s2.refresh()

  
    
}

var Singleton = (function () {
    var instance;
 
    function createInstance(g2) {
        
         var s =  new sigma({      
        renderers: [ {
            container: document.getElementById('innerRightCanvas'),
            type:'canvas'   
        }
        ],
        graph: g2,
        settings: {
            sideMargin:80,
            labelThreshold:1,
            mouseEnabled:false,
            enableHovering: true,
            autoRescale: true,
            autoResize:false,
            rescaleIgnoreSize: true
            
        }
        
        });
        return s;
    }
 
    return {
        getInstance: function (g2) {
            if (!instance) {
                console.log("Create")
               // instance = createInstance(g2);
            }
            else {
                console.log("Do nothing")
                //instance.kill()
                //instance = createInstance(g2);
                //console.log(instance.graph.nodes)
                //instance.graph.nodes(g2.nodes)
                //console.log(g2)                
                instance.refresh()
                
            }
            return instance;
        }
    };
})();
