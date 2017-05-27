const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
    it('should generate the correct location object', () => {
        var from = 'Jezus';
        var latitude = 1;
        var longitude = 2;
        var url = 'https://www.google.nl/maps?q=1,2';
        
        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message.from).toBe(from);
        expect(message.url).toBe(url);
    });
});
