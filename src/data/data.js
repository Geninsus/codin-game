var data = [
  {
    wording : 'Le but de cet exercice est d\'additionner les entrées deux à deux.',
    memory : [null],
    inputsGenerator : function () {
      // Le nombre d'input est pair et entre 8 et 14
      var nb = Math.floor(Math.random() * (15 - 8) + 8);
      var inputs = [];
      for(var i = 0; i<nb; i++) {
        // Les nombres sont entre 0 et 99
        inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
      }
      var outputs = [];
      for(var i = 0; i<nb-1; i+=2) {
        outputs.push(inputs[i]+inputs[i+1])
      }
      this.outputs = inputs;
      return inputs;
    },
    outputs : []
},
{
  memory : [1, 0, null, null],
  inputsGenerator : function () {
    inputs = ['a', 'b', 'c'];
    this.outputs = inputs;
    return inputs;
  },
  output : []
}
];
