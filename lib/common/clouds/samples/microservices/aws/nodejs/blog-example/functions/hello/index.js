'use strict';

export default (event, context, callback) => {
    console.log('event:', event);
    console.log('context:', context);
    console.log('env:', process.env);
    callback(null, { msg : 'hello there !!!' });
}