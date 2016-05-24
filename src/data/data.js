var data = {
  inputs  : [],
  outputs : [],
  levels  : [
    {
      wording : 'Le but de cet exercice est de sortir directement les entrées. Utilisez INPUT pour récupérer une case en entrée et OUTPUT pour la sortir.',
      commands : ['inbox', 'outbox', 'jump', 'copyto', 'copyfrom', 'add'],
      memory : [null,null,null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 99
          data.inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          data.outputs.push(data.inputs[i])
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir directement les entrées sauf les zéros.',
      commands : ['inbox', 'outbox', 'jumpz'],
      memory : [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = 2;
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 99
          data.inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir directement les entrées.',
      commands : ['inbox', 'outbox'],
      memory : [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        //var nb = Math.floor(Math.random() * (11 - 6) + 6);
        var nb = 2;
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 99
          data.inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          data.outputs.push(data.inputs[i])
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir directement les entrées.',
      commands : ['inbox', 'outbox'],
      memory : [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        //var nb = Math.floor(Math.random() * (11 - 6) + 6);
        var nb = 2;
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 99
          data.inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          data.outputs.push(data.inputs[i])
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir directement les entrées.',
      commands : ['inbox', 'outbox'],
      memory : [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        //var nb = Math.floor(Math.random() * (11 - 6) + 6);
        var nb = 2;
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 99
          data.inputs.push(Math.floor(Math.random() * (100 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          data.outputs.push(data.inputs[i])
        }
      }
    }
  ]
};
