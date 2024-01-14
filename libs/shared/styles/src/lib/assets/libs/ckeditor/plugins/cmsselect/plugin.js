var _editor;
CKEDITOR.plugins.add('cmsselect', {
    icons: 'cmsselect',
    init: function (editor) {
        _editor = editor;
        // editor.addCommand('cmsselect', new CKEDITOR.dialogCommand('cmsselectDialog'));
        editor.ui.addButton('cmsselect', {
            label: 'Chọn ảnh',
            command: 'cmsselectDialog',
            toolbar: 'insert',
            icon: this.path + 'images/cmsselect.png',
        });
        // CKEDITOR.dialog.add('cmsselectDialog', this.path + 'dialogs/cmsselect.js');
        editor.addCommand('cmsselectDialog', {
            exec: function (sender) {
                _editor = sender;
                // hiddenUploadElement is not attached to DOM, but it is still possible to `virtually` click into it.
                var hiddenUploadElement = CKEDITOR.dom.element.createFromHtml('<input type="file" accept="image/*" multiple="multiple">');
                hiddenUploadElement.once('change', function (evt) {
                    var targetElement = evt.data.getTarget();
                    if (targetElement.$.files.length) {
                        // Simulate paste event, to support all nice stuff from imagebase (e.g. loaders) (#1730).
                        editor.fire('paste', {
                            method: 'paste',
                            dataValue: '',
                            dataTransfer: new CKEDITOR.plugins.clipboard.dataTransfer({ files: targetElement.$.files }),
                        });
                        cmsselectactionChange(targetElement.$.files);
                    }
                });
                hiddenUploadElement.$.click();
            },
        });
    },
});

function cmsselectactionChange(files) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    var hostname = location.hostname;
    const url = hostname === 'localhost' ? '_config/config.dev.json' : '_config/config.deploy.json';
    fetch(url)
        .then(res => res.json())
        .then(json => {
            // subcrible
            console.log(json);
            let userToken = JSON.parse(localStorage.getItem('jwt-token'));
            fetch(json.apiServer + '/api/v1/Media/Files/UploadFiles?moduleName=ckeditorFolder&&functionName=ckeditorFolder', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + userToken.accessToken,
                },
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data) {
                        var result = data.result;
                        for (var i = 0; i < result.length; i++) {
                            var imgHtml = CKEDITOR.dom.element.createFromHtml(`<img src="${json.mediaServer + '/' + result[i].path}" />`);
                            _editor.insertElement(imgHtml);
                        }
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
}
