var request   = require('superagent');
var Currency  = require('./currency').Currency;

var StellarTxt = {
  txts : { }
};

StellarTxt.urlTemplates = [
  'https://{{domain}}/stellar.txt',
  'https://www.{{domain}}/stellar.txt',
  'https://stellar.{{domain}}/stellar.txt',
  'http://{{domain}}/stellar.txt',
  'http://www.{{domain}}/stellar.txt',
  'http://stellar.{{domain}}/stellar.txt'
];

/**
 * Gets the stellar.txt file for the given domain
 * @param {string}    domain - Domain to retrieve file from
 * @param {function}  fn - Callback function
 */

StellarTxt.get = function(domain, fn) {
  var self = this;

  if (self.txts[domain]) {
    return fn(null, self.txts[domain]);
  }

  ;(function nextUrl(i) {
    var url = StellarTxt.urlTemplates[i];
    
    if (!url) {
      return fn(new Error('No stellar.txt found'));
    }

    url = url.replace('{{domain}}', domain);
    
    request.get(url, function(err, resp) {
      if (err || !resp.text) {
        return nextUrl(++i);
      }

      var sections = self.parse(resp.text);
      self.txts[domain] = sections;

      fn(null, sections);
    });
  })(0);
};

/**
 * Parse a stellar.txt file
 * @param {string}  txt - Unparsed stellar.txt data
 */

StellarTxt.parse = function(txt) {
  var currentSection = '';
  var sections = { };
  
  txt = txt.replace(/\r?\n/g, '\n').split('\n');

  for (var i = 0, l = txt.length; i < l; i++) {
    var line = txt[i];

    if (!line.length || line[0] === '#') {
      continue;
    }

    if (line[0] === '[' && line[line.length - 1] === ']') {
      currentSection = line.slice(1, line.length - 1);
      sections[currentSection] = [];
    } else {
      line = line.replace(/^\s+|\s+$/g, '');
      if (sections[currentSection]) {
        sections[currentSection].push(line);
      }
    }
  }

  return sections;
};

/**
 * extractDomain
 * attempt to extract the domain from a given url
 * returns the url if unsuccessful
 * @param {Object} url
 */

StellarTxt.extractDomain = function (url) {
  match = /[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?([^.\?][^\?.]+?)?$/.exec(url);
  return match && match[0] ? match[0] : url;
};

/**
 * getCurrencies
 * returns domain, issuer account and currency object
 * for each currency found in the domain's stellar.txt file
 * @param {Object} domain
 * @param {Object} fn
 */

StellarTxt.getCurrencies = function(domain, fn) {
  domain = StellarTxt.extractDomain(domain);
  this.get(domain, function(err, txt) {
    if (err) {
      return fn(err);  
    }
    
    if (err || !txt.currencies || !txt.accounts) {
      return fn(null, []);
    }
    
    //NOTE: this won't be accurate if there are
    //multiple issuer accounts with different 
    //currencies associated with each.
    var issuer     = txt.accounts[0];
    var currencies = [];
    
    txt.currencies.forEach(function(currency) {
      currencies.push({
        issuer   : issuer,
        currency : Currency.from_json(currency),
        domain   : domain
      });
    });
    
    fn(null, currencies);
  });
}; 

exports.StellarTxt = StellarTxt;
