const Cite = require('citation-js')


module.exports = function(item, loc) {
    const cit = new Cite(item, {
        format: 'string',
        type: 'bibtex',
    });
    const html = cit.get({
        format: 'string',
        type: 'html',
        style: 'citation-apa',
        append: ' ' + loc,
        lang: 'fr-FR',
    });
    return html;
}