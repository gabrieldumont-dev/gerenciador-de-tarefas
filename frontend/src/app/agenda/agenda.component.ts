import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import moment from 'moment';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent {

  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit(){
    moment.locale('pt-br')

    for (let i = 0; i < 7; i++) {
      if (i == this.dataService.onDiaDaSemanaPosicao(this.dataHoje)){
        this.agenda.push({ 
          data: this.dataHoje, 
          ano: this.dataService.onAno(this.dataHoje), 
          mes: this.dataService.onMes(this.dataHoje), 
          dia: this.dataService.onDia(this.dataHoje), 
          diaDaSemana: this.dataService.onDiaDaSemana(this.dataHoje) 
        })
      } else {
        if (i < this.dataService.onDiaDaSemanaPosicao(this.dataHoje)){
          var date = moment(this.dataHoje).subtract(this.dataService.onDiaDaSemanaPosicao(this.dataHoje) - i, "days").format("YYYY-MM-DD")
        } else {
          var date = moment(this.dataHoje).add(i - this.dataService.onDiaDaSemanaPosicao(this.dataHoje), "days").format("YYYY-MM-DD")
        }
        this.agenda.push({ 
          data: date, 
          ano: this.dataService.onAno(date), 
          mes: this.dataService.onMes(date), 
          dia: this.dataService.onDia(date), 
          diaDaSemana: this.dataService.onDiaDaSemana(date) 
        })
      }
    }

    this.onGetTarefas()
  }

  conta: any = JSON.parse(this.dataService.conta)

  dataHoje: any     = moment().format("YYYY-MM-DD")
  dataHoraHoje: any = moment().format("YYYY-MM-DD HH:mm")
  agenda: any       = []

  tarefas: any  = []
  tarefa: any   = {}

  viewAlertaTarefa: boolean   = false
  clickAlerta: boolean        = false

  onChangeAlertaTarefa(){
    if (this.clickAlerta){
      this.clickAlerta = false
    } else {
      if (this.viewAlertaTarefa){
        this.viewAlertaTarefa = false
      } else {
        this.viewAlertaTarefa = true
      }
    }
  }

  onSelectTarefa(tarefa: any){
    this.tarefa = tarefa
    this.onChangeAlertaTarefa()
  }

  onAvancarSemana(){
    for (let i = 0; i < this.agenda.length; i++){
      let newDate = moment(this.agenda[i].data).add(7, "days").format("YYYY-MM-DD")
      this.agenda[i] = { 
        data: newDate, 
        ano: this.dataService.onAno(newDate), 
        mes: this.dataService.onMes(newDate), 
        dia: this.dataService.onDia(newDate), 
        diaDaSemana: this.dataService.onDiaDaSemana(newDate)
      }
    }
  }

  onRetrocederSemana(){
    for (let i = 0; i < this.agenda.length; i++){
      let newDate = moment(this.agenda[i].data).subtract(7, "days").format("YYYY-MM-DD")
      this.agenda[i] = { 
        data: newDate, 
        ano: this.dataService.onAno(newDate), 
        mes: this.dataService.onMes(newDate), 
        dia: this.dataService.onDia(newDate), 
        diaDaSemana: this.dataService.onDiaDaSemana(newDate)
      }
    }
  }

  onGetTarefas(){
    this.http.get(`${this.dataService.linkApi}/default/model_Tarefas/${this.conta._id}`).subscribe((res: any) => {
      try {
        for (let tarefa of res){
          tarefa.data         = moment(tarefa.data).format("YYYY-MM-DD HH:mm")
          tarefa.hora         = moment(tarefa.data).format("HH:mm")
          tarefa.data_agenda  = moment(tarefa.data).format("YYYY-MM-DD")
        }
        this.tarefas = res
      } catch (error) {
        console.log(error)
      }
    })
  }

}
