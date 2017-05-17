import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AccordionModule, TreeModule, ContextMenuModule, DataTableModule, SharedModule, TabViewModule, MenubarModule, DialogModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectionService } from './services/connections.service';

import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
 import { ENV_PROVIDERS } from './environment';
 import { ROUTES } from './app.routes';
 // App is our top level component
 import { AppComponent } from './components/app.component';
 import { APP_RESOLVER_PROVIDERS } from './app.resolver';

 import { HomeComponent } from './components/home/home.component';
 import { NavBarComponent } from './components/navbar/navbar.component';
 import { FooterComponent } from './components/footer/footer.component';
 import { TreeExplorerComponent } from './components/tree-explorer/tree-explorer.component';
 import { TableViewerComponent } from './components/table-viewer/table-viewer.component';
 // import '../styles/headings.css';

 // Application wide providers
 const APP_PROVIDERS = [
 ...APP_RESOLVER_PROVIDERS
 ];

 type StoreType = {
   restoreInputValues: () => void,
   disposeOldHosts: () => void
 };

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
 @NgModule({
   bootstrap: [ AppComponent ],
   declarations: [
   AppComponent,
   HomeComponent,
   NavBarComponent,
   FooterComponent,
   TreeExplorerComponent,
   TableViewerComponent
   ],
   imports: [ // import Angular's modules
   BrowserModule,
   FormsModule,
   HttpModule,
   BrowserAnimationsModule,
   AccordionModule,
   TreeModule,
   ContextMenuModule,
   DataTableModule,
   SharedModule,
   TabViewModule,
   MenubarModule,
   DialogModule,
   // RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
   ],
   providers: [ // expose our Services and Providers into Angular's dependency injection
   ENV_PROVIDERS,
   APP_PROVIDERS,
   ConnectionService
   ]
 })
 export class AppModule {

   constructor(
     public appRef: ApplicationRef
     ) {}

 }
