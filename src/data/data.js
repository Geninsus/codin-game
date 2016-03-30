var data = {
  inputs  : [],
  outputs : [],
  levels  : [
    {
      wording : 'Le but de cet exercice est d\'additionner les entrées deux à deux.',
      memory : [null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est pair et entre 8 et 14
        var nb = Math.floor(Math.random() * (15 - 8) + 8);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 99
          data.inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
        }
        for(var i = 0; i < nb-1; i += 2) {
          data.outputs.push(data.inputs[i] + data.inputs[i + 1])
        }
      }
    }
  ]
};
