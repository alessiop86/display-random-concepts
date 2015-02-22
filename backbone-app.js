// Self-executing wrapper
(function ($) {

    Backbone.sync = function (method, model, success, error) {
        success();
    }
    
    /* Model */
    var Item = Backbone.Model.extend({
        defaults: {
            concept: 'description',
            displayChoice: 'random'
        }
    });

    var List = Backbone.Collection.extend({
        model: Item
    });

    /* End of model */
    
    /* Views */
    
    var ItemView = Backbone.View.extend({

        tagName: 'tr',

        events: {
            'click button.delete': 'remove',
            'change input[type=text]': 'conceptChanged',
            'click input[type=radio]': 'displayChoiceChanged'
        },

        initialize: function () {
            _.bindAll(this, 'render', 'unrender', 'remove','conceptChanged','displayChoiceChanged'); 
            this.model.bind('remove', this.unrender);            
        },
        conceptChanged:function(evt) {
            
           var value = $(evt.currentTarget).val();
            this.model.set('concept',value)

        },
        
        displayChoiceChanged:function(evt) {
            var value = $(evt.currentTarget).val();
            this.model.set('displayChoice',value)
        },

        render: function () {
            
            //workaround to access @ this.model from the anonymous inner function
            //making it a closure for the free variable model
            var model = this.model
            
            //workaround because .html() is not working with <tr>
            $(this.el).each(function(){                    
                    
              jQuery(this)[0].innerHTML = '<tr><td>' + '<div class="form-group">' + '<div class="form-control-wrapper"><input value="' + model.get('concept') + '" class="form-control concept"  type="text"><span class="material-input"></span></div>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" value="mandatory">' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" value="random" checked="checked">' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<div class="radio radio-primary">' + '<label>' + '<input type="radio" value="disabled" >' + '<span class="circle"></span><span class="check"></span>' + '</label>' + '</div>' + '</td>' + '<td>' + '<button class="btn btn-primary delete" type="button">Remove</button>' + '</td></tr>';
    });
            return this; 
        },
        
        unrender: function () {
            $(this.el).remove();
        },

        remove: function () {
            this.model.destroy();
        }
    });

    /*Main view (List) */
    var ListView = Backbone.View.extend({

        el: $('div#left'), 

        initialize: function () {
            _.bindAll(this, 'render', 'addItem', 'appendItem'); 

            this.collection = new List();
            this.collection.bind('add', this.appendItem);

            
            /* Remove this block below, just for showcase purpose */
            var testModel = getTestModel();
            for (var i=0;i<testModel.length;i++) {                
                var item = new Item();
                item.set(testModel[i]);
                this.collection.add(item);
            }
            /* End of test showcase block */
            
                                    
            this.render(); //self-rendering view
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
                
        render: function () {

            var self = this;

            $(this.el).append("<button id='add'>Add item</button>");
            
            $(this.el).append("&nbsp;<button id='random'>Generate random graph</button>");
            
            $(this.el).append("<table class=\"table table-striped table-hover \">" 
                                + "<thead>"
                                + "<tr>" 
                                + "<th>Concept</th>" 
                                + "<th>Mandatory</th>" 
                                + "<th>Random</th>"
                                + "<th>Disabled</th>" 
                                + "<th>Remove</th>"
                                + "</tr>"
                                + "</thead>"
                                +"<tbody></tbody>"
                                +"</table>");

            this.collection.each(function (item) { 
                self.appendItem(item);
            }, this);
        }


        ,
        addItem: function () {

            var item = new Item();
            item.set({
                concept: prompt("Write concept:"),
                displayChoice : "random",
            });
            this.collection.add(item);
        },
        
        

        
        displayRandom: function() {
                                     
            displayRandomGraph(this.collection.models);
        }


    });
    
    /* end of Views */

    //Instantiate main app view.
    var listView = new ListView();
})(jQuery);

/* End of Backbone.js app */

/* Start of Graph generation code */

var  g2 = {
  "nodes": [],
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
            enableHovering: false,
            autoRescale: false,
            autoResize:false,
            rescaleIgnoreSize: false
            
        }, graph: g2
        
    });
//console.log(s2);

/**
Grap
*/
function displayRandomGraph(concepts) {
        
    //disable multiple clicks
    //$("#random").prop('disabled', true);
    //setTimeout(function() {  $("#random").prop('disabled', false); }, 500);
    
    s2.graph.clear();

    //nodes
    for (var i=0; i < concepts.length; i++) {                
        
        //Compute display choice
        if (concepts[i].get("displayChoice") == "disabled" || ( concepts[i].get("displayChoice") == "random" && Math.random() < 0.5) )
            continue;
        
         
        var id = "n" + s2.graph.nodes().length;
        var concept = { 
            "id" : id,
            "label" : concepts[i].get('concept'),
            "x" : Math.round(200 * (0.5 - Math.random())), 
            "y" : Math.round(200 * (0.5 - Math.random())), 
            'size': Math.round(Math.random() * 6) + 2,
            'color': 'rgb('+Math.round(Math.random()*256)+','+  Math.round(Math.random()*256)+','+ Math.round(Math.random()*256)+')'
            }
           
            s2.graph.addNode(concept)
    }
    
    //edges    
    for (var i=0; i < s2.graph.nodes().length; i++) {
        
        var edgesForCurrentNode = Math.round(Math.pow(Math.random(),2) * 3);
        
        for (var j=0; j<edgesForCurrentNode;j++) {

            var start = s2.graph.nodes()[i].id
            var end = start;
            
            //edges allowed only between different nodes
            while (end == start) {            
                end = "n" + Math.round(Math.random()*(s2.graph.nodes().length -1));
            }
            
            var edge = {
              "id": "e" + s2.graph.edges().length,
              "source": start,
              "target": end
            };
            
            
            s2.graph.addEdge(edge)
        }

    }

    //console.log("NODES");console.log(s2.graph.nodes());
    //console.log("EDGES");console.log(s2.graph.edges());
    s2.refresh()
    
}

/* End of Graph generation code */


/**
test showcase
*/
function getTestModel() {
    
   var testCollection = [];
   for (var i=0;i<5;i++) {
        var item = {
            concept: "Concept " + i,
            displayChoice: "random",
        };
        testCollection.push(item);
    }
    return testCollection;
}