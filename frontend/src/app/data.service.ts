import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private router: Router) { }

  ngOnInit(){
    moment.locale('pt-br')
  }

  conta:any = {}
  linkApi: string = "http://localhost:3000"

  verificarLogin(path: string) {
    if(localStorage.getItem("loginTarefa") == null){
      this.onRoute("/")
    } else {
      this.conta = localStorage.getItem("loginTarefa")
      if (path != ""){
        this.onRoute(path)
      }
    }
  }

  onAno(date: string){
    return moment(date).format("YYYY")
  }
  
  onMes(date: string){
    switch (moment(date).format("MMMM")){
      case "January":
        return "Janeiro";
      case "February":
          return "Fevereiro";
      case "March":
          return "Março";
      case "April":
          return "Abril";
      case "May":
          return "Maio";
      case "June":
          return "Junho";
      case "July":
          return "Julho";
      case "August":
          return "Agosto";
      case "September":
          return "Setembro";
      case "October":
          return "Outubro";
      case "November":
          return "Novembro";
      case "December":
          return "Dezembro";
      default:
          return "Mês inválido";
    }
  }

  onDia(date: string){
    return moment(date).format("DD")
  }

  onDiaDaSemana(date: string){
    switch (moment(date).format("dddd")) {
      case "Sunday":
          return "Domingo"
      case "Monday":
          return "Segunda-feira"
      case "Tuesday":
          return "Terça-feira"
      case "Wednesday":
          return "Quarta-feira"
      case "Thursday":
          return "Quinta-feira"
      case "Friday":
          return "Sexta-feira"
      case "Saturday":
          return "Sábado"
      default:
        return 
    }
  }

  onDiaDaSemanaPosicao(date: string){
    switch (moment(date).format("dddd")) {
      case "Sunday":
        return 0
      case "Monday":
        return 1
      case "Tuesday":
        return 2
      case "Wednesday":
          return 3
      case "Thursday":
          return 4
      case "Friday":
          return 5
      case "Saturday":
          return 6
      default:
        return 0
    }
  }

  onRoute(path: string) {
    this.router.navigate([path]);
  }

}
