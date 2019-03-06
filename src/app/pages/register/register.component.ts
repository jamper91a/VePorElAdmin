import {AfterViewInit, Component, OnChanges, OnInit, NgZone} from '@angular/core';
import {VePorEl} from '../../../providers/veporel';
import {Util} from '../../../providers/util';
import {Router} from '@angular/router';

declare var $: any;
declare var swal: any;

interface FileReaderEventTarget extends EventTarget {
    result: string;
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;

    getMessage(): string;
}

@Component({
    moduleId: module.id,
    selector: 'app-register',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit, OnChanges, AfterViewInit {
    test: Date = new Date();
    public categories: any;
    public zone;
    public user = {
        username: '',
        password: '',
        names: '',
        last_name: '',
        cellphone: '+57 ',
    };
    public company = {
        name: '',
        user_id: '',
        kind_registration: '',
        kind_company: '',
        cellphone: '+57 ',
        email: '',
        fanpage: '',
        webpage: '',
        description: '',
        domicilios: false,
        categories: [],
        photo: File

    };
    public companyCreated = {
        id: Number,
        name: String,
        user_id: String,
        kind_registration: String,
        kind_company: String,
        cellphone: String,
        email: String,
        fanpage: String,
        webpage: String,
        description: String,
        domicilios: false,
        categories: [],
        camara_comercio: File,
        rut: File,
        photo: File,
        cedula: File,
        referencias_personales: File,
        referencias_bancaria: File,

    };
    public validator: any;

    constructor(private veporel: VePorEl,
                private util: Util,
                private router: Router, ) {
        this.zone = new NgZone({enableLongStackTrace: false});
    }

    checkFullPageBackgroundImage() {
        const $page = $('.full-page');
        const image_src = $page.data('image');

        if (image_src !== undefined) {
            const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>';
            $page.append(image_container);
        }
    }

    readURL(fileInput) {
        const input = fileInput.target;

        $(input).parent().css('border-color', '#0dbf1b');
        const self = this;
        if (input.files && input.files[0]) {

            const reader = new FileReader();
            reader.onload = (function (f) {
                return function (e) {
                    switch (input.id) {
                        case 'photo':
                            if (!input.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
                                self.util.show_toast('Debe serleccionar una imagen', 'danger');
                                $(input).val('');
                                $(input).parent().css('border-color', 'red');
                            } else {
                                self.company.photo = input.files[0];
                            }
                            break;
                        case 'camara_comercio':
                            self.companyCreated.camara_comercio = input.files[0];
                            break;
                        case 'rut':
                            self.companyCreated.rut = input.files[0];
                            break;
                        case 'cedula':
                            self.companyCreated.cedula = input.files[0];
                            break;
                        case 'referencias_personales':
                            self.companyCreated.referencias_personales = input.files[0];
                            break;
                        case 'referencias_bancaria':
                            self.companyCreated.referencias_bancaria = input.files[0];
                            break;
                    }                };
            })(input.files[0]);
            reader.readAsDataURL(input.files[0]);
            return input.files[0];
        } else {
            return null;
        }

    }

    readPhotoURL(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (function (f) {
                return function (e) {
                    $('#photo-preview').attr('src', e.target.result).fadeIn('slow');
                };
            })(input.files[0]);
            reader.readAsDataURL(input.files[0]);
            return input.files[0];
        } else {
            return null;
        }
    }

    ngOnInit() {
        const self = this;

        this.checkFullPageBackgroundImage();
        // Code for the Validator
        this.validator = $('.wizard-card form').validate({
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                names: {
                    required: true,
                },
                last_name: {
                    required: true,
                },
                name: {
                    required: true,
                },
                cellphone: {
                    required: true
                },
                phone: {
                    required: true
                },
                email: {
                    required: true
                },
                fanpage: {
                    required: false
                },
                categories: {
                    required: true
                },
                photo: {
                    required: true
                }
            },

            errorPlacement: function (error, element) {
                console.log(error);
                $(element).parent('div').addClass('has-error');
            }
        });

        // Wizard Initialization
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',

            onNext: function (tab, navigation, index) {
                const $valid = $('.wizard-card form').valid();
                if (!$valid) {
                    this.validator.focusInvalid();
                    return false;
                } else {
                    return true;
                }
            },

            onInit: function (tab, navigation, index) {

                // check number of tabs and fill the entire row
                const $total = navigation.find('li').length;
                let $width = 100 / $total;
                const $wizard = navigation.closest('.wizard-card');

                const $display_width = $(document).width();

                if ($display_width < 600 && $total > 3) {
                    $width = 50;
                }

                navigation.find('li').css('width', $width + '%');
                const $first_li = navigation.find('li:first-child a').html();
                const $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
                $('.wizard-card .wizard-navigation').append($moving_div);

                //    this.refreshAnimation($wizard, index);
                // var total_steps = $wizard.find('li').length;
                const total_steps = $wizard.find('.wizard-navigation li').length;
                let move_distance = $wizard.width() / total_steps;
                const step_width = move_distance;
                move_distance *= index;

                const $current = index + 1;

                if ($current === 1) {
                    move_distance -= 8;
                } else if ($current === total_steps) {
                    move_distance += 8;
                }

                $wizard.find('.moving-tab').css('width', step_width);
                $('.moving-tab').css({
                    'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
                    'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

                });

                $('.moving-tab').css('transition', 'transform 0s');
            },

            onTabClick: function (tab, navigation, index) {

                /*var $valid = $('.wizard-card form').valid();

                if(!$valid){*/
                return false;
                /*} else{
                    return true;
                }*/
            },

            onTabShow: function (tab, navigation, index) {

                const $total = navigation.find('li').length;
                const $current = index + 1;

                const $wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                }

                const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

                setTimeout(function () {
                    $('.moving-tab').text(button_text);
                }, 150);

                const checkbox = $('.footer-checkbox');

                if (index !== 0) {
                    $(checkbox).css({
                        'opacity': '0',
                        'visibility': 'hidden',
                        'position': 'absolute'
                    });
                } else {
                    $(checkbox).css({
                        'opacity': '1',
                        'visibility': 'visible'
                    });
                }

                // this.refreshAnimation($wizard, index);
                // var total_steps = $wizard.find('li').length;
                const total_steps = $wizard.find('.wizard-navigation li').length;
                let move_distance = $wizard.width() / total_steps;
                const step_width = move_distance;
                move_distance *= index;

                if ($current === 1) {
                    move_distance -= 8;
                } else if ($current === total_steps) {
                    move_distance += 8;
                }

                $wizard.find('.moving-tab').css('width', step_width);
                $('.moving-tab').css({
                    'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
                    'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

                });
            }
        });

