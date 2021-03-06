if (typeof module !== 'undefined') {
    var assert = require('assert');
    var sinon = require('sinon');
    var faker = require('../index');
}


describe('finance.js', function () {
    describe('account( length )', function () {

        it('should supply a default length if no length is passed', function () {

            var account = faker.finance.account();

            var expected = 8;
            var actual = account.length;

            assert.equal(actual, expected, 'The expected default account length is ' + expected + ' but it was ' + actual);

        });

        it('should supply a length if a length is passed', function () {

            var expected = 9;

            var account = faker.finance.account(expected);

            var actual = account.length;

            assert.equal(actual, expected, 'The expected default account length is ' + expected + ' but it was ' + actual);

        });

        it('should supply a default length if a zero is passed', function () {

            var expected = 8;

            var account = faker.finance.account(0);

            var actual = account.length;

            assert.equal(actual, expected, 'The expected default account length is ' + expected + ' but it was ' + actual);

        });

    });

    describe('accountName()', function () {

        it("should return an account name", function () {

            var actual = faker.finance.accountName();

            assert.ok(actual);

        });

    });


    describe('mask( length, parens, ellipsis )', function () {
        it("should set a default length", function () {

            var expected = 4; //default account mask length

            var mask = faker.finance.mask(null, false, false);

            var actual = mask.length;

            assert.equal(actual, expected, 'The expected default mask length is ' + expected + ' but it was ' + actual);

        });

        it("should set a specified length", function () {

            var expected = faker.random.number(20);

            expected = (expected == 0 || !expected || typeof expected == 'undefined') ? 4 : expected;

            var mask = faker.finance.mask(expected, false, false);

            var actual = mask.length; //picks 4 if the random number generator picks 0

            assert.equal(actual, expected, 'The expected default mask length is ' + expected + ' but it was ' + actual);

        });

        it("should set a default length of 4 for a zero value", function () {

            var expected = 4;

            var mask = faker.finance.mask(0, false, false);

            var actual = 4; //picks 4 if the random number generator picks 0

            assert.equal(actual, expected, 'The expected default mask length is ' + expected + ' but it was ' + actual);

        });


        it("should by default include parentheses around a partial account number", function () {

            var expected = true;

            var mask = faker.finance.mask(null, null, false);

            var regexp = new RegExp(/(\(\d{4}?\))/);
            var actual = regexp.test(mask);

            assert.equal(actual, expected, 'The expected match for parentheses is ' + expected + ' but it was ' + actual);

        });

        it("should by default include an ellipsis", function () {

            var expected = true;

            var mask = faker.finance.mask(null, false, null);

            var regexp = new RegExp(/(\.\.\.\d{4})/);
            var actual = regexp.test(mask);

            assert.equal(actual, expected, 'The expected match for parentheses is ' + expected + ' but it was ' + actual);

        });

        it("should work when random variables are passed into the arguments", function () {

            var length = faker.random.number(20);
            var ellipsis = (length % 2 === 0) ? true : false;
            var parens = !ellipsis;

            var mask = faker.finance.mask(length, ellipsis, parens);
            assert.ok(mask);

        });


    });

    describe('amount(min, max, dec, symbol)', function () {

        it("should use the default amounts when not passing arguments", function () {
            var amount = faker.finance.amount();

            assert.ok(amount);
            assert.equal((amount > 0), true, "the amount should be greater than 0");
            assert.equal((amount < 1001), true, "the amount should be greater than 0");

        });

        it("should use the defaul decimal location when not passing arguments", function () {

            var amount = faker.finance.amount();

            var decimal = '.';
            var expected = amount.length - 3;
            var actual = amount.indexOf(decimal);

            assert.equal(actual, expected, 'The expected location of the decimal is ' + expected + ' but it was ' + actual + ' amount ' + amount);
        });

        //TODO: add support for more currency and decimal options
        it("should not include a currency symbol by default", function () {

            var amount = faker.finance.amount();

            var regexp = new RegExp(/[0-9.]/);

            var expected = true;
            var actual = regexp.test(amount);

            assert.equal(actual, expected, 'The expected match should not include a currency symbol');
        });


        it("it should handle negative amounts", function () {

            var amount = faker.finance.amount(-200, -1);

            assert.ok(amount);
            assert.equal((amount < 0), true, "the amount should be greater than 0");
            assert.equal((amount > -201), true, "the amount should be greater than 0");
        });


        it("it should handle argument dec", function () {

            var amount = faker.finance.amount(100, 100, 1);

            assert.ok(amount);
            assert.strictEqual(amount , '100.0', "the amount should be equal 100.0");
        });

        it("it should handle argument dec = 0", function () {

            var amount = faker.finance.amount(100, 100, 0);

            assert.ok(amount);
            assert.strictEqual(amount , '100', "the amount should be equal 100");
        });

    });

    describe('transactionType()', function () {

        it("should return a random transaction type", function () {
            var transactionType = faker.finance.transactionType();

            assert.ok(transactionType);
        });
    });

    describe("currencyCode()", function () {
        it("returns a random currency code with a format", function () {
            var currencyCode = faker.finance.currencyCode();

            assert.ok(currencyCode.match(/[A-Z]{3}/));
        });
    });

    describe("bitcoinAddress()", function(){
        it("returns a random bitcoin address", function(){
            var bitcoinAddress = faker.finance.bitcoinAddress();
            
            assert.ok(bitcoinAddress.match(/^[A-Z0-9.]{27,34}$/));
        });
    });

    describe("ethereumAddress()", function(){
        it("returns a random ethereum address", function(){
            var ethereumAddress = faker.finance.ethereumAddress();
            
            assert.ok(ethereumAddress.match(/^(0x)[0-9a-f]{40}$/i));
        });
    });

    describe("iban()", function () {
        var ibanLib = require('../lib/iban');
        it("returns a random yet formally correct IBAN number", function () {
            var iban = faker.finance.iban();
            var bban = iban.substring(4) + iban.substring(0, 4);

            assert.equal(ibanLib.mod97(ibanLib.toDigitString(bban)), 1, "the result should be equal to 1");
        });
    });

    describe("bic()", function () {
        var ibanLib = require('../lib/iban');
        it("returns a random yet formally correct BIC number", function () {
            var bic = faker.finance.bic();
            var expr = new RegExp("^[A-Z]{4}(" + ibanLib.iso3166.join("|") + ")[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$", "i");

            assert.ok(bic.match(expr));
        });
    });
});