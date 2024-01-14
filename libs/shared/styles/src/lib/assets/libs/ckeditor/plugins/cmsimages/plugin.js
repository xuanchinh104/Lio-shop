var _editor;
var BASE_URL_APIMEDIA = 'http://cms.epmt.com.vn:2051/api/cmd/v1/Media/Upload';
var MODAL_MEDIA_UPLOAD = 'modal-media-upload';
var BASE_POPUP = '#base-popup';
var BASE_FILE_EXTEND_LOAD = 'all';
CKEDITOR.plugins.add('cmsimages', {
    icons: 'cmsimages',
    init: function (editor) {
        _editor = editor;
        editor.ui.addButton('cmsimages', {
            label: 'Chọn ảnh',
            command: 'insertCmsimages',
            toolbar: 'insert',
            icon: this.path + 'images/cmsimages.png',
        });

        editor.addCommand('insertCmsimages', {
            exec: function (sender) {
                showPopupImageBrowser();
            },
        });
    },
});

function buildUrl(base, value) {
    var sep = base.indexOf('?') > -1 ? '&' : '?';
    return base;
}

function showPopupImageBrowser() {
    $(BASE_POPUP).val('upload_callback');
    $(BASE_POPUP).attr('data-callback', 'appendCmsImage');
    BASE_FILE_EXTEND_LOAD = 'image';
    $('#media-attachment-filters').val(BASE_FILE_EXTEND_LOAD);
    // cmsUpload.loadFiles({ typeFile: BASE_FILE_EXTEND_LOAD });
    // cmsUpload.setEventSelect(true);
    // cmsPopup.modalShow(MODAL_MEDIA_UPLOAD);
    return false;
}

function appendCmsImage(fileObj) {
    var formData = new FormData();
    var id = fileObj.id;
    var file = fileObj.file;
    var fileName = fileObj.name;
    var url = buildUrl(BASE_URL_APIMEDIA + file, '');
    var urlFull = buildUrl(BASE_URL_APIMEDIA + file, '');
    var urlAddImage = '';
    var model = { TenFile: file, TenAnh: fileName };
    formData.append(fileObj);

    var cms_content_images = new CKEDITOR.dom.element('div');
    var image = new CKEDITOR.dom.element('img');
    image.setAttributes({
        src: urlFull,
        alt: model.TenFile,
        class: 'img-responsive',
    });
    cms_content_images.addClass('cms-content-images');
    cms_content_images.append(image);
    _editor.insertElement(cms_content_images);
}
