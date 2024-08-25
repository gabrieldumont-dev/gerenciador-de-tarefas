import { Routes } from '@angular/router';
import { ContaEntrarComponent } from './conta-entrar/conta-entrar.component';
import { ContaCadastrarComponent } from './conta-cadastrar/conta-cadastrar.component';
import { LayoutComponent } from './layout/layout.component';
import { AgendaComponent } from './agenda/agenda.component';
import { TarefasComponent } from './tarefas/tarefas.component';

export const routes: Routes = [
    {
        path: "",
        component: ContaEntrarComponent
    },
    {
        path: "conta-cadastrar",
        component: ContaCadastrarComponent
    },
    {
        path: "agenda",
        component: AgendaComponent
    },
    {
        path: "layout",
        component: LayoutComponent,
        children: [
            {
                path: "agenda",
                component: AgendaComponent
            },
            {
                path: "tarefas",
                component: TarefasComponent

            }
        ]
    }
];