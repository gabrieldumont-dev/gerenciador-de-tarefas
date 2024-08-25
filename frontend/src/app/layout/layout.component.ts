import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../data.service'

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  constructor(private dataService: DataService) { }

  ngOnInit(){
    this.dataService.verificarLogin('')
  }

  menuAberto: boolean = false

  onChangeMenu(){
    if (this.menuAberto){
      this.menuAberto = false
    } else {
      this.menuAberto = true
    }
  }

  onSair(){
    localStorage.removeItem("loginTarefa")
    this.dataService.verificarLogin("")
  }

}
