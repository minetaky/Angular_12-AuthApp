import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent  {

  miFormulario: FormGroup = this.fb.group({
    email: [ 'test1@test.com',    [ Validators.required, Validators.email ] ],
    password: [ '123456', [ Validators.required, Validators.minLength(6) ] ]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService ) 
  { }


  login(){

    // this.authService.validarToken()
    // .subscribe( console.log )


    const { email, password } = this.miFormulario.value;  // se extraen los campos del formulario

    this.authService.login( email, password )
      .subscribe( ok => {

        console.log( ok );

        if( ok === true  ){
          this.router.navigateByUrl('/dashboard');
        }else{
          Swal.fire('Error', ok, 'error');
        }
        
      } );
    

  }


}
