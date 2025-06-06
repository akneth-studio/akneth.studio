const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('footer year', function () {
  it('should set #year text to current year', function () {
    const html = '<div id="year"></div>';
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    const script = fs.readFileSync(path.join(__dirname, '../public/js/main.js'), 'utf8');
    dom.window.eval(script);
    const yearText = dom.window.document.getElementById('year').textContent;
    assert.strictEqual(yearText, String(new Date().getFullYear()));
  });
});
