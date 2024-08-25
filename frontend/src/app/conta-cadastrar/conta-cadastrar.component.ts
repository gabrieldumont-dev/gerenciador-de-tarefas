import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

@Component({
  selector: 'app-conta-cadastrar',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './conta-cadastrar.component.html',
  styleUrl: './conta-cadastrar.component.scss'
})
export class ContaCadastrarComponent {

  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit(){
    
  }

  conta: any = {
    nome: "",
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

  onEntrar(){
    this.dataService.onRoute("/")
  }

  onCadastrar(){
    if (this.conta.nome == "" || this.conta.email == "" || this.conta.senha == ""){
      this.onChangeAlertaPequeno("Preencha todos os campos!")
      return
    }
    
    this.http.post(`${this.dataService.linkApi}/conta`, this.conta).subscribe((res: any) => {
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
