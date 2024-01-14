/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

var mathElements = [
    'math',
    'maction',
    'maligngroup',
    'malignmark',
    'menclose',
    'merror',
    'mfenced',
    'mfrac',
    'mglyph',
    'mi',
    'mlabeledtr',
    'mlongdiv',
    'mmultiscripts',
    'mn',
    'mo',
    'mover',
    'mpadded',
    'mphantom',
    'mroot',
    'mrow',
    'ms',
    'mscarries',
    'mscarry',
    'msgroup',
    'msline',
    'mspace',
    'msqrt',
    'msrow',
    'mstack',
    'mstyle',
    'msub',
    'msup',
    'msubsup',
    'mtable',
    'mtd',
    'mtext',
    'mtr',
    'munder',
    'munderover',
    'semantics',
    'annotation',
    'annotation-xml',
];

// CKEDITOR.plugins.addExternal('ckeditor_wiris', '../ckeditor/wiris/mathtype-ckeditor4/plugin.js');
CKEDITOR.plugins.addExternal('ckeditor_wiris', '../ckeditor/wiris/mathtype-ckeditor4/plugin.js');
CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.toolbarGroups = [
        { name: 'document', groups: ['mode'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup'],
        },
        {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align'],
        },
        { name: 'links' },
        { name: 'insert' },
        { name: 'others' },
        { name: 'styles' },
        { name: 'colors' },
        { name: 'tools' },
        { name: 'justify' },
    ];
    // FMathEditor,mathedit
    config.extraPlugins = 'widget,basicstyles,font,dialogui,dialog,cmsselect,ckeditor_wiris';
    config.height = 300;
    config.removeButtons =
        'Iframe,Strike,Save,NewPage,Preview,Print,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Blockquote,CreateDiv';
    config.removePlugins = 'flashupload,basket,exportpdf';

    config.mathJaxLib = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML';
    config.mathJaxClass = 'equation';
    // config.extraAllowedContent = mathElements.join( ' ' ) + '(*)[*]{*};img[data-mathml,data-custom-editor,role](Wirisformula)'
    config.allowedContent = true;
    config.protectedSource.push(/<i[^>]*><\/i>/g);
};
