import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';


import { environment } from '../../../environments/environment';

import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario(){
    return { ...this._usuario};
  }


  constructor( private http: HttpClient ) { }

  registro( name: string, email: string, password: string ){

    const url = `${ this.baseUrl }/auth/new`;
    const body = { name, email, password }


    return this.http.post<AuthResponse>(url, body ) // Se retorna el observable para que se suscriba quien lo llame
            .pipe(
              tap( ( {  ok, token } ) => { 
                if( ok ){
                  localStorage.setItem('token', token! )
                  
                }
               } ), // Con tap hacemos un efecto secundario antes de que se ejeuten lo demás operadores
              map( resp => resp.ok ), //map nos permite mutar la respuesta, en este caso devuelvo el valor de ok
              catchError( err => of( err.error.msg )) // con of regresamos un observable
            );


  }


  login( email: string, password: string){

    const url = `${ this.baseUrl }/auth`;
    const body = { email, password }


    return this.http.post<AuthResponse>(url, body ) // Se retorna el observable para que se suscriba quien lo llame
            .pipe(
              tap( resp => { 
                if( resp.ok ){
                  localStorage.setItem('token', resp.token! )
                }
               } ), // Con tap hacemos un efecto secundario antes de que se ejeuten lo demás operadores
              map( resp => resp.ok ), //map nos permite mutar la respuesta, en este caso devuelvo el valor de ok
              catchError( err => of( err.error.msg )) // con of regresamos un observable
            );


  }



  validarToken(): Observable<boolean>{
    const url = `${ this.baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '' );

    return this.http.get<AuthResponse>( url, { headers } )
      .pipe(
        map( resp => {
          localStorage.setItem('token', resp.token! )
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!,
            email: resp.email!
          }

          return resp.ok;
        }),
        catchError( err => of( false ) )
      )

  }


  logout(){

    localStorage.clear();

  }





}
