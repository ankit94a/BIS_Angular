import { Component, OnInit } from '@angular/core';
import { ChartListModel } from 'projects/sharedlibrary/src/model/smart-analysis.model';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';

@Component({
  selector: 'app-smart-analysis1',
  imports: [SharedLibraryModule],
  templateUrl: './smart-analysis1.component.html',
  styleUrl: './smart-analysis1.component.scss'
})
export class SmartAnalysis1Component implements OnInit{
  fmnList: string[] = ["33 Corps", "27 Mtn Div", "17 Mtn Div", "111 Sub Area", "20 Mtn Div", "3 Corps", "2 Mtn Div", "56 Mtn Div", "57 Mtn Div", "4 Corps", "5 Mtn Div", "21 Mtn Div", "71 Mtn Div", "17 Corps", "59 Mtn Div", "23 Mtn Div"];
  sectorList: string[] = ['None', 'PSS', 'MSS', 'Cho_la', 'Doka_la'];
  aspectList: string[] = ['None', 'Svl / Counter Svl', 'Friction / Belligerence', 'Ae Activity', 'Conc of Tps', 'Armr / Arty / AD / Engrs Indn', 'Mob', 'Infra Devp', 'Dumping of WLS', 'Heightened Diplomatic Eng', 'Collapse of Diplomatic Ties', 'Propoganda', 'Internal Issues', 'Cyber', 'Def', 'Interactions'];
  indicatorList: string[] = ['None', 'Placement of addl Svl Eqpt', 'Incr Recce', 'Incr in OP loc', 'Jamming', 'Enhanced Tourist Influx']
  chartList: string[] = ['Monthly', 'Daily', 'Weekly']
  chartListModel: ChartListModel = new ChartListModel();

  constructor(){

  }
  ngOnInit(): void {

  }
}
