var Memory = {
  memory : [],

  init : function(values) {
    this.memory = values;
  },

  get : function(indice) {
    if(this.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    return this.memory[indice];
  },

  set : function(indice, value) {
    if(this.memory[indice] === undefined) {
      error("L'indice " + indice + " n'existe pas en mémoire.");
    }
    this.memory[indice] = value;
  },

  display: function() {
    document.querySelector('#memory').innerHTML = "";
    for(var el in this.memory) {
      document.querySelector('#memory').innerHTML += el + " ";
    }
  },

  position: function(index) {
    if (index<0 || index>19) {
      return "Error";
    }
    return {x:120 + 28*(index%5),y:154 + 28*(Math.floor(index/5))};
  }
};