// Prepare the preview for profile picture
        $('#photo').change(function () {
            self.company.photo = self.readPhotoURL(this);
        });

        $('[data-toggle="wizard-radio"]').click(function () {
            console.log('click');

            const wizard = $(this).closest('.wizard-card');
            wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
            $(this).addClass('active');
            $(wizard).find('[type="radio"]').removeAttr('checked');
            $(this).find('[type="radio"]').attr('checked', 'true');
        });

        $('#select_categories').on('click', '[data-toggle="wizard-checkbox"]', function () {

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).find('[type="checkbox"]').removeAttr('checked');
            } else {
                $(this).addClass('active');
                $(this).find('[type="checkbox"]').attr('checked', 'true');
            }
        });

        /*$('#archivos').on('change', 'input:file',function(){
            self.readURL(this);
            //Cambio el color del borde
            $(this).parent().css('border-color', '#0dbf1b')

        });*/

        $('.set-full-height').css('height', 'auto');

    }

    uploadPhoto(fileInput) {
        this.company.photo = fileInput.target.files[0];
    }

    ngOnChanges() {
        const input = $(this);
        console.log(input);
        if (input.files && input.files[0]) {
            const reader: any = new FileReader();

            reader.onload = function (e) {
                $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    ngAfterViewInit() {
        const self = this;
        this.veporel.get_categories()
            .map(res => res.json())
            .subscribe((result) => {
                if (result) {
                    self.categories = result;
                    setTimeout(function () {
                        $('#categories').selectpicker({
                            size: 6,
                            style: 'btn-info',
                            liveSearch: true,
                            liveSearchNormalize: true,

                        });
                    }, 10);

                }
            });

        $('.wizard-card').each(function () {

            const $wizard = $(this);
            const index = $wizard.bootstrapWizard('currentIndex');
            // this.refreshAnimation($wizard, index);

            // var total_steps = $wizard.find('li').length;
            const total_steps = $wizard.find('.wizard-navigation li').length;
            let move_distance = $wizard.width() / total_steps;
            const step_width = move_distance;
            move_distance *= index;

            const $current = index + 1;

            if ($current === 1) {
                move_distance -= 8;
            } else if ($current === total_steps) {
                move_distance += 8;
            }

            $wizard.find('.moving-tab').css('width', step_width);
            $('.moving-tab').css({
                'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
                'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

            });

            $('.moving-tab').css({
                'transition': 'transform 0s'
            });
        });
    }

    finish() {
        const self = this;
        const $valid = $('.wizard-card form').valid();
        if (!$valid) {
            this.validator.focusInvalid();
            if (this.validator.errorMap.photo !== undefined) {
                self.util.show_toast('Por favor ingrese una ' + this.validator.errorList[0].message, 'danger');
            } else if (this.validator.errorMap.categories !== undefined) {
                self.util.show_toast('Por favor seleccione por lo menos un producto o servicio', 'danger');
                 } else {
                self.util.show_toast('Por favor completar los espacios sombreados con rojo', 'danger');
                 }
        } else {
            const formData = new FormData();
            const userTemp = JSON.stringify(self.user);
            formData.append('user', userTemp);
            for (const propiedad in self.company) {
                if (self.company.hasOwnProperty(propiedad)) {
                    formData.append(propiedad, self.company[propiedad]);
                }
            }
            self.veporel.register(formData)
                .map(res => res.json())
                .subscribe((companyRes) => {
                    self.companyCreated = companyRes;
                    self.util.show_toast('Tu negocio se acaba de crear, ahora alguien de nuestro personal validará los datos', 'success');
                    self.router.navigate(['/']);
                }, (error) => {
                    self.util.show_toast('El correo digitado ya se encuentra registrado', 'danger');
                    return false;
                });
        }



    }

    sendFile(formData) {
        const self = this;
        this.veporel.uploadFileCompany(formData)
            .subscribe((result) => {
                self.util.show_toast('Tu negocio se acaba de crear, ahora alguien de nuestro personal validara los datos', 'success');
            }, (error) => {
                self.util.show_toast('Ocurrio un error al intentar crear el negocio, por favor intentalo más tarde', 'danger');
            });
    }
}
