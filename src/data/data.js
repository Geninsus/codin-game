var data = [
  {
    memory : [null, null, null, null],
    inputsGenrator : function () {
      inputs = [1, 2, 3, 4, 5];
      this.outputs = inputs;
      return inputs;
    },
    outputs : []
},
{
  memory : [1, 0, null, null],
  inputsGenrator : function () {
    inputs = ['a', 'b', 'c'];
    this.outputs = inputs;
    return inputs;
  },
  output : []
}
];
