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
<<<<<<< HEAD
    return {x:158 + 31*(index%5),y:248 -31  + 31*(Math.floor(index/5))};
=======
    return {x:158 + 31*(index%5),y:237 + 31*(Math.floor(index/5))};
>>>>>>> e722ea721264c46673efea4381a2e32d5e658672
  }
};
