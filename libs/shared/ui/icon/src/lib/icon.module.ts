import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconRegistry, SvgIconsModule } from '@ngneat/svg-icon';
import { asMenuAllIcon } from './svg/menu-all';
import { asNotificationIcon } from './svg/notification';
import { asSupport2Icon } from './svg/support2';
import { asClockIcon } from './svg/clock';
import { asEditProfileIcon } from './svg/edit-profile';
import { asLogoutIcon } from './svg/logout';
import { asFontIcon } from './svg/font';
import { asLanguageIcon } from './svg/language';
import { asMagicIcon } from './svg/magic';
import { asSettingIcon } from './svg/setting';
import { asSetting2Icon } from './svg/setting-2';
import { asUser2Icon } from './svg/user-2';
import { asSearchIcon } from './svg/search';
import { asNextIcon } from './svg/next';
import { asPrevIcon } from './svg/prev';
import { asMenuAppIcon } from './svg/menu-app';
import { asMenuAction } from './svg/menu-action';
import { asExcel } from './svg/excel';
import { asMenuIcon } from './svg/menu';
import { asFilterIcon } from './svg/filter';
import { asCloseIcon } from './svg/close';
import { asAvatarIcon } from './svg/avatar';
import { asCameraIcon } from './svg/camera';
import { asFileIcon } from './svg/file';
import { asSortDownIcon } from './svg/sort-down';
import { asGoBackIcon } from './svg/go-back';
import { asInfoIcon } from './svg/info';
import { asRefreshIcon } from './svg/refresh';
import { asDragIcon } from './svg/drag';
import { asHomeIcon } from './svg/home';
import { asEditImgIcon } from './svg/edit-img';
import { asImgDefault } from './svg/img-default';
import { asCheckIcon } from './svg/check';
import { asBookIcon } from './svg/book';
import { asArrowRightIcon } from './svg/arrow-right';
import { asHouseIcon } from './svg/house';
import { asCourseIcon } from './svg/course';
import { asWebCourseIcon } from './svg/web-course';
import { asWebLockIcon } from './svg/web-lock';
import { asWebUserIcon } from './svg/web-user';
import { asCartIcon } from './svg/cart';
import { asDeleteCourseIcon } from './svg/delete-course';
import { asWebAttachmentIcon } from './svg/web-attachment';
import { asUploadIcon } from './svg/upload-file';
import { asWebHomeIcon } from './svg/web-home';
import { asWebPhoneIcon } from './svg/web-phone';
import { asWebEmailIcon } from './svg/web-email';
import { asXlsx } from './svg/xlsx';
import { asDocx } from './svg/docx';
import { asTxt } from './svg/txt';
import { asPdf } from './svg/pdf';
import { asPptx } from './svg/pptx';
import { asRar } from './svg/rar';
import { asEyeIcon } from './svg/eye';
import { asZoomInIcon } from './svg/zoom-in';
import { asZoomOutIcon } from './svg/zoom-out';
import { asFileDocBigIcon } from './svg/file-doc-big';
import { asFilePdfBigIcon } from './svg/file-pdf-big';
import { asFileXlsBigIcon } from './svg/file-xls-big';
import { asFilePptBigIcon } from './svg/file-ppt-big';
import { asFileJpgBigIcon } from './svg/file-jpg-big';
import { asFilePngBigIcon } from './svg/file-png-big';
import { asFileZipBigIcon } from './svg/file-zip-big';
import { asFileRazBigIcon } from './svg/file-rar-big';
import { asFileOtherBigIcon } from './svg/file-other-big';
import { asWord } from './svg/word';
import { asExpand } from './svg/expand';
import { asCollapse } from './svg/collapse';
import { asFileExport } from './svg/file-export';
import { asFileExport2 } from './svg/file-export2';
import { asClipBoardIcon } from './svg/clipboard';
import { asFacebookIcon } from './svg/facebook';
import { asInstagramIcon } from './svg/instagram';
import { asCalendarWebIcon } from './svg/calendar-web';
import { asTwitterIcon } from './svg/twitter';
import { asLeftIcon } from './svg/left';
import { asSchoolIcon } from './svg/school';

@NgModule({
    imports: [
        CommonModule,
        SvgIconsModule.forRoot({
            icons: [
                asMenuIcon,
                asMenuAllIcon,
                asMenuAppIcon,
                asNotificationIcon,
                asSupport2Icon,
                asClockIcon,
                asEditProfileIcon,
                asLogoutIcon,
                asFontIcon,
                asLanguageIcon,
                asMagicIcon,
                asSettingIcon,
                asSetting2Icon,
                asUser2Icon,
                asSearchIcon,
                asNextIcon,
                asPrevIcon,
                asMenuAction,
                asExcel,
                asAvatarIcon,
                asCameraIcon,
                asFileIcon,
                asCloseIcon,
                asFilterIcon,
                asInfoIcon,
                asRefreshIcon,
                asDragIcon,
                asSortDownIcon,
                asGoBackIcon,
                asInfoIcon,
                asHomeIcon,
                asEditImgIcon,
                asImgDefault,
                asCheckIcon,
                asBookIcon,
                asArrowRightIcon,
                asHouseIcon,
                asCourseIcon,
                asWebCourseIcon,
                asWebLockIcon,
                asWebUserIcon,
                asWebHomeIcon,
                asWebPhoneIcon,
                asWebEmailIcon,
                asCartIcon,
                asDeleteCourseIcon,
                asWebAttachmentIcon,
                asUploadIcon,
                asXlsx,
                asDocx,
                asTxt,
                asPdf,
                asPptx,
                asRar,
                asEyeIcon,
                asZoomInIcon,
                asZoomOutIcon,
                asFilePdfBigIcon,
                asFileDocBigIcon,
                asFileXlsBigIcon,
                asFilePptBigIcon,
                asFileJpgBigIcon,
                asFilePngBigIcon,
                asFileZipBigIcon,
                asFileRazBigIcon,
                asFileOtherBigIcon,
                asWord,
                asExpand,
                asCollapse,
                asFileExport,
                asFileExport2,
                asClipBoardIcon,
                asFacebookIcon,
                asInstagramIcon,
                asCalendarWebIcon,
                asTwitterIcon,
                asLeftIcon,
                asSchoolIcon,
            ],
        }),
    ],
    exports: [SvgIconsModule],
    providers: [SvgIconRegistry],
})
export class IconModule {}
