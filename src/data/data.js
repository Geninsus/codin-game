var data = [
  {
    wording : 'Le but de cet exercice est d\'additionner les entrées deux à deux.',
    memory : [null],
    inputs : [],
    outputs : [],
    inputsGenerator : function () {
      // Le nombre d'input est pair et entre 8 et 14
      var nb = Math.floor(Math.random() * (15 - 8) + 8);
      for(var i = 0; i < nb; i++) {
        // Les nombres sont entre 0 et 99
        this.inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
      }
      for(var i = 0; i < nb-1; i += 2) {
        this.outputs.push(this.inputs[i] + this.inputs[i + 1])
      }
    }
  }
];
