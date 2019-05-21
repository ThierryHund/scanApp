import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BarCodeReaderComponent } from './components/bar-code-reader/bar-code-reader.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'scanvideo', component: BarCodeReaderComponent },
  {
      path: '**',
      redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
