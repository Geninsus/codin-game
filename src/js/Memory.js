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
    if (this.memory[indice] != null) {
      this.memory[indice].destroy();
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
    return {x:158 + 32*(index%5),y:248 + 32*(Math.floor(index/5))};
  }
};
