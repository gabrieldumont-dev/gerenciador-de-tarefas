import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import moment from 'moment';
import { BlobOptions } from 'node:buffer';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './tarefas.component.html',
  styleUrl: './tarefas.component.scss'
})
export class TarefasComponent {

  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit(){
    moment.locale('pt-br')
    this.dataService.verificarLogin('')
    this.onGetTarefas()
  }

  conta: any = JSON.parse(this.dataService.conta)

  pageSelect: string = "Atribuído"
  
  dataHoje: any = moment().format("YYYY-MM-DD HH:mm")

  tarefa: any = {}

  tarefasHoje: any            = []
  tarefasEstaSemana: any      = []
  tarefasProximaSemana: any   = []
  tarefasDepois: any          = []
  tarefasAntecedencia: any    = []
  tarefasSemanaPassada: any   = []
  tarefasAntes: any           = []

  tarefasSelect: any = []

  openHoje: boolean           = false
  openEstaSemana: boolean     = false
  openProximaSemana: boolean  = false
  openDepois: boolean         = false
  openAntecedencia: boolean   = true
  openSemanaPassada: boolean  = false
  openAntes: boolean          = false

  acao: string = ""

  viewAlertaTarefa: boolean   = false
  clickAlerta: boolean        = false
  alertaPequeno: string       = ""
  viewAlertaPequeno: boolean  = false

  onChangeAlertaPequeno(msg: string){
    this.alertaPequeno = msg
    this.viewAlertaPequeno = true
    setTimeout(() => {
      this.viewAlertaPequeno = false
    }, 3000);
  }

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

  onOpenTarefa(tarefa: number){
    if (tarefa == 0){
      if (this.tarefasHoje.length > 0){
        if (this.openHoje){
          this.openHoje = false
        } else {
          this.openHoje = true
        }
      }
    } else if (tarefa == 1){
      if (this.tarefasEstaSemana.length > 0){
        if (this.openEstaSemana){
          this.openEstaSemana = false
        } else {
          this.openEstaSemana = true
        }
      }
    } else if (tarefa == 2){
      if (this.tarefasProximaSemana.length > 0){
        if (this.openProximaSemana){
          this.openProximaSemana = false
        } else {
          this.openProximaSemana = true
        }
      }
    } else if (tarefa == 3){
      if (this.tarefasDepois.length > 0){
        if (this.openDepois){
          this.openDepois = false
        } else {
          this.openDepois = true
        }
      }
    } else if (tarefa == 4){
      if (this.tarefasAntecedencia.length > 0){
        if (this.openAntecedencia){
          this.openAntecedencia = false
        } else {
          this.openAntecedencia = true
        }
      }
    } else if (tarefa == 5){
      if (this.tarefasSemanaPassada.length > 0){
        if (this.openSemanaPassada){
          this.openSemanaPassada = false
        } else {
          this.openSemanaPassada = true
        }
      }
    } else if (tarefa == 6){
      if (this.tarefasAntes.length > 0){
        if (this.openAntes){
          this.openAntes = false
        } else {
          this.openAntes = true
        }
      }
    }
  }

  onNovaTarefa(){
    this.acao = "novaTarefa"
    this.tarefa = {
      id_conta: this.conta._id,
      titulo: "",
      descricao: "",
      data: moment().format("YYYY-MM-DD HH:mm"),
      concluido: false
    }
    this.onChangeAlertaTarefa()
  }

  onSelecionar(){
    if(this.acao == "selecionar"){
      this.acao = ""
      this.tarefasSelect = []
      this.onGetTarefas()
    } else {
      this.acao = "selecionar"
    }
  }

  onSelectTarefa(tarefa: any){
    if (this.acao == "selecionar"){
      if (tarefa.select){
        tarefa.select = false
        if (this.tarefasSelect.length == 1){
          this.acao = ""  
        }
        let i = this.tarefasSelect.findIndex((item: any) => item._id == tarefa._id)
        this.tarefasSelect.splice(i, 1)
      } else {
        tarefa.select = true
        this.tarefasSelect.push(tarefa)
      }
    } else {
      this.acao = ""
      this.tarefa = tarefa
      this.onChangeAlertaTarefa()
    }
  }

  onEditTarefa(){
    this.acao = "novaTarefa"
    this.tarefa = this.tarefasSelect[0]
    this.tarefasSelect = []
    this.onGetTarefas()
    this.onChangeAlertaTarefa()
  }

  onConcluirTarefa(){
    for (let tarefa of this.tarefasSelect){
      if (tarefa.concluido){
        tarefa.concluido = false
      } else {
        tarefa.concluido = true
      }

      this.http.put(`${this.dataService.linkApi}/default/model_Tarefas/${tarefa._id}`, tarefa).subscribe((res: any) => {
        try {
          this.onCancelar()
        } catch (error) {
          console.log(error)
        }
      })
    }
    this.acao = ""
    this.tarefasSelect = []
  }

  onDeleteTarefa(){
    for (let tarefa of this.tarefasSelect){
      this.http.delete(`${this.dataService.linkApi}/default/model_Tarefas/${tarefa._id}`).subscribe((res: any) => {
        try {
          this.onCancelar()
        } catch (error) { 
          console.log(error)
        }
      })
    }
    this.acao = ""
    this.tarefasSelect = []
  }

