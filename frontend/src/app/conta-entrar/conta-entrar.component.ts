import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-conta-entrar',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './conta-entrar.component.html',
  styleUrl: './conta-entrar.component.scss'
})
export class ContaEntrarComponent {

  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit(){
    this.dataService.verificarLogin("/layout/agenda")
  }

  conta:any = {
    email: "",
    senha: ""
  }

  alertaPequeno: string       = ""
  viewAlertaPequeno: boolean  = false

  onChangeAlertaPequeno(msg: string){
    this.alertaPequeno = msg
    this.viewAlertaPequeno = true
    setTimeout(() => {
      this.viewAlertaPequeno = false
    }, 3000);
  }

  onCadastrar(){
    this.dataService.onRoute("/conta-cadastrar")
  }

  onEntrar(){
    if (this.conta.email == "" || this.conta.senha == ""){
      this.onChangeAlertaPequeno("Preencha todos os campos!")
      return
    }
    
    this.http.get(`${this.dataService.linkApi}/conta/${this.conta.email}/${this.conta.senha}`).subscribe((res: any) => {
      try {
        if (res._id == undefined){
          this.onChangeAlertaPequeno(res.msg)
        } else {
          localStorage.setItem("loginTarefa", JSON.stringify(res))
          this.dataService.verificarLogin("/layout/agenda")
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

}
