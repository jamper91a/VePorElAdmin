import { Component, OnInit } from '@angular/core';
import { VePorEl } from '../../../providers/veporel';
import {Util} from '../../../providers/util';
import {Router} from '@angular/router';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'recover-cmp',
    templateUrl: './recover.component.html'
})

export class RecoverComponent implements OnInit {
    public body = {
        username: '',
        password: '',
        confirmPassword: '',
        code: 0
    };
    public restore: number;
    public code: number;
    public validator: any;
    public validator2: any;

    constructor(
        private veporel: VePorEl,
        private util: Util,
        ) {
        this.restore = 1;
    }

    checkFullPageBackgroundImage() {
        const $page = $('.full-page');
        const image_src = $page.data('image');

        if (image_src !== undefined) {
            const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>';
            $page.append(image_container);
        }
    }
    ngOnInit() {
        this.checkFullPageBackgroundImage();

    }
    sendCode() {
        this.validator2 = $('#form_restore').validate({
            rules: {
                username: {
                    required: true
                }
            },

            errorPlacement: function(error, element) {
                $(element).parent('div').addClass('has-error');
            }
        });
        const $valid = $('#form_restore').valid();
        if (!$valid) {
            this.validator2.focusInvalid();
        } else {
            const self = this;
            this.veporel.recovery_password(this.body.username)
            .map(res => res.json())
            .subscribe((result) => {
                self.util.show_toast(
                    'Enviamos a su correo el codigo de restauración, porfavor digitelo para cambiar la contraseña',
                    'success');
            }, (error) => {
                self.util.show_toast('El correo digitado no se encuentra registrado', 'danger');
            }
            );
        }
    }
    savePassword() {
        this.validator = $('#form_restore_code').validate({
            rules: {
                code: {
                    required: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirmPassword: {
                    required: true,
                    minlength: 6
                },
                username: {
                    required: true,
                },
            },

            errorPlacement: function(error, element) {
                $(element).parent('div').addClass('has-error');
            }
        });
        const $valid = $('#form_restore_code').valid();
        if (!$valid) {
            this.validator.focusInvalid();
        } else {
            if (this.body.password === this.body.confirmPassword) {
                const self = this;
                this.veporel.reset_password(self.body.username, self.body.code, self.body.password)
                .map(res => res.json())
                .subscribe((result) => {
                    self.util.show_toast('Contraseña modificada, ahora puede iniciar sesión.', 'success');
                }, (error) => {
                    self.util.show_toast('El correo electronico y el codigo no coinciden', 'danger');
                }
                );

            }
        }
    }
}
