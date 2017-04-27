'use strict';

class InvokeCMD {
  constructor(sqz) {
    this.sqz = sqz;

    const lifecycle = [
      'templates:list'
    ];

    this.commands = [
      {
        arg         : ['templates'],
        summary     : 'List all available templates',
        description : '',
        lifecycle   : lifecycle,
        options     : {
        },
        examples    : [
          '',
          '--function MyFunction'
        ]
      }
    ];
  }
}

module.exports = InvokeCMD;
