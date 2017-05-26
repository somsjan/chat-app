const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        var from = 'Jezus';
        var text = "text van Jezus";
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message.from).toBe(from);
        expect(message.text).toBe(text);
    });
});