  onChangePage(page: string){
    this.pageSelect = page
    this.acao = ""
    this.tarefasSelect = []
    this.onGetTarefas()
  }

  onGetTarefas(){
    this.http.get(`${this.dataService.linkApi}/default/model_Tarefas/${this.conta._id}`).subscribe((res: any) => {
      try {
        this.tarefasSelect = []

        this.tarefasHoje          = []
        this.tarefasEstaSemana    = []
        this.tarefasProximaSemana = []
        this.tarefasDepois        = []
        this.tarefasAntecedencia  = []
        this.tarefasSemanaPassada = []
        this.tarefasAntes         = []

        this.openHoje           = false
        this.openEstaSemana     = false
        this.openProximaSemana  = false
        this.openDepois         = false
        this.openAntecedencia   = false
        this.openSemanaPassada  = false
        this.openAntes          = false

        if (this.pageSelect == "Atribuído"){
          res = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD HH:mm") >= this.dataHoje && item.concluido == false)
          res.sort((a: any, b: any) => moment(a.data).diff(moment(b.data)))
        }
        if (this.pageSelect == "Pendente"){
          res = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD HH:mm") < this.dataHoje && item.concluido == false)
          res.sort((a: any, b: any) => moment(a.data).diff(moment(b.data)))
        }
        if (this.pageSelect == "Concluido"){
          res = res.filter((item: any) => item.concluido == true)
          res.sort((a: any, b: any) => moment(a.data).diff(moment(b.data)))
        }

        for (let tarefa of res){
          tarefa.data       = moment(tarefa.data).format("YYYY-MM-DD HH:mm")
          tarefa.data_lista = `${this.dataService.onDiaDaSemana(tarefa.data)}, ${this.dataService.onDia(tarefa.data)} de ${this.dataService.onMes(tarefa.data)} - ${moment(tarefa.data).format("HH:mm")}` 
        }

        this.tarefasHoje  = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD") == moment(this.dataHoje).format("YYYY-MM-DD"))
        
        let inicioSemana        = moment(this.dataHoje).subtract(this.dataService.onDiaDaSemanaPosicao(this.dataHoje), "days").format("YYYY-MM-DD")
        let fimSemana           = moment(inicioSemana).add(6, "days").format("YYYY-MM-DD")
        this.tarefasEstaSemana  = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD") >= inicioSemana && moment(item.data).format("YYYY-MM-DD") <= fimSemana)
        
        let inicioProximaSemana   = moment(fimSemana).add(1, "days").format("YYYY-MM-DD")
        let fimProximaSemana      = moment(inicioProximaSemana).add(6, "days").format("YYYY-MM-DD")
        this.tarefasProximaSemana = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD") >= inicioProximaSemana && moment(item.data).format("YYYY-MM-DD") <= fimProximaSemana)
        
        this.tarefasDepois = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD") > fimProximaSemana)

        this.tarefasAntecedencia = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD") >= moment(this.dataHoje).format("YYYY-MM-DD"))
        
        let fimSemanaPassada      = moment(inicioSemana).subtract(1, "days").format("YYYY-MM-DD")
        let inicioSemanaPassada   =  moment(fimSemanaPassada).subtract(6, "days").format("YYYY-MM-DD")
        this.tarefasSemanaPassada =  res.filter((item: any) => moment(item.data).format("YYYY-MM-DD") >= inicioSemanaPassada && moment(item.data).format("YYYY-MM-DD") <= fimSemanaPassada)

        this.tarefasAntes = res.filter((item: any) => moment(item.data).format("YYYY-MM-DD") < inicioSemanaPassada)

        if (this.tarefasHoje.length > 0){
          this.openHoje = true
        }
        if (this.tarefasEstaSemana.length > 0){
          this.openEstaSemana = true
        }
        if (this.tarefasProximaSemana.length > 0){
          this.openProximaSemana = true
        }
        if (this.tarefasDepois.length > 0){
          this.openDepois = true
        }
        if (this.tarefasSemanaPassada.length > 0){
          this.openSemanaPassada = true
        }
        if (this.tarefasAntes.length > 0){
          this.openAntes = true
        }
        if (this.tarefasAntecedencia.length > 0){
          this.openAntecedencia = true
        }
      } catch (error) {
        console.log(error)
      }
    })
  }

  onPostTarefa(){
    if (this.tarefa.titulo == ""){
      this.onChangeAlertaPequeno("Preencha todos so campos!")
      return
    }

    if (this.tarefa._id == undefined){
        this.http.post(`${this.dataService.linkApi}/default/model_Tarefas`, this.tarefa).subscribe((res: any) => {
          try {
            this.onCancelar()
          } catch (error) {
            console.log(error)
          }
        })
    } else {
      this.http.put(`${this.dataService.linkApi}/default/model_Tarefas/${this.tarefa._id}`, this.tarefa).subscribe((res: any) => {
        try {
          this.onCancelar()
        } catch (error) {
          console.log(error)
        }
      })
    }
  }

  onCancelar(){
    this.onGetTarefas()
    this.viewAlertaTarefa = false
    this.tarefa = {
      id_conta: this.conta._id,
      titulo: "",
      descricao: "",
      data: moment().format("YYYY-MM-DD HH:mm"),
      concluido: false
    }
  }

}
