var Movie = Backbone.Model.extend({
  // has a default configuration built into the model to handle like status
  defaults: {
    like: true
  },
  // method 'toggleLike' is created to do self-made 'toggle'
  toggleLike: function() {
    // your code here
    // using backbone ways, I am setting 'like'-attr to the opposite of whatever it's current state is with 
      // this.get(attrLookup);
    this.set('like', !this.get('like'));
  }
});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
    // event handler looks for a change and executes a sort when it finds one
    // the change it is listening for in this 'object' scope is the when I do the this.comparator for the field down below
      // further down, this change is happening when, I click on the HTML radio button which will give us a value based on the form 
    this.on('change', function() {
      // uses the built in sort method
      this.sort();
    });


  },

  comparator: 'title',

  sortByField: function(field) {
    // your code here
      // updated comparator
    this.comparator = field;
    this.sort();
  }
});


// App view is the whole canvas on which to put our stuff
var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    // on click, it will give us a new field based on the $(e.target).val();
      // which still trigger the sortByField method earlier in the app.js
    // this handle click is here because the radio buttons reside here
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },
  // 'MASTER' render which renders the container for the whole page
  render: function() {
    // generates a moviesView (collection)
    new MoviesView({
      // el is a DOM element that is built into backbone
        // here it is resolved with #movies which is made inside the html file
      el: this.$('#movies'),
      // points to its own collection
      collection: this.collection
    }).render(); // renders it all
  }
});

var MovieView = Backbone.View.extend({
  // creates a template using the underscore template func to store the single movies
  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
    // event handler listening for when a movie model gets a change in the like which is triggered when it is clicked on , the class 'like' as stated in the template (looks for attr like)
    this.model.on('change:like', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // your code here
    // handleClick triggers the method when it clisk on the page
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({ // is a collection

  initialize: function() {
    // your code here
    // listening to sort/
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    // sets the dom to empty
    this.$el.empty();
    // renders the whole collection again
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    // when we invoke, we will draw a whole each movie again
    var movieView = new MovieView({model: movie});
    // appends it to the DOM
    this.$el.append(movieView.render());
  }

});
