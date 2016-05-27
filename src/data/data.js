var data = {
  inputs  : [],
  outputs : [],
  levels  : [
    {
      wording : 'Le but de cet exercice est de sortir directement les entrées. Utilisez INPUT pour récupérer une case en entrée et OUTPUT pour la sortir.',
      commands : ['inbox', 'outbox'],
      memory : [],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est 4
        var nb = 4
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
      wording : 'Le but de cet exercice est de sortir les entrés incrémentés de 1.',
      commands : ['inbox', 'outbox', 'jump', 'inc', 'dec', 'copyto', 'copyfrom'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 80
          data.inputs.push(Math.floor(Math.random() * (81 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]+1);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir les entrés incrémentés de 1.',
      commands : ['inbox', 'outbox', 'jump', 'inc', 'dec', 'copyto', 'copyfrom'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 80
          data.inputs.push(Math.floor(Math.random() * (81 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]+1);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir les entrés incrémentés de 1.',
      commands : ['inbox', 'outbox', 'jump', 'inc', 'dec', 'copyto', 'copyfrom'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 80
          data.inputs.push(Math.floor(Math.random() * (81 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]+1);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir les entrés incrémentés de 1.',
      commands : ['inbox', 'outbox', 'jump', 'inc', 'dec', 'copyto', 'copyfrom'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 80
          data.inputs.push(Math.floor(Math.random() * (81 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]+1);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir les entrés incrémentés de 1.',
      commands : ['inbox', 'outbox', 'jump', 'inc', 'dec', 'copyto', 'copyfrom'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 80
          data.inputs.push(Math.floor(Math.random() * (81 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]+1);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir les entrés incrémentés de 1.',
      commands : ['inbox', 'outbox', 'jump', 'inc', 'dec', 'copyto', 'copyfrom'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 80
          data.inputs.push(Math.floor(Math.random() * (81 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]+1);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est d\'additionner les entrées deux à deux.',
      commands : ['inbox', 'outbox', 'jump', 'add', 'sub', 'copyfrom', 'copyto'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        //Le nombre d'input est 6
        var nb = 4;
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 13
          data.inputs.push(Math.floor(Math.random() * (47 - 0) + 3));
        }
        for(var i = 0; i < nb-1; i+=2) {
          data.outputs.push(data.inputs[i]+data.inputs[i+1]);
        }
      }
    },
    {
      wording : 'Le but de cet exercice est de sortir les entrés incrémentés de 1.',
      commands : ['inbox', 'outbox', 'jump', 'inc', 'dec', 'copyto', 'copyfrom'],
      memory : [null,null,null,null],
      inputsGenerator : function () {
        data.inputs = [];
        data.outputs = [];
        // Le nombre d'input est entre 6 et 10
        var nb = Math.floor(Math.random() * (11 - 6) + 6);
        for(var i = 0; i < nb; i++) {
          // Les nombres sont entre 0 et 80
          data.inputs.push(Math.floor(Math.random() * (81 - 0) + 0));
        }
        for(var i = 0; i < nb; i++) {
          if(data.inputs[i] != 0) data.outputs.push(data.inputs[i]+1);
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
      memory : [],
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
