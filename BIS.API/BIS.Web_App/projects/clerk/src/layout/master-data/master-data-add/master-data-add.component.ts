import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BISDialogTitleComponent } from 'projects/sharedlibrary/src/component/edusynk-dialog-title/edusynk-dialog-title.component';
import { EnemyLocation, masterData, MasterInputLevels, MasterLoc, MasterSector, Source } from 'projects/sharedlibrary/src/model/masterdata.model';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApiService } from 'projects/sharedlibrary/src/services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedLibraryModule } from 'projects/sharedlibrary/src/shared-library.module';
import { MatStepperModule } from '@angular/material/stepper';
import { BISMatDialogService, } from 'projects/sharedlibrary/src/services/insync-mat-dialog.service';
import { MasterDataComponent } from '../master-data-list/master-data.component';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'projects/sharedlibrary/src/services/auth.service';
import { Aspect, Indicator } from 'projects/sharedlibrary/src/model/attribute.model';

@Component({
  selector: 'app-master-data-add',
  imports: [SharedLibraryModule, MatStepperModule,MatDatepickerModule,RouterModule ],
  templateUrl: './master-data-add.component.html',
  styleUrl: './master-data-add.component.scss',
  providers: [
    DatePipe
  ]
})
export class MasterDataAddComponent implements OnInit {
  aspectList:Aspect[]=[]
  createData;
  isEdit = false;
  // fmnList: string[] = ["33 Corps", "27 Mtn Div", "17 Mtn Div", "111 Sub Area", "20 Mtn Div", "3 Corps", "2 Mtn Div", "56 Mtn Div", "57 Mtn Div", "4 Corps", "5 Mtn Div", "21 Mtn Div", "71 Mtn Div", "17 Corps", "59 Mtn Div", "23 Mtn Div"];
  fmnList: string[] = []
  
  sectorList = [];
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  selectedValue: string = '';  // To hold the selected value from the dropdown
  // sectordropdownItems: any[] = [];
  // sourcedropdownItems: any[] = [];
  // enLocdropdownItems: any[] = [];
  // sourceLocdropdownItems: any[] = [];
  // typeOfLocdropdownItems: any[] = [];
  // selected = 'any';
  // selectedType = 'Svl / Counter Svl';
  // subselectedType = 'any';
  subselected = 'Svl / Counter Svl';
  router = inject(Router);
  route = inject(ActivatedRoute);
  // improvement
  indicatorSubFieldList=[];
  sectors:MasterSector[] = [];
  inputLevels: MasterInputLevels[] = [];
  sourceList:Source[]=[];
  sourceLoc:MasterLoc[] = [];
  typeOfLoc:MasterLoc[] = [];
  enemyLocations:EnemyLocation[] = [];
  constructor(private authService:AuthService, private apiService: ApiService,private datePipe: DatePipe,private dialogref:MatDialogRef<MasterDataAddComponent>) {
    this.indicators = [];
  }

  getAspect(){
    this.apiService.getWithHeaders('attribute/allaspect').subscribe(res =>{
      if(res){
        this.aspectList = res;
      }
    })
  }
  getIndicator(event){
    debugger
    this.apiService.getWithHeaders('attribute/allIndicator/' + event.value).subscribe(res =>{
      if(res){
        debugger
        this.indicators = res;
      }
    })
  }
  // getIndicatorSubFields(event){
  //   this.apiService.getWithHeaders('attribute/indicatorSubField/' + event.value).subscribe(res =>{
  //     if(res){
  //       this.indicatorSubFieldList = res;
  //     }
  //   })
  // }
  ngOnInit(): void {
    this.createData = this.formBuilder.group({
      // reportedDate: ['', Validators.required],
      // masterInputlevelID:[0],
      // masterSectorID:[0],
      // // inputLevelNew: [0],
      // // sectorNew :[0],
      // name: ['', Validators.required],
      // sector: ['', Validators.required],
      // fmn: [0, Validators.required],
      // source: ['', Validators.required],
      // sourceLoc: [''],
      // typeOfLoc: ['', Validators.required],
      // enLocName: ['', Validators.required],
      // aspect: [''],
      inputLevel: ['',],
      reportedDate: ['',],
      masterInputlevelID: [0],
      masterSectorID: [0],
      // inputLevelNew: [0],
      // sectorNew :[0],
      name: ['',],
      sector: ['',],
      fmn: [0,],
      source: ['',],
      sourceLoc: [''],
      typeOfLoc: ['',],
      enLocName: ['',],
      aspect: [''],
      indicator: [''],
      typeSvlEqpt: [''],
      noSvlEqpt: [''],
      poaseReamrks: [''],
      irRemarks: [''],
      iolRemarks: [''],
      htM: [''],
      tgt: [''],
      visSrOffrs: [''],
      ptls: [''],
      newTps: [''],
      cvys: [''],
      obsn: [''],
      type: [''],
      timeFrom: [''],
      timeTo: [''],
      jammingEqpt: [''],
      jammingTimefrom: [''],
      jammingTimeto: [''],
      jammingDtOfJx: [''],
      jammingEffect: [''],
      jammingSpecificationFreq: [''],
      jammingSpecificationWavelength: [''],
      jammingSpecificationType: [''],
      jammingRemarks: [''],
      etiNoOfTourists: [''],
      etiTimefrom: [''],
      etiTimeto: [''],
      etiFrequencyDaily: [''],
      etiFrequencyWeekly: [''],
      etiFrequencySeasonal: [''],
      foSTimefrom: [''],
      foSTimeto: [''],
      foSSkirmishPurpose: [''],
      foSSkirmishPlaFmn: [''],
      foSSkirmishPlaNoOfPers: [''],
      foSSkirmishPlaNoOfOffrs: [''],
      foSSkirmishPlaNoOfJcos: [''],
      foSSkirmishPlaNoOfOr: [''],
      foSSkirmishPlaNoOfCiv: [''],
      foSSkirmishPlaNameOfOffrs: [''],
      foSCas: [''],
      foSDamageEqpt: [''],
      foSDamageProperty: [''],
      foSLossWpn: [''],
      foSLossAmn: [''],
      foSLossEqpt: [''],
      FoSCasFatal: [''],
      FoSCasNonFatal: [''],
      adzTimefrom: [''],
      adzTimeto: [''],
      adzNoOfPers: [''],
      adzActivity: [''],
      soCUnitType: [''],
      soCNoOfUnits: [''],
      soCOccupiedBy: [''],
      soCNoOfPlaPers: [''],
      soCNoOfCivs: [''],
      soCNoOfRbaPers: [''],
      soCNoOfPapfPers: [''],
      soCNoOfMilitia: [''],
      soCNoOfEqpt: [''],
      soCDescription: [''],
      gaNoOfGraziers: [''],
      gaNoOfAnimals: [''],
      gaNoOfDu: [''],
      gaGrazierDescription: [''],
      arAggressiveRecceNoOfPers: [''],
      arTypeOfPers: [''],
      arAggressiveRecceDescription: [''],
      daiNoOfDrones: [''],
      daiAltM: [''],
      daiTypeOfDrone: [''],
      daiFltPathLocA: [''],
      daiFltPathLocB: [''],
      daiFltPathLocC: [''],
      daiFltPathLocD: [''],
      daiDirnFrom: [''],
      daiDirnTo: [''],
      daiIncursionKms: [''],
      capNoOfAeProximity: [''],
      capTypeOfAeProximity: [''],
      capFltPathLocA: [''],
      capFltPathLocB: [''],
      capFltPathLocC: [''],
      capProximityDirnFrom: [''],
      capProximityDirnTo: [''],
      capIncursionKms: [''],
      capActivity: [''],
      flacNoOfAc: [''],
      flacAltM: [''],
      flacTypeOfAc: [''],
      flacFltPathLocA: [''],
      flacFltPathLocB: [''],
      flacFltPathLocC: [''],
      flacFltPathLocD: [''],
      flacAcDirnFrom: [''],
      flacAcDirnTo: [''],
      flacActivity: [''],
      avNoOfAePlatform: [''],
      avAltM: [''],
      avAirspaceViolationTypeOfAc: [''],
      avFltPathLocA: [''],
      avFltPathLocB: [''],
      avFltPathLocC: [''],
      avFltPathLocD: [''],
      avAirspaceViolationDirnFrom: [''],
      avAirspaceViolationDirnTo: [''],
      avActivity: [''],
      avIncursionKms: [''],
      esfpTypeOfPers: [''],
      esfpStr: [''],
      esfpIden: [''],
      esfpDisposition: [''],
      esfpDispositionRemarks: [''],
      rbuTypeOfPers: [''],
      rbuResBuildUpStr: [''],
      rbuResBuildUpRemarks: [''],
      cavConcOfVehsTypeOfVeh: [''],
      cavConcOfVehsStr: [''],
      cavConcOfVehsIden: [''],
      cavConcOfVehsDisposition: [''],
      cavConcOfVehsDispositionRemarks: [''],
      teTypeOfTrg: [''],
      teTrgExStr: [''],
      teTrgExIden: [''],
      teTrgExDisposition: [''],
      teTrgExDispositionRemarks: [''],
      avnTypeOfVeh: [''],
      avnStr: [''],
      avnIden: [''],
      avnDirnLocA: [''],
      avnDirnLocB: [''],
      avnDirnLocC: [''],
      avnVehsNovMode: [''],
      avnNomenclatureOfRd: [''],
      aglmTypeOfArty: [''],
      aglmTypeOfPlatform: [''],
      aglmStr: [''],
      aglmIden: [''],
      aglmDirnLocA: [''],
      aglmDirnLocB: [''],
      aglmDirnLocC: [''],
      aglmArtyGunsMode: [''],
      aglmNomenclatureOfRd: [''],
      aadTypeOfAmn: [''],
      aadArtyAmnDumpingNoAmnVehs: [''],
      aadRouteLocA: [''],
      aadRouteLocB: [''],
      aadRouteLocC: [''],
      aadArtyAmnDumpingMode: [''],
      aadNomenclatureOfRd: [''],
      ecmTypeOfEqpt: [''],
      ecmEngrColnNovStr: [''],
      ecmIden: [''],
      ecmEngrColnNovRouteLocA: [''],
      ecmEngrColnNovRouteLocB: [''],
      ecmEngrColnNovRouteLocC: [''],
      ecmEngrColnNovMode: [''],
      ecmNomenclatureOfRd: [''],
      cowBilleting: [''],
      cowStorage: [''],
      cowSplConstr: [''],
      bidBdrInfraDevpBilleting: [''],
      bidBdrInfraDevpStorage: [''],
      bidBdrInfraDevpSplConstr: [''],
      bidBdrInfraDevpComnInfra: [''],
      bidBdrInfraDevpRdsCl: [''],
      bidBdrInfraDevpRdsLength: [''],
      bidTypeRd: [''],
      bidBrSpan: [''],
      bidBrCl: [''],
      bidNosOfSettlements: [''],
      bidNoOfHouses: [''],
      diLocs: [''],
      diPdsOhp: [''],
      diPdsWoOhp: [''],
      diWpnPitsOhp: [''],
      diWpnPitsWoOhp: [''],
      diComnTrenchesCovered: [''],
      diComnTrenchesUncovered: [''],
      diConstrBy: [''],
      gaSsSamSiteLocs: [''],
      gaSsNoOfRamps: [''],
      adcmAmnDumpsType: [''],
      adcmAmnDumpsQty: [''],
      abAddlBilletingType: [''],
      abAddlBilletingQty: [''],
      cidTypeOfInfra: [''],
      cidTypeOfInfraDescription: [''],
      cidBdrInfraDevpQty: [''],
      cidFromLoc: [''],
      cidToLoc: [''],
      ctrcTypeOfComnInfra: [''],
      ctrcComnTowerQty: [''],
      ctrcComnTowerRemarks: [''],
      ldNoOfShelters: [''],
      ldModeOfDumping: [''],
      ldLgsDumpingTypeOfLgs: [''],
      ldNoOfVehFol: [''],
      ldNoOfVehSupplies: [''],
      ldNoOfVehAmn: [''],
      ldNoOfVehConstrMtrl: [''],
      ldNoOfTrainsFol: [''],
      ldNoOfTrainsSupplies: [''],
      ldNoOfTrainsAmn: [''],
      ldNoOfTrainsConstrMtrl: [''],
      bsdBrStoresDumpingNoOfVehs: [''],
      bsdBrStoresDumpingDescriptionStores: [''],
      esdEngrStoresDumpingNoOfVehs: [''],
      esdEngrStoresDumpingDescriptionStores: [''],
      ivsaIncrVehsInStgAsTypeOfVeh: [''],
      ivsaIncrVehsInStgAsStr: [''],
      ivsaIden: [''],
      ivsaIncrVehsInStgAsDispositionRemarks: [''],
      ilcIncrLgsCvysStr: [''],
      ilcIden: [''],
      ilcIncrLgsCvysRouteLocA: [''],
      ilcIncrLgsCvysRouteLocB: [''],
      ilcIncrLgsCvysRouteLocC: [''],
      ilcIncrLgsCvysMode: [''],
      ilcNomenclatureOfRd: [''],
      iltIncrLgsTrainsDateFrom: [''],
      iltIncrLgsTrainsDateTo: [''],
      iltNoOfTrainsRoutine: [''],
      iltNoOfTrainsEnhanced: [''],
      iltNoOfTrainsIncr: [''],
      iltRouteOrigin: [''],
      iltRouteDestination: [''],
      iltTypeOfLgs: [''],
      irtIncrRadioTfcDateFrom: [''],
      irtIncrRadioTfcDateTo: [''],
      irtTxnBand: [''],
      irtTypeOfTxn: [''],
      irtNoOfTxns: [''],
      teTypeOfForces: [''],
      teMobTrgExStr: [''],
      teMobTrgExIden: [''],
      teMobTrgExDisposition: [''],
      teMobTrgExEqptOnWheels: [''],
      teMobTrgExActivityTrg: [''],
      teActivityRoutine: [''],
      teHault: [''],
      rlfPermtLocName: [''],
      rlfNewLocName: [''],
      rlfReLocOfForcesDate: [''],
      rlfQuantumTps: [''],
      rlfQuantumAVehs: [''],
      rlfQuantumBVehs: [''],
      rlfQuantumCVehs: [''],
      rlfBilletingType: [''],
      rlfReLocOfForcesIden: [''],
      tmMobTrsoMovStr: [''],
      tmEnFmn: [''],
      tmEnUnit: [''],
      tmTrsoMovRouteLocA: [''],
      tmTrsoMovRouteLocB: [''],
      tmTrsoMovRouteLocC: [''],
      tmTrsoMovMode: [''],
      tmHaltLocA: [''],
      tmHaltLocB: [''],
      tmHaltLocC: [''],
      cidtoiRoadCl: [''],
      cidtoiRailBroadGauge: [''],
      cidtoiRailMetreGauge: [''],
      cidtoiRailRailwaySidings: [''],
      cidtoiRailDescription: [''],
      cidtoiAirLengthAitstrip: [''],
      cidtoiAirNoOfHangers: [''],
      cidtoiAirNoOfHAS: [''],
      cidtoiAirMiscShelters: [''],
      cidtoiBrSpan: [''],
      cidtoiBrWidth: [''],
      cidtoiBrCl: [''],
      cidtoiBrPermt: [''],
      cidtoiBrTemp: [''],
      frmn: [''],

      // new additions
      vLoc: [''],
      vLevel: [''],
      vFromTime: [''],
      vTotime: [''],
      vNoOfIndis: [''],
      bmmLoc: [''],
      bmmLevel: [''],
      bmmFromTime: [''],
      bmmToTime: [''],
      bmmNoOfIndis: [''],
      cLoc: [''],
      cLevel: [''],
      cFromTime: [''],
      cToTime: [''],
      cNoOfIndis: [''],
      aDate: [''],
      aWith: [''],
      aAgenda: [''],
      cDate: [''],
      cWith: [''],
      jvDate: [''],
      jvWith: [''],
      eadLoc: [''],
      eadDate: [''],
      eadTime: [''],
      eadOfCountry: [''],
      cdmLoc: [''],
      cdmDate: [''],
      cdmTime: [''],
      cdmOfCountry: [''],
      rdLoc: [''],
      rdDate: [''],
      rdTime: [''],
      rdFromCountry: [''],
      dapmLoc: [''],
      dapmDate: [''],
      dapmTime: [''],
      dapmTypeOfAgreement: [''],
      caLoc: [''],
      caNoOfLocs: [''],
      caDate: [''],
      caTime: [''],
      mdLoc: [''],
      mdDate: [''],
      mdTime: [''],
      mdTgtAgenda: [''],
      dmpLoc: [''],
      dmpDate: [''],
      dmpTime: [''],
      dmpType: [''],
      dmpLevel: [''],
      mrLoc: [''],
      mrDate: [''],
      mrTime: [''],
      mrType: [''],
      eidLoc: [''],
      eidDate: [''],
      eidTime: [''],
      eidType: [''],
      teLoc: [''],
      teDate: [''],
      teTime: [''],
      teOnWhom: [''],
      teType: [''],
      sLoc: [''],
      sDate: [''],
      sTime: [''],
      sByWhom: [''],
      sOnWhom: [''],
      sType: [''],
      esdLoc: [''],
      esdDate: [''],
      esdTime: [''],
      esdOnWhom: [''],
      tLoc: [''],
      tDate: [''],
      tTime: [''],
      tBywhom: [''],
      tToWhom: [''],
      tType: [''],
      octrLoc: [''],
      octrLocTo: [''],
      octrDate: [''],
      octrTime: [''],
      octrTimeTo: [''],
      puLoc: [''],
      puDate: [''],
      puTime: [''],
      puLevel: [''],
      ruiLoc: [''],
      ruiDate: [''],
      ruiTime: [''],
      ruiLevel: [''],
      fiSector: [''],
      fiDate: [''],
      fiTime: [''],
      hcLoc: [''],
      hcDate: [''],
      hcTime: [''],
      hcType: [''],
      hclLevel: [''],
      hcoLoc: [''],
      hcoDate: [''],
      hcoTime: [''],
      hcoTimeTo: [''],
      hcoTgt: [''],
      hcoLevel: [''],
      tcinLoc: [''],
      tcinDate: [''],
      tcinTime: [''],
      tcinTimeTo: [''],
      tcinTgt: [''],
      htsiLoc: [''],
      htsiNoOfIndis: [''],
      htsiPurpose: [''],
      idsLoc: [''],
      idsDate: [''],
      idsSection: [''],
      ipLoc: [''],
      ipDate: [''],
      ipType: [''],
      ipTypeEqpt_Nos: [''],
      ipTypeArms_Type: [''],
      ipTypeArms_Nos: [''],
      ipTypeAmn_Type: [''],
      ipTypeAmn_Nos: [''],
      ipTypeTech_Type: [''],
      ipTypeTech_Nos: [''],
      ipTypeWLS_Type: [''],
      ipTypeWLS_Nos: [''],
      etrLoc: [''],
      etrDate: [''],
      etrNosRect: [''],
      erLoc: [''],
      erDate: [''],
      erRect: [''],
      fcLoc: [''],
      fcDate: [''],
      fcNosRect: [''],
      ipcLoc: [''],
      ipcDate: [''],
      ipcTimeFrom: [''],
      ipcTimeTo: [''],
      ipcType: [''],
      ipcTypeCommercial_Nos: [''],
      ipcTypeWarship_Type: [''],
      ipcTypeWarship_Nos: [''],
      ipcTypeSvl_Type: [''],
      ipcTypeSvl_Nos: [''],
      maDate: [''],
      maWith: [''],
      maAgenda: [''],
      ieaLoc: [''],
      ieaDate: [''],
      ieaTime: [''],
      ieaTimeTo: [''],
      ieaTypeOfActivity: [''],

      bpmLoc: [''],
      bpmDate: [''],
      bpmBetween: [''],
      bpmTimeFrom: [''],
      bpmTimeTo: [''],
      bpmNpm: [''],
      bpmNpo: [''],
      biLoc: [''],
      biDate: [''],
      biBetween: [''],
      biTimeFrom: [''],
      biTimeTo: [''],
      biNpm: [''],
      biNpo: [''],
      cfvLoc: [''],
      cfvate: [''],
      cfvBetween: [''],
      cfvTimeFrom: [''],
      cfvTimeTo: ['']

    });
    if (this.authService.getDivisionName()) {
      const divisionName = this.authService.getDivisionName();
      this.fmnList.push(divisionName); 
      this.createData.get('frmn')?.setValue(divisionName);
    }
    this.getData();
    
  }
  getData(){
    this.getAspect();
    this.getInputLevel();
    this.getSector();
    this.getSource();
    this.getSourceLoc();
    this.getTypeOfLoc();
    this.getEnLoc();
  }
  getSector() {
    this.apiService.getWithHeaders('MasterData/sector').subscribe(res => {
      if (res) {
        this.sectors = res;
      }
    })
  }

  getSource() {
    this.apiService.getWithHeaders('MasterData/source').subscribe(res => {
      if (res) {
        this.sourceList = res;
      }
    })
  }

  getEnLoc() {
    this.apiService.getWithHeaders('MasterData/enloc').subscribe(res => {
      if (res) {
        this.enemyLocations = res;
      }
    })
  }

  getSourceLoc() {
    this.apiService.getWithHeaders('MasterData/loc/'+true).subscribe(res => {
      if (res) {
        this.sourceLoc = res;
      }
    })
  }

  getTypeOfLoc() {
    this.apiService.getWithHeaders('MasterData/loc/' + false).subscribe(res => {
      if (res) {
        this.typeOfLoc = res;
      }
    })
  }

  save() { 
    const masterData = {
      reportedDate: this.datePipe.transform(this.createData.value.reportedDate, 'yyyy-MM-dd'),
      inputLevel: this.createData.value.inputLevel!,
      sector: this.createData.value.sector!,
      fmn: this.createData.value.fmn!,
      source: this.createData.value.source!,
      sourceLoc: this.createData.value.sourceLoc!,
      typeOfLoc: this.createData.value.typeOfLoc!,
      enLocName: this.createData.value.enLocName!,
      aspect: this.createData.value.aspect!,
      indicator: this.createData.value.indicator!,
      typeSvlEqpt: this.createData.value.typeSvlEqpt!,
      noSvlEqpt: this.createData.value.noSvlEqpt!,
      poaseReamrks: this.createData.value.poaseReamrks!,
      irRemarks: this.createData.value.irRemarks!,
      iolRemarks: this.createData.value.iolRemarks!,
      htM: this.createData.value.htM!,
      tgt: this.createData.value.tgt!,
      visSrOffrs: this.createData.value.visSrOffrs!,
      ptls: this.createData.value.ptls!,
      newTps: this.createData.value.newTps!,
      cvys: this.createData.value.cvys!,
      obsn: this.createData.value.obsn!,
      type: this.createData.value.type!,
      timeFrom: this.createData.value.timeFrom!,
      timeTo: this.createData.value.timeTo!,
      jammingEqpt: this.createData.value.jammingEqpt!,
      jammingTimefrom: this.createData.value.jammingTimefrom!,
      jammingTimeto: this.createData.value.jammingTimeto!,
      jammingDtOfJx: this.createData.value.jammingDtOfJx!,
      jammingEffect: this.createData.value.jammingEffect!,
      jammingSpecificationFreq: this.createData.value.jammingSpecificationFreq!,
      jammingSpecificationWavelength: this.createData.value.jammingSpecificationWavelength!,
      jammingSpecificationType: this.createData.value.jammingSpecificationType!,
      jammingRemarks: this.createData.value.jammingRemarks!,
      etiNoOfTourists: this.createData.value.etiNoOfTourists!,
      etiTimefrom: this.createData.value.etiTimefrom!,
      etiTimeto: this.createData.value.etiTimeto!,
      etiFrequencyDaily: this.createData.value.etiFrequencyDaily!,
      etiFrequencyWeekly: this.createData.value.etiFrequencyWeekly!,
      etiFrequencySeasonal: this.createData.value.etiFrequencySeasonal!,
      foSTimefrom: this.createData.value.foSTimefrom!,
      foSTimeto: this.createData.value.foSTimeto!,
      foSSkirmishPurpose: this.createData.value.foSSkirmishPurpose!,
      foSSkirmishPlaFmn: this.createData.value.foSSkirmishPlaFmn!,
      foSSkirmishPlaNoOfPers: this.createData.value.foSSkirmishPlaNoOfPers!,
      foSSkirmishPlaNoOfOffrs: this.createData.value.foSSkirmishPlaNoOfOffrs!,
      foSSkirmishPlaNoOfJcos: this.createData.value.foSSkirmishPlaNoOfJcos!,
      foSSkirmishPlaNoOfOr: this.createData.value.foSSkirmishPlaNoOfOr!,
      foSSkirmishPlaNoOfCiv: this.createData.value.foSSkirmishPlaNoOfCiv!,
      foSSkirmishPlaNameOfOffrs: this.createData.value.foSSkirmishPlaNameOfOffrs!,
      foSCas: this.createData.value.foSCas!,
      foSDamageEqpt: this.createData.value.foSDamageEqpt!,
      foSDamageProperty: this.createData.value.foSDamageProperty!,
      foSLossWpn: this.createData.value.foSLossWpn!,
      foSLossAmn: this.createData.value.foSLossAmn!,
      foSLossEqpt: this.createData.value.foSLossEqpt!,
      foSCasFatal: this.createData.value.FoSCasFatal!,
      foSCasNonFatal: this.createData.value.FoSCasNonFatal!,
      adzTimefrom: this.createData.value.adzTimefrom!,
      adzTimeto: this.createData.value.adzTimeto!,
      adzNoOfPers: this.createData.value.adzNoOfPers!,
      adzActivity: this.createData.value.adzActivity!,
      soCUnitType: this.createData.value.soCUnitType!,
      soCNoOfUnits: this.createData.value.soCNoOfUnits!,
      soCOccupiedBy: this.createData.value.soCOccupiedBy!,
      soCNoOfPlaPers: this.createData.value.soCNoOfPlaPers!,
      soCNoOfCivs: this.createData.value.soCNoOfCivs!,
      soCNoOfRbaPers: this.createData.value.soCNoOfRbaPers!,
      soCNoOfPapfPers: this.createData.value.soCNoOfPapfPers!,
      soCNoOfMilitia: this.createData.value.soCNoOfMilitia!,
      soCNoOfEqpt: this.createData.value.soCNoOfEqpt!,
      soCDescription: this.createData.value.soCDescription!,
      gaNoOfGraziers: this.createData.value.gaNoOfGraziers!,
      gaNoOfAnimals: this.createData.value.gaNoOfAnimals!,
      gaNoOfDu: this.createData.value.gaNoOfDu!,
      gaGrazierDescription: this.createData.value.gaGrazierDescription!,
      arAggressiveRecceNoOfPers: this.createData.value.arAggressiveRecceNoOfPers!,
      arTypeOfPers: this.createData.value.arTypeOfPers!,
      arAggressiveRecceDescription: this.createData.value.arAggressiveRecceDescription!,
      daiNoOfDrones: this.createData.value.daiNoOfDrones!,
      daiAltM: this.createData.value.daiAltM!,
      daiTypeOfDrone: this.createData.value.daiTypeOfDrone!,
      daiFltPathLocA: this.createData.value.daiFltPathLocA!,
      daiFltPathLocB: this.createData.value.daiFltPathLocB!,
      daiFltPathLocC: this.createData.value.daiFltPathLocC!,
      daiFltPathLocD: this.createData.value.daiFltPathLocD!,
      daiDirnFrom: this.createData.value.daiDirnFrom!,
      daiDirnTo: this.createData.value.daiDirnTo!,
      daiIncursionKms: this.createData.value.daiIncursionKms!,
      capNoOfAeProximity: this.createData.value.capNoOfAeProximity!,
      capTypeOfAeProximity: this.createData.value.capTypeOfAeProximity!,
      capFltPathLocA: this.createData.value.capFltPathLocA!,
      capFltPathLocB: this.createData.value.capFltPathLocB!,
      capFltPathLocC: this.createData.value.capFltPathLocC!,
      capProximityDirnFrom: this.createData.value.capProximityDirnFrom!,
      capProximityDirnTo: this.createData.value.capProximityDirnTo!,
      capIncursionKms: this.createData.value.capIncursionKms!,
      capActivity: this.createData.value.capActivity!,
      flacNoOfAc: this.createData.value.flacNoOfAc!,
      flacAltM: this.createData.value.flacAltM!,
      flacTypeOfAc: this.createData.value.flacTypeOfAc!,
      flacFltPathLocA: this.createData.value.flacFltPathLocA!,
      flacFltPathLocB: this.createData.value.flacFltPathLocB!,
      flacFltPathLocC: this.createData.value.flacFltPathLocC!,
      flacFltPathLocD: this.createData.value.flacFltPathLocD!,
      flacAcDirnFrom: this.createData.value.flacAcDirnFrom!,
      flacAcDirnTo: this.createData.value.flacAcDirnTo!,
      flacActivity: this.createData.value.flacActivity!,
      avNoOfAePlatform: this.createData.value.avNoOfAePlatform!,
      avAltM: this.createData.value.avAltM!,
      avAirspaceViolationTypeOfAc: this.createData.value.avAirspaceViolationTypeOfAc!,
      avFltPathLocA: this.createData.value.avFltPathLocA!,
      avFltPathLocB: this.createData.value.avFltPathLocB!,
      avFltPathLocC: this.createData.value.avFltPathLocC!,
      avFltPathLocD: this.createData.value.avFltPathLocD!,
      avAirspaceViolationDirnFrom: this.createData.value.avAirspaceViolationDirnFrom!,
      avAirspaceViolationDirnTo: this.createData.value.avAirspaceViolationDirnTo!,
      avActivity: this.createData.value.avActivity!,
      avIncursionKms: this.createData.value.avIncursionKms!,
      esfpTypeOfPers: this.createData.value.esfpTypeOfPers!,
      esfpStr: this.createData.value.esfpStr!,
      esfpIden: this.createData.value.esfpIden!,
      esfpDisposition: this.createData.value.esfpDisposition!,
      esfpDispositionRemarks: this.createData.value.esfpDispositionRemarks!,
      rbuTypeOfPers: this.createData.value.rbuTypeOfPers!,
      rbuResBuildUpStr: this.createData.value.rbuResBuildUpStr!,
      rbuResBuildUpRemarks: this.createData.value.rbuResBuildUpRemarks!,
      cavConcOfVehsTypeOfVeh: this.createData.value.cavConcOfVehsTypeOfVeh!,
      cavConcOfVehsStr: this.createData.value.cavConcOfVehsStr!,
      cavConcOfVehsIden: this.createData.value.cavConcOfVehsIden!,
      cavConcOfVehsDisposition: this.createData.value.cavConcOfVehsDisposition!,
      cavConcOfVehsDispositionRemarks: this.createData.value.cavConcOfVehsDispositionRemarks!,
      teTypeOfTrg: this.createData.value.teTypeOfTrg!,
      teTrgExStr: this.createData.value.teTrgExStr!,
      teTrgExIden: this.createData.value.teTrgExIden!,
      teTrgExDisposition: this.createData.value.teTrgExDisposition!,
      teTrgExDispositionRemarks: this.createData.value.teTrgExDispositionRemarks!,
      avnTypeOfVeh: this.createData.value.avnTypeOfVeh!,
      avnStr: this.createData.value.avnStr!,
      avnIden: this.createData.value.avnIden!,
      avnDirnLocA: this.createData.value.avnDirnLocA!,
      avnDirnLocB: this.createData.value.avnDirnLocB!,
      avnDirnLocC: this.createData.value.avnDirnLocC!,
      avnVehsNovMode: this.createData.value.avnVehsNovMode!,
      avnNomenclatureOfRd: this.createData.value.avnNomenclatureOfRd!,
      aglmTypeOfArty: this.createData.value.aglmTypeOfArty!,
      aglmTypeOfPlatform: this.createData.value.aglmTypeOfPlatform!,
      aglmStr: this.createData.value.aglmStr!,
      aglmIden: this.createData.value.aglmIden!,
      aglmDirnLocA: this.createData.value.aglmDirnLocA!,
      aglmDirnLocB: this.createData.value.aglmDirnLocB!,
      aglmDirnLocC: this.createData.value.aglmDirnLocC!,
      aglmArtyGunsMode: this.createData.value.aglmArtyGunsMode!,
      aglmNomenclatureOfRd: this.createData.value.aglmNomenclatureOfRd!,
      aadTypeOfAmn: this.createData.value.aadTypeOfAmn!,
      aadArtyAmnDumpingNoAmnVehs: this.createData.value.aadArtyAmnDumpingNoAmnVehs!,
      aadRouteLocA: this.createData.value.aadRouteLocA!,
      aadRouteLocB: this.createData.value.aadRouteLocB!,
      aadRouteLocC: this.createData.value.aadRouteLocC!,
      aadArtyAmnDumpingMode: this.createData.value.aadArtyAmnDumpingMode!,
      aadNomenclatureOfRd: this.createData.value.aadNomenclatureOfRd!,
      ecmTypeOfEqpt: this.createData.value.ecmTypeOfEqpt!,
      ecmEngrColnNovStr: this.createData.value.ecmEngrColnNovStr!,
      ecmIden: this.createData.value.ecmIden!,
      ecmEngrColnNovRouteLocA: this.createData.value.ecmEngrColnNovRouteLocA!,
      ecmEngrColnNovRouteLocB: this.createData.value.ecmEngrColnNovRouteLocB!,
      ecmEngrColnNovRouteLocC: this.createData.value.ecmEngrColnNovRouteLocC!,
      ecmEngrColnNovMode: this.createData.value.ecmEngrColnNovMode!,
      ecmNomenclatureOfRd: this.createData.value.ecmNomenclatureOfRd!,
      cowBilleting: this.createData.value.cowBilleting!,
      cowStorage: this.createData.value.cowStorage!,
      cowSplConstr: this.createData.value.cowSplConstr!,
      bidBdrInfraDevpBilleting: this.createData.value.bidBdrInfraDevpBilleting!,
      bidBdrInfraDevpStorage: this.createData.value.bidBdrInfraDevpStorage!,
      bidBdrInfraDevpSplConstr: this.createData.value.bidBdrInfraDevpSplConstr!,
      bidBdrInfraDevpComnInfra: this.createData.value.bidBdrInfraDevpComnInfra!,
      bidBdrInfraDevpRdsCl: this.createData.value.bidBdrInfraDevpRdsCl!,
      bidBdrInfraDevpRdsLength: this.createData.value.bidBdrInfraDevpRdsLength!,
      bidTypeRd: this.createData.value.bidTypeRd!,
      bidBrSpan: this.createData.value.bidBrSpan!,
      bidBrCl: this.createData.value.bidBrCl!,
      bidNosOfSettlements: this.createData.value.bidNosOfSettlements!,
      bidNoOfHouses: this.createData.value.bidNoOfHouses!,
      diLocs: this.createData.value.diLocs!,
      diPdsOhp: this.createData.value.diPdsOhp!,
      diPdsWoOhp: this.createData.value.diPdsWoOhp!,
      diWpnPitsOhp: this.createData.value.diWpnPitsOhp!,
      diWpnPitsWoOhp: this.createData.value.diWpnPitsWoOhp!,
      diComnTrenchesCovered: this.createData.value.diComnTrenchesCovered!,
      diComnTrenchesUncovered: this.createData.value.diComnTrenchesUncovered!,
      diConstrBy: this.createData.value.diConstrBy!,
      gaSsSamSiteLocs: this.createData.value.gaSsSamSiteLocs!,
      gaSsNoOfRamps: this.createData.value.gaSsNoOfRamps!,
      adcmAmnDumpsType: this.createData.value.adcmAmnDumpsType!,
      adcmAmnDumpsQty: this.createData.value.adcmAmnDumpsQty!,
      abAddlBilletingType: this.createData.value.abAddlBilletingType!,
      abAddlBilletingQty: this.createData.value.abAddlBilletingQty!,
      cidTypeOfInfra: this.createData.value.cidTypeOfInfra!,
      cidTypeOfInfraDescription: this.createData.value.cidTypeOfInfraDescription!,
      cidBdrInfraDevpQty: this.createData.value.cidBdrInfraDevpQty!,
      cidFromLoc: this.createData.value.cidFromLoc!,
      cidToLoc: this.createData.value.cidToLoc!,
      ctrcTypeOfComnInfra: this.createData.value.ctrcTypeOfComnInfra!,
      ctrcComnTowerQty: this.createData.value.ctrcComnTowerQty!,
      ctrcComnTowerRemarks: this.createData.value.ctrcComnTowerRemarks!,
      ldNoOfShelters: this.createData.value.ldNoOfShelters!,
      ldModeOfDumping: this.createData.value.ldModeOfDumping!,
      ldLgsDumpingTypeOfLgs: this.createData.value.ldLgsDumpingTypeOfLgs!,
      ldNoOfVehFol: this.createData.value.ldNoOfVehFol!,
      ldNoOfVehSupplies: this.createData.value.ldNoOfVehSupplies!,
      ldNoOfVehAmn: this.createData.value.ldNoOfVehAmn!,
      ldNoOfVehConstrMtrl: this.createData.value.ldNoOfVehConstrMtrl!,
      ldNoOfTrainsFol: this.createData.value.ldNoOfTrainsFol!,
      ldNoOfTrainsSupplies: this.createData.value.ldNoOfTrainsSupplies!,
      ldNoOfTrainsAmn: this.createData.value.ldNoOfTrainsAmn!,
      ldNoOfTrainsConstrMtrl: this.createData.value.ldNoOfTrainsConstrMtrl!,
      bsdBrStoresDumpingNoOfVehs: this.createData.value.bsdBrStoresDumpingNoOfVehs!,
      bsdBrStoresDumpingDescriptionStores: this.createData.value.bsdBrStoresDumpingDescriptionStores!,
      esdEngrStoresDumpingNoOfVehs: this.createData.value.esdEngrStoresDumpingNoOfVehs!,
      esdEngrStoresDumpingDescriptionStores: this.createData.value.esdEngrStoresDumpingDescriptionStores!,
      ivsaIncrVehsInStgAsTypeOfVeh: this.createData.value.ivsaIncrVehsInStgAsTypeOfVeh!,
      ivsaIncrVehsInStgAsStr: this.createData.value.ivsaIncrVehsInStgAsStr!,
      ivsaIden: this.createData.value.ivsaIden!,
      ivsaIncrVehsInStgAsDispositionRemarks: this.createData.value.ivsaIncrVehsInStgAsDispositionRemarks!,
      ilcIncrLgsCvysStr: this.createData.value.ilcIncrLgsCvysStr!,
      ilcIden: this.createData.value.ilcIden!,
      ilcIncrLgsCvysRouteLocA: this.createData.value.ilcIncrLgsCvysRouteLocA!,
      ilcIncrLgsCvysRouteLocB: this.createData.value.ilcIncrLgsCvysRouteLocB!,
      ilcIncrLgsCvysRouteLocC: this.createData.value.ilcIncrLgsCvysRouteLocC!,
      ilcIncrLgsCvysMode: this.createData.value.ilcIncrLgsCvysMode!,
      ilcNomenclatureOfRd: this.createData.value.ilcNomenclatureOfRd!,
      iltIncrLgsTrainsDateFrom: this.createData.value.iltIncrLgsTrainsDateFrom!,
      iltIncrLgsTrainsDateTo: this.createData.value.iltIncrLgsTrainsDateTo!,
      iltNoOfTrainsRoutine: this.createData.value.iltNoOfTrainsRoutine!,
      iltNoOfTrainsEnhanced: this.createData.value.iltNoOfTrainsEnhanced!,
      iltNoOfTrainsIncr: this.createData.value.iltNoOfTrainsIncr!,
      iltRouteOrigin: this.createData.value.iltRouteOrigin!,
      iltRouteDestination: this.createData.value.iltRouteDestination!,
      iltTypeOfLgs: this.createData.value.iltTypeOfLgs!,
      irtIncrRadioTfcDateFrom: this.createData.value.irtIncrRadioTfcDateFrom!,
      irtIncrRadioTfcDateTo: this.createData.value.irtIncrRadioTfcDateTo!,
      irtTxnBand: this.createData.value.irtTxnBand!,
      irtTypeOfTxn: this.createData.value.irtTypeOfTxn!,
      irtNoOfTxns: this.createData.value.irtNoOfTxns!,
      teTypeOfForces: this.createData.value.teTypeOfForces!,
      teMobTrgExStr: this.createData.value.teMobTrgExStr!,
      teMobTrgExIden: this.createData.value.teMobTrgExIden!,
      teMobTrgExDisposition: this.createData.value.teMobTrgExDisposition!,
      teMobTrgExEqptOnWheels: this.createData.value.teMobTrgExEqptOnWheels!,
      teMobTrgExActivityTrg: this.createData.value.teMobTrgExActivityTrg!,
      teActivityRoutine: this.createData.value.teActivityRoutine!,
      teHault: this.createData.value.teHault!,
      rlfPermtLocName: this.createData.value.rlfPermtLocName!,
      rlfNewLocName: this.createData.value.rlfNewLocName!,
      rlfReLocOfForcesDate: this.createData.value.rlfReLocOfForcesDate!,
      rlfQuantumTps: this.createData.value.rlfQuantumTps!,
      rlfQuantumAVehs: this.createData.value.rlfQuantumAVehs!,
      rlfQuantumBVehs: this.createData.value.rlfQuantumBVehs!,
      rlfQuantumCVehs: this.createData.value.rlfQuantumCVehs!,
      rlfBilletingType: this.createData.value.rlfBilletingType!,
      rlfReLocOfForcesIden: this.createData.value.rlfReLocOfForcesIden!,
      tmMobTrsoMovStr: this.createData.value.tmMobTrsoMovStr!,
      tmEnFmn: this.createData.value.tmEnFmn!,
      tmEnUnit: this.createData.value.tmEnUnit!,
      tmTrsoMovRouteLocA: this.createData.value.tmTrsoMovRouteLocA!,
      tmTrsoMovRouteLocB: this.createData.value.tmTrsoMovRouteLocB!,
      tmTrsoMovRouteLocC: this.createData.value.tmTrsoMovRouteLocC!,
      tmTrsoMovMode: this.createData.value.tmTrsoMovMode!,
      tmHaltLocA: this.createData.value.tmHaltLocA!,
      tmHaltLocB: this.createData.value.tmHaltLocB!,
      tmHaltLocC: this.createData.value.tmHaltLocC!,
      cidtoiRoadCl: this.createData.value.cidtoiRoadCl!,
      cidtoiRailBroadGauge: this.createData.value.cidtoiRailBroadGauge!,
      cidtoiRailMetreGauge: this.createData.value.cidtoiRailMetreGauge!,
      cidtoiRailRailwaySidings: this.createData.value.cidtoiRailRailwaySidings!,
      cidtoiRailDescription: this.createData.value.cidtoiRailDescription!,
      cidtoiAirLengthAitstrip: this.createData.value.cidtoiAirLengthAitstrip!,
      cidtoiAirNoOfHangers: this.createData.value.cidtoiAirNoOfHangers!,
      cidtoiAirNoOfHAS: this.createData.value.cidtoiAirNoOfHAS!,
      cidtoiAirMiscShelters: this.createData.value.cidtoiAirMiscShelters!,
      cidtoiBrSpan: this.createData.value.cidtoiBrSpan!,
      cidtoiBrWidth: this.createData.value.cidtoiBrWidth!,
      cidtoiBrCl: this.createData.value.cidtoiBrCl!,
      cidtoiBrPermt: this.createData.value.cidtoiBrPermt!,
      cidtoiBrTemp: this.createData.value.cidtoiBrTemp!,
      frmn: this.createData.value.frmn!,
      userId: 0,

      //new additions
      vLoc: this.createData.value.vLoc!,
      vLevel: this.createData.value.vLevel!,
      vFromTime: this.createData.value.vFromTime!,
      vTotime: this.createData.value.vTotime!,
      vNoOfIndis: this.createData.value.vNoOfIndis!,
      bmmLoc: this.createData.value.bmmLoc!,
      bmmLevel: this.createData.value.bmmLevel!,
      bmmFromTime: this.createData.value.bmmFromTime!,
      bmmToTime: this.createData.value.bmmToTime!,
      bmmNoOfIndis: this.createData.value.bmmNoOfIndis!,
      cLoc: this.createData.value.cLoc!,
      cLevel: this.createData.value.cLevel!,
      cFromTime: this.createData.value.cFromTime!,
      cToTime: this.createData.value.cToTime!,
      cNoOfIndis: this.createData.value.cNoOfIndis!,
      aDate: this.createData.value.aDate!,
      aWith: this.createData.value.aWith!,
      aAgenda: this.createData.value.aAgenda!,
      cDate: this.createData.value.cDate!,
      cWith: this.createData.value.cWith!,
      jvDate: this.createData.value.jvDate!,
      jvWith: this.createData.value.jvWith!,
      eadLoc: this.createData.value.eadLoc!,
      eadDate: this.createData.value.eadDate!,
      eadTime: this.createData.value.eadTime!,
      eadOfCountry: this.createData.value.eadOfCountry!,
      cdmLoc: this.createData.value.cdmLoc!,
      cdmDate: this.createData.value.cdmDate!,
      cdmTime: this.createData.value.cdmTime!,
      cdmOfCountry: this.createData.value.cdmOfCountry!,
      rdLoc: this.createData.value.rdLoc!,
      rdDate: this.createData.value.rdDate!,
      rdTime: this.createData.value.rdTime!,
      rdFromCountry: this.createData.value.rdFromCountry!,
      dapmLoc: this.createData.value.dapmLoc!,
      dapmDate: this.createData.value.dapmDate!,
      dapmTime: this.createData.value.dapmTime!,
      dapmTypeOfAgreement: this.createData.value.dapmTypeOfAgreement!,
      caLoc: this.createData.value.caLoc!,
      caNoOfLocs: this.createData.value.caNoOfLocs!,
      caDate: this.createData.value.caDate!,
      caTime: this.createData.value.caTime!,
      mdLoc: this.createData.value.mdLoc!,
      mdDate: this.createData.value.mdDate!,
      mdTime: this.createData.value.mdTime!,
      mdTgtAgenda: this.createData.value.mdTgtAgenda!,
      dmpLoc: this.createData.value.dmpLoc!,
      dmpDate: this.createData.value.dmpDate!,
      dmpTime: this.createData.value.dmpTime!,
      dmpType: this.createData.value.dmpType!,
      dmpLevel: this.createData.value.dmpLevel!,
      mrLoc: this.createData.value.mrLoc!,
      mrDate: this.createData.value.mrDate!,
      mrTime: this.createData.value.mrTime!,
      mrType: this.createData.value.mrType!,
      eidLoc: this.createData.value.eidLoc!,
      eidDate: this.createData.value.eidDate!,
      eidTime: this.createData.value.eidTime!,
      eidType: this.createData.value.eidType!,
      teLoc: this.createData.value.teLoc!,
      teDate: this.createData.value.teDate!,
      teTime: this.createData.value.teTime!,
      teOnWhom: this.createData.value.teOnWhom!,
      teType: this.createData.value.teType!,
      sLoc: this.createData.value.sLoc!,
      sDate: this.createData.value.sDate!,
      sTime: this.createData.value.sTime!,
      sByWhom: this.createData.value.sByWhom!,
      sOnWhom: this.createData.value.sOnWhom!,
      sType: this.createData.value.sType!,
      esdLoc: this.createData.value.esdLoc!,
      esdDate: this.createData.value.esdDate!,
      esdTime: this.createData.value.esdTime!,
      esdOnWhom: this.createData.value.esdOnWhom!,
      tLoc: this.createData.value.tLoc!,
      tDate: this.createData.value.tDate!,
      tTime: this.createData.value.tTime!,
      tBywhom: this.createData.value.tBywhom!,
      tToWhom: this.createData.value.tToWhom!,
      tType: this.createData.value.tType!,
      octrLoc: this.createData.value.octrLoc!,
      octrLocTo: this.createData.value.octrLocTo!,
      octrDate: this.createData.value.octrDate!,
      octrTime: this.createData.value.octrTime!,
      octrTimeTo: this.createData.value.octrTimeTo!,
      puLoc: this.createData.value.puLoc!,
      puDate: this.createData.value.puDate!,
      puTime: this.createData.value.puTime!,
      puLevel: this.createData.value.puLevel!,
      ruiLoc: this.createData.value.ruiLoc!,
      ruiDate: this.createData.value.ruiDate!,
      ruiTime: this.createData.value.ruiTime!,
      ruiLevel: this.createData.value.ruiLevel!,
      fiSector: this.createData.value.fiSector!,
      fiDate: this.createData.value.fiDate!,
      fiTime: this.createData.value.fiTime!,
      hcLoc: this.createData.value.hcLoc!,
      hcDate: this.createData.value.hcDate!,
      hcTime: this.createData.value.hcTime!,
      hcType: this.createData.value.hcType!,
      hclLevel: this.createData.value.hclLevel!,
      hcoLoc: this.createData.value.hcoLoc!,
      hcoDate: this.createData.value.hcoDate!,
      hcoTime: this.createData.value.hcoTime!,
      hcoTimeTo: this.createData.value.hcoTimeTo!,
      hcoTgt: this.createData.value.hcoTgt!,
      hcoLevel: this.createData.value.hcoLevel!,
      tcinLoc: this.createData.value.tcinLoc!,
      tcinDate: this.createData.value.tcinDate!,
      tcinTime: this.createData.value.tcinTime!,
      tcinTimeTo: this.createData.value.tcinTimeTo!,
      tcinTgt: this.createData.value.tcinTgt!,
      htsiLoc: this.createData.value.htsiLoc!,
      htsiNoOfIndis: this.createData.value.htsiNoOfIndis!,
      htsiPurpose: this.createData.value.htsiPurpose!,
      idsLoc: this.createData.value.idsLoc!,
      idsDate: this.createData.value.idsDate!,
      idsSection: this.createData.value.idsSection!,
      ipLoc: this.createData.value.ipLoc!,
      ipDate: this.createData.value.ipDate!,
      ipType: this.createData.value.ipType!,
      ipTypeEqpt_Nos: this.createData.value.ipTypeEqpt_Nos!,
      ipTypeArms_Type: this.createData.value.ipTypeArms_Type!,
      ipTypeArms_Nos: this.createData.value.ipTypeArms_Nos!,
      ipTypeAmn_Type: this.createData.value.ipTypeAmn_Type!,
      ipTypeAmn_Nos: this.createData.value.ipTypeAmn_Nos!,
      ipTypeTech_Type: this.createData.value.ipTypeTech_Type!,
      ipTypeTech_Nos: this.createData.value.ipTypeTech_Nos!,
      ipTypeWLS_Type: this.createData.value.ipTypeWLS_Type!,
      ipTypeWLS_Nos: this.createData.value.ipTypeWLS_Nos!,
      etrLoc: this.createData.value.etrLoc!,
      etrDate: this.createData.value.etrDate!,
      etrNosRect: this.createData.value.etrNosRect!,
      erLoc: this.createData.value.erLoc!,
      erDate: this.createData.value.erDate!,
      erRect: this.createData.value.erRect!,
      fcLoc: this.createData.value.fcLoc!,
      fcDate: this.createData.value.fcDate!,
      fcNosRect: this.createData.value.fcNosRect!,
      ipcLoc: this.createData.value.ipcLoc!,
      ipcDate: this.createData.value.ipcDate!,
      ipcTimeFrom: this.createData.value.ipcTimeFrom!,
      ipcTimeTo: this.createData.value.ipcTimeTo!,
      ipcType: this.createData.value.ipcType!,
      ipcTypeCommercial_Nos: this.createData.value.ipcTypeCommercial_Nos!,
      ipcTypeWarship_Type: this.createData.value.ipcTypeWarship_Type!,
      ipcTypeWarship_Nos: this.createData.value.ipcTypeWarship_Nos!,
      ipcTypeSvl_Type: this.createData.value.ipcTypeSvl_Type!,
      ipcTypeSvl_Nos: this.createData.value.ipcTypeSvl_Nos!,
      maDate: this.createData.value.maDate!,
      maWith: this.createData.value.maWith!,
      maAgenda: this.createData.value.maAgenda!,
      ieaLoc: this.createData.value.ieaLoc!,
      ieaDate: this.createData.value.ieaDate!,
      ieaTime: this.createData.value.ieaTime!,
      ieaTimeTo: this.createData.value.ieaTimeTo!,
      ieaTypeOfActivity: this.createData.value.ieaTypeOfActivity!,

      bpmLoc: this.createData.value.bpmLoc!,
      bpmDate: this.createData.value.bpmDate!,
      bpmBetween: this.createData.value.bpmBetween!,
      bpmTimeFrom: this.createData.value.bpmTimeFrom!,
      bpmTimeTo: this.createData.value.bpmTimeTo!,
      bpmNpm: this.createData.value.bpmNpm!,
      bpmNpo: this.createData.value.bpmNpo!,
      biLoc: this.createData.value.biLoc!,
      biDate: this.createData.value.biDate!,
      biBetween: this.createData.value.biBetween!,
      biTimeFrom: this.createData.value.biTimeFrom!,
      biTimeTo: this.createData.value.biTimeTo!,
      biNpm: this.createData.value.biNpm!,
      biNpo: this.createData.value.biNpo!,
      cfvLoc: this.createData.value.cfvLoc!,
      cfvate: this.createData.value.cfvate!,
      cfvBetween: this.createData.value.cfvBetween!,
      cfvTimeFrom: this.createData.value.cfvTimeFrom!,
      cfvTimeTo: this.createData.value.cfvTimeTo!,
    }
    this.apiService.postWithHeader('masterData',masterData).subscribe(res =>{
      if (res) {
        this.toastr.success("Record Saved");
        this.dialogref.close(true);     
      }
      
      // this.router.navigateByUrl("")
    })

  }
  closedialog() {
    // this.createData.reset();
    // this.router.navigateByUrl('/master-data');
    this.dialogref.close(true);
  }

  getInputLevel() {
    this.apiService.getWithHeaders('MasterData/inputlevels').subscribe(res => {
      if (res) {
        this.inputLevels = res;
      }
    })
  }
  onFilterChange(value) {
    switch (value) {
      case '4 Corps':
        this.sectorList = ['Zimthang', 'Lungro La', 'Bum La', 'Landa', 'Yangtse', 'Mago Chuna', 'Dominated Areas'];
        break;
      case '5 Mtn Div':
        this.sectorList = ['Zimthang', 'Lungro La', 'Bum La'];
        break;
      case '71 Mtn Div':
        this.sectorList = ['Landa', 'Yangtse', 'Mago Chuna', 'Dominated Areas'];
        break;
      case '21 Mtn Div':
        this.sectorList = ['Zimthang', 'Lungro La', 'Bum La', 'Landa', 'Yangtse', 'Mago Chuna', 'Dominated Areas'];
        break;

      case '17 Mtn Div':
        this.sectorList = ['Semi Held', 'Chola', 'NatuLa', 'DokaLa'];
        break;
      case '27 Mtn Div':
        this.sectorList = ['MSS', 'PSS', 'NESS'];
        break;
      case '3 Corps':
        this.sectorList = ['Dibang Valley', 'Dou-delai valley', 'Lohit Valley', 'Subansiri Valley', 'Siyom Valley', 'Siang Valley', 'Dibang Valley', 'Dou-delai valley', 'Lohit Valley', 'Subansiri Valley', 'Siyom Valley', 'Siang Valley'];
        break;
      case '2 Mtn Div':
        this.sectorList = ['Dibang Valley', 'Dou-delai valley', 'Lohit Valley'];
        break;
      case '56 Mtn Div':
        this.sectorList = ['Subansiri Valley', 'Siyom Valley', 'Siang Valley'];
        break;
      case '57 Mtn Div':
        this.sectorList = ['Dibang Valley', 'Dou-delai valley', 'Lohit Valley', 'Subansiri Valley', 'Siyom Valley', 'Siang Valley'];
        break;
      // case 'Option 3':
      //   this.childItems = ['Suboption X', 'Suboption Y', 'Suboption Z'];
      // break;
      default:
        this.sectorList = ['MSS', 'PSS', 'Cho_La', 'Doka_La', 'NESS', 'Semi Held', 'NatuLa'];
        break;
    }
    if (!value) {
      this.sectorList = ['MSS', 'PSS', 'Cho_La', 'Doka_La', 'NESS', 'Semi Held', 'NatuLa'];
    }
  }

  indicators: Indicator[] = [];
  dynamicFields: Array<any> = [];
  dynamicDropdownOptions: Array<any> = [];  // Holds dynamic dropdown options for the selected indicator
  dynamicDropdownLabel: string = '';  // Label for the dynamic dropdown
  currentStepIndex: number = 0;
  additionalFields: Array<any> = [];
  // aspectOptions: string[] = [
  //   'Svl / Counter Svl',
  //   'Friction / Belligerence',
  //   'Ae Activity',
  //   'Conc of Tps',
  //   'Armr / Arty / AD / Engrs Indn',
  //   'Mob',
  //   'Infra Devp',
  //   'Dumping of WLS',
  //   'Heightened Diplomatic Eng',
  //   'Collapse of Diplomatic Ties',
  //   'Propoganda',
  //   'Econ',
  //   'Internal Issues',
  //   'Cyber',
  //   'Def',
  //   'Interactions'
  // ];
  // indicatorOptions = {
  //   'Svl / Counter Svl': [
  //     'Placement of addl Svl Eqpt',
  //     'Incr Recce',
  //     'Incr in OP loc',
  //     'Jamming',
  //     'Enhanced Tourist Influx',
  //   ],
  //   'Friction / Belligerence': [
  //     'Face-off / Skirmish',
  //     'Activation of Dormant Z',
  //     'Setting_of_camp',
  //     'Grazier Activity',
  //     'Aggressive recce',
  //   ],
  //   'Ae Activity': [
  //     'Drone Activity / Incursion',
  //     'Comb Ac in Proximity',
  //     'Fighter_activity_near_LAC',
  //     'Airspace Violation'
  //   ],
  //   'Conc of Tps': [
  //     'Enhanced Str / Force Posturing',
  //     'Res Build Up',
  //     'Conc of A vehs',
  //     'Trg Ex'
  //   ],
  //   'Armr / Arty / AD / Engrs Indn': [
  //     'A Vehs Mov',
  //     'Arty Guns / LRVs Mov',
  //     'Arty Amn Dumping',
  //     'Engr Coln Mov'
  //   ],
  //   'Mob': [
  //     'Incr Vehs in Stg As',
  //     'Incr Lgs Cvys',
  //     'Incr Lgs Trains',
  //     'Incr Radio Tfc',
  //     'Trg Ex(Mob)',
  //     'Re-loc of Forces',
  //     'TRSO Mov'
  //   ],
  //   'Infra Devp': [
  //     'Constr of Op Wks',
  //     'Bdr Infra Devp',
  //     'Def Improvement',
  //     'Gun As / SAM sites',
  //     'Amn Dumps / Caches / Msl Silos Devp',
  //     'Addl Billeting',
  //     'Comn Infra Devp - Rd/ Br/ Rail/ Air',
  //     'Comn Tower / Radome Contsr'
  //   ],
  //   'Dumping of WLS': [
  //     'Lgs Dumping',
  //     'Br Stores Dumping',
  //     'Engr Stores Dumping'
  //   ],
  //   'Heightened Diplomatic Eng': [
  //     'Vis',
  //     'Bilatera l/ Multilateral Mtgs',
  //     'Conf',
  //     'Alliances',
  //     'Collusivity',
  //     'Jt Ventures'
  //   ],
  //   'Collapse of Diplomatic Ties': [
  //     'Expulsion / Arrest of Diplomats',
  //     'Closure of Diplomatic Msns',
  //     'Recalling of Diplomats',
  //     'Disregard to Agreements / Protocols / MOUs',
  //     'Cartographic Aggression'
  //   ],
  //   'Propoganda': [
  //     'Misinfo / Disinfo',
  //     'Display of Mil Prowess',
  //     'Media Rhetoric',
  //     'Engr IS Disturbances'
  //   ],
  //   'Econ': [
  //     'Trade Embargo',
  //     'Sanctions',
  //     'Energy Sup Disruption',
  //     'Tenders',
  //     'Opening / Closure Trade Routes'
  //   ],
  //   'Internal Issues': [
  //     'Pol Unrest',
  //     'Regional Unrest Impact',
  //     'Energy Sup Disruption',
  //     'Fin Instability',
  //     'Hlth Concerns'
  //   ],
  //   'Cyber': [
  //     'Heightened Cyber Ops',
  //     'Tgt Critical Infra / NWs',
  //     'Hiring of Tech Skilled Indls'
  //   ],
  //   'Def': [
  //     'Incr Def Spending',
  //     'Incr Production',
  //     'Enhanced Tibetan Rect',
  //     'Embodiment of Res',
  //     'Forced Conscription',
  //     'Incr Port Calls',
  //     'Mil Alliances',
  //     'Intensified EW Activities'
  //   ],
  //   'Interactions': [
  //     'BPMs',
  //     'Bdr Interactions',
  //     'Cease Fire Violations'
  //   ]
  //   // Add more aspect-specific indicators here
  // };

  // onChange(event: any) {
  //   const selectedAspect = this.selected;

  //   // Update indicators based on selected aspect
  //   if (this.indicatorOptions[selectedAspect]) {
  //     this.indicators = this.indicatorOptions[selectedAspect];
  //     this.subselected = ''; // Reset the selected indicator
  //     this.dynamicFields = []; // Clear any previously displayed dynamic fields
  //     this.dynamicDropdownOptions = []; // Clear dropdown options
  //     this.dynamicDropdownLabel = ''; // Reset   dropdown label
  //     this.additionalFields = [];// Clear additional fields
  //     this.currentStepIndex = 1;
  //   } else {
  //     this.indicators = []; // If no matching aspect, clear the indicators
  //   }

  //   // Reset subselected (indicator) to clear any previously selected value
  //   this.subselected = '';
  // }

  onChange2($event) {
    const selectedIndicator = this.subselected;
    const fields = this.fieldConfigurations[selectedIndicator] || [];

    this.dynamicFields = fields.filter(field => field.type !== 'dropdown');
    const dropdownFields = fields.filter(field => field.type === 'dropdown');

    if (dropdownFields.length > 0) {
      this.dynamicDropdownOptions = dropdownFields[0].options || [];
      this.dynamicDropdownLabel = dropdownFields[0].label;
    }
    // setting formControl to the reactive form based on type
    fields.forEach(field => {
      if (!this.createData.contains(field.name)) {
        if (field.type === 'dropdown') {
          this.createData.addControl(field.name, this.formBuilder.control(''));
        } else if (field.type === 'string' || field.type === 'number' || field.type === 'date' || field.type === 'time') {
          this.createData.addControl(field.name, this.formBuilder.control('', Validators.required));
        }
      }
    });
  }

  onDropdownSelectionChange($event: any) {
    const dropdownValue = $event.value;
    this.additionalFields = [];
    // Handle further dynamic fields based on dropdown value
    switch (dropdownValue) {
      case 'Rd':
        this.additionalFields = this.getAdditionalFieldsForDropdown('Rd');
        break;

      case 'Rail':
        this.additionalFields = this.getAdditionalFieldsForDropdown('Rail');
        break;

      case 'Air':
        this.additionalFields = this.getAdditionalFieldsForDropdown('Air');
        break;

      case 'Br':
        this.additionalFields = this.getAdditionalFieldsForDropdown('Br');
        break;

      default:
        // Add additional logic for other dropdown values if needed
        break;
    }

    // You can add additional form controls for the new fields if needed
    this.additionalFields.forEach(field => {
      if (!this.createData.contains(field.name)) {
        if (field.type === 'dropdown') {
          this.createData.addControl(field.name, this.formBuilder.control(''));
        } else if (field.type === 'string' || field.type === 'number' || field.type === 'date' || field.type === 'time') {
          this.createData.addControl(field.name, this.formBuilder.control('', Validators.required));
        }
      }
    });
  }

  getAdditionalFieldsForDropdown(dropdownValue: string) {
    // Logic to return additional fields based on dropdown value
    // Example: You can map dropdown values to additional fields here
    switch (dropdownValue) {
      case 'Rd':
        return [
          { name: 'cidtoiRoadCl', label: 'Cl', type: 'string' }
        ];

      case 'Rail':
        return [
          // { name: 'additionalField1', label: 'Additional Field 1', type: 'string' },
          // { name: 'additionalField2', label: 'Additional Field 2', type: 'time' },
          { name: 'cidtoiRailBroadGauge', label: 'Broad_gauge(kms)', type: 'string' },
          { name: 'cidtoiRailMetreGauge', label: 'Metre_gauge', type: 'string' },
          { name: 'cidtoiRailRailwaySidings', label: 'Railway_sidings', type: 'string' },
          { name: 'cidtoiRailDescription', label: 'Description', type: 'string' }
        ];

      case 'Air':
        return [
          { name: 'cidtoiAirLengthAitstrip', label: 'Length_Airstrip', type: 'string' },
          { name: 'cidtoiAirNoOfHangers', label: 'No_of_Hangers', type: 'string' },
          { name: 'cidtoiAirNoOfHAS', label: 'No_of_HAS', type: 'string' },
          { name: 'cidtoiAirMiscShelters', label: 'Misc_shelters', type: 'string' }
        ];

      case 'Br':
        return [
          { name: 'cidtoiBrSpan', label: 'Br_Span', type: 'string' },
          { name: 'cidtoiBrWidth', label: 'Br_Width', type: 'string' },
          { name: 'cidtoiBrCl', label: 'Cl', type: 'string' },
          { name: 'cidtoiBrPermt', label: 'Br_Permt', type: 'string' },
          { name: 'cidtoiBrTemp', label: 'Br_Temp', type: 'string' }
        ];

      default:
        return []; // Return an empty array if no matching dropdown value is found
    }
  }




  // Handle "Next" button click to go to the next step
  onNext(stepper: any) {
    stepper.next();  // Move to the next step
    this.currentStepIndex = stepper.selectedIndex;  // Update the current step index
  }

  // Handle "Back" button click to go to the previous step
  onBack(stepper: any) {
    stepper.previous();  // Move to the previous step
    this.currentStepIndex = stepper.selectedIndex;  // Update the current step index
  }

  fieldConfigurations = {
    'Placement of addl Svl Eqpt': [
      { name: 'typeSvlEqpt', label: 'Type Svl Eqpt', type: 'string' },
      { name: 'noSvlEqpt', label: 'No Svl Eqpt', type: 'string' },
      { name: 'tgt', label: 'Tgt', type: 'string' },
      { name: 'htM', label: 'Ht(M)', type: 'string' },
      { name: 'poaseReamrks', label: 'Remarks', type: 'string' },
    ],
    'Incr Recce': [
      { name: 'visSrOffrs', label: 'Vis Sr Offrs', type: 'string' },
      { name: 'ptls', label: 'Ptls', type: 'string' },
      { name: 'newTps', label: 'New Tps', type: 'string' },
      { name: 'cvys', label: 'Cvys', type: 'string' },
      { name: 'obsn', label: 'Obsn', type: 'string' },
      { name: 'irRemarks', label: 'Remarks', type: 'string' },
    ],
    'Incr in OP loc': [
      { name: 'type', label: 'Type', type: 'dropdown', options: ['Permt', 'Temp'] },
      { name: 'timeFrom', label: 'Time From', type: 'time' },
      { name: 'timeTo', label: 'Time To', type: 'time' },
      { name: 'iolRemarks', label: 'Remarks', type: 'string' },
    ],
    'Jamming': [
      { name: 'jammingEqpt', label: 'Eqpt', type: 'string' },
      { name: 'jammingTimefrom', label: 'Time from', type: 'time' },
      { name: 'jammingTimeto', label: 'Time to', type: 'time' },
      { name: 'jammingDtOfJx', label: 'Dt Of Jx', type: 'date' },
      { name: 'jammingEffect', label: 'Effect', type: 'string' },
      { name: 'jammingSpecificationFreq', label: 'Specification Freq', type: 'string' },
      { name: 'jammingSpecificationWavelength', label: 'Specification Wavelength', type: 'string' },
      { name: 'jammingSpecificationType', label: 'Specification Type', type: 'string' },
      { name: 'jammingRemarks', label: 'Remarks', type: 'string' }
    ],
    'Enhanced Tourist Influx': [
      { name: 'etiNoOfTourists', label: 'No Of Tourists', type: 'string' },
      { name: 'etiTimefrom', label: 'Time from', type: 'time' },
      { name: 'etiTimeto', label: 'Time to', type: 'time' },
      { name: 'etiFrequencyDaily', label: 'Frequency Daily', type: 'string' },
      { name: 'etiFrequencyWeekly', label: 'Frequency Weekly', type: 'string' },
      { name: 'etiFrequencySeasonal', label: 'Frequency Seasonal', type: 'string' }
    ],
    'Face-off / Skirmish': [
      { name: 'foSTimefrom', label: 'Time from', type: 'time' },
      { name: 'foSTimeto', label: 'Time to', type: 'time' },
      { name: 'foSSkirmishPurpose', label: 'Skirmish Purpose', type: 'string' },
      { name: 'foSSkirmishPlaFmn', label: 'Skirmish Pla Fmn', type: 'string' },
      { name: 'foSSkirmishPlaNoOfPers', label: 'Skirmish Pla No Of Pers', type: 'string' },
      { name: 'foSSkirmishPlaNoOfOffrs', label: 'Skirmish Pla No Of Offrs', type: 'string' },
      { name: 'foSSkirmishPlaNoOfOr', label: 'Skirmish Pla No Of Or', type: 'string' },
      { name: 'foSSkirmishPlaNoOfCiv', label: 'Skirmish Pla No Of Civ', type: 'string' },
      { name: 'foSSkirmishPlaNameOfOffrs', label: 'Skirmish Pla Name Of Offrs', type: 'string' },
      { name: 'foSCas', label: 'Cas', type: 'dropdown', options: ['Fatal', 'Non Fatal'] },
      { name: 'foSDamageEqpt', label: 'Damage Eqpt', type: 'string' },
      { name: 'foSDamageProperty', label: 'Damage Property', type: 'string' },
      { name: 'foSLossWpn', label: 'Loss Wpn', type: 'string' },
      { name: 'foSLossAmn', label: 'Loss Amn', type: 'string' },
      { name: 'foSLossEqpt', label: 'Loss Eqpt', type: 'string' },
      { name: 'foSCasFatal', label: 'Cas Fatal', type: 'string' },
      { name: 'foSCasNonFatal', label: 'Cas Non Fatal', type: 'string' }
    ],
    'Activation of Dormant Z': [
      { name: 'adzTimefrom', label: 'Time from', type: 'time' },
      { name: 'adzTimeto', label: 'Time to', type: 'time' },
      { name: 'adzNoOfPers', label: 'No Of Pers', type: 'string' },
      { name: 'adzActivity', label: 'Activity', type: 'string' }
    ],
    'Setting_of_camp': [
      { name: 'soCUnitType', label: 'Unit Type', type: 'dropdown', options: ['Containers', 'Tents', 'Sheds'] },
      { name: 'soCNoOfUnits', label: 'No Of Units', type: 'string' },
      { name: 'soCOccupiedBy', label: 'Occupied By', type: 'dropdown', options: ['PLA', 'Civs', 'RBA', 'PAPF', 'Militia'] },
      { name: 'soCNoOfPlaPers', label: 'No Of Pla Pers', type: 'string' },
      { name: 'soCNoOfCivs', label: 'No Of Civs', type: 'string' },
      { name: 'soCNoOfRbaPers', label: 'No Of Rba Pers', type: 'string' },
      { name: 'soCNoOfPapfPers', label: 'No Of Papf Pers', type: 'string' },
      { name: 'soCNoOfMilitia', label: 'No Of Militia', type: 'string' },
      { name: 'soCNoOfEqpt', label: 'No Of Eqpt', type: 'string' },
      { name: 'soCDescription', label: 'Description', type: 'string' }
    ],
    "Grazier Activity": [
      { name: "gaNoOfGraziers", label: "No Of Graziers", type: "string" },
      { name: "gaNoOfAnimals", label: "No Of Animals", type: "string" },
      { name: "gaNoOfDu", label: "No Of Du", type: "string" },
      { name: "gaGrazierDescription", label: "Grazier Description", type: "string" }
    ],
    "Aggressive recce": [
      { name: "arAggressiveRecceNoOfPers", label: "Aggressive Recce No Of Pers", type: "string" },
      { name: "arTypeOfPers", label: "Type Of Pers", type: "dropdown", options: ["PLA", "Civs", "RBA", "PAPF", "Militia"] },
      { name: "arAggressiveRecceDescription", label: "Aggressive Recce Description", type: "string" }
    ],
    "Drone Activity / Incursion": [
      { name: "daiNoOfDrones", label: "No Of Drones", type: "string" },
      { name: "daiAltM", label: "Alt(M)", type: "string" },
      { name: "daiTypeOfDrone", label: "Type Of Drone", type: "dropdown", options: ["Lgs", "Svl", "Wpn"] },
      { name: "daiFltPathLocA", label: "Flt Path Loc A", type: "string" },
      { name: "daiFltPathLocB", label: "Flt Path Loc B", type: "string" },
      { name: "daiFltPathLocC", label: "Flt Path Loc C", type: "string" },
      { name: "daiFltPathLocD", label: "Flt Path Loc D", type: "string" },
      { name: "daiDirnFrom", label: "Dirn From", type: "string" },
      { name: "daiDirnTo", label: "Dirn To", type: "string" },
      { name: "daiIncursionKms", label: "Incursion(Kms)", type: "string" }
    ],
    "Comb Ac in Proximity": [
      { name: "capNoOfAeProximity", label: "No Of Ae Proximity", type: "string" },
      { name: "capTypeOfAeProximity", label: "Type Of Ae Proximity", type: "dropdown", options: ["Fighter", "Bomber", "Recce"] },
      { name: "capFltPathLocA", label: "Flt Path Loc A", type: "string" },
      { name: "capFltPathLocB", label: "Flt Path Loc B", type: "string" },
      { name: "capFltPathLocC", label: "Flt Path Loc C", type: "string" },
      { name: "capProximityDirnFrom", label: "Proximity Dirn From", type: "string" },
      { name: "capProximityDirnTo", label: "Proximity Dirn To", type: "string" },
      { name: "capIncursionKms", label: "Incursion(Kms)", type: "string" },
      { name: "capActivity", label: "Activity", type: "string" }
    ],
    "Fighter_activity_near_LAC": [
      { name: "flacNoOfAc", label: "No Of Ac", type: "string" },
      { name: "flacAltM", label: "Alt(M)", type: "string" },
      { name: "flacTypeOfAc", label: "Type Of Ac", type: "dropdown", options: ["Fighter", "Tpt", "EW"] },
      { name: "flacFltPathLocA", label: "Flt Path Loc A", type: "string" },
      { name: "flacFltPathLocB", label: "Flt Path Loc B", type: "string" },
      { name: "flacFltPathLocC", label: "Flt Path Loc C", type: "string" },
      { name: "flacFltPathLocD", label: "Flt Path Loc D", type: "string" },
      { name: "flacAcDirnFrom", label: "Ac Dirn From", type: "string" },
      { name: "flacAcDirnTo", label: "Ac Dirn To", type: "string" },
      { name: "flacActivity", label: "Activity", type: "string" }
    ],
    "Airspace Violation": [
      { name: "avNoOfAePlatform", label: "No Of Ae Platform", type: "string" },
      { name: "avAltM", label: "Alt(M)", type: "string" },
      { name: "avAirspaceViolationTypeOfAc", label: "Airspace Violation Type Of Ac", type: "dropdown", options: ["Fighter", "Lgs", "EW", "Heptr", "UAV", "Drone"] },
      { name: "avFltPathLocA", label: "Flt Path Loc A", type: "string" },
      { name: "avFltPathLocB", label: "Flt Path Loc B", type: "string" },
      { name: "avFltPathLocC", label: "Flt Path Loc C", type: "string" },
      { name: "avFltPathLocD", label: "Flt Path Loc D", type: "string" },
      { name: "avAirspaceViolationDirnFrom", label: "Airspace Violation Dirn From", type: "string" },
      { name: "avAirspaceViolationDirnTo", label: "Airspace Violation Dirn To", type: "string" },
      { name: "avActivity", label: "Activity", type: "string" },
      { name: "avIncursionKms", label: "Incursion(Kms)", type: "string" }
    ],
    "Enhanced Str / Force Posturing": [
      { name: "esfpTypeOfPers", label: "Type Of Pers", type: "dropdown", options: ["PLA", "Civs", "RBA", "PAPF", "Militia"] },
      { name: "esfpStr", label: "Str", type: "string" },
      { name: "esfpIden", label: "Iden", type: "string" },
      { name: "esfpDisposition", label: "Disposition", type: "dropdown", options: ["Permt", "Temp"] },
      { name: "esfpDispositionRemarks", label: "Disposition Remarks", type: "string" }
    ],
    "Res Build Up": [
      { name: "rbuTypeOfPers", label: "Type Of Pers", type: "dropdown", options: ["PLA", "RBA", "PAPF", "Militia"] },
      { name: "rbuResBuildUpStr", label: "Res Build Up Str", type: "string" },
      { name: "rbuResBuildUpRemarks", label: "Res Build Up Remarks", type: "string" }
    ],
    "Conc of A vehs": [
      { name: "cavConcOfVehsTypeOfVeh", label: "Conc Of Vehs Type Of Veh", type: "dropdown", options: ["Tks", "IFVs", "ICVs", "Tk_Tptr"] },
      { name: "cavConcOfVehsStr", label: "Conc Of Vehs Str", type: "string" },
      { name: "CAVConcOfVehsIden", label: "Conc Of Vehs Iden", type: "string" },
      { name: "cavConcOfVehsDisposition", label: "Conc Of Vehs Disposition", type: "dropdown", options: ["Permt", "Temp"] },
      { name: "cavConcOfVehsDispositionRemarks", label: "Conc Of Vehs Disposition Remarks", type: "string" }
    ],
    'Trg Ex': [
      { name: 'teTypeOfTrg', label: 'Type Of Trg', type: 'dropdown', options: ['Armd', 'Inf', 'Arty', 'Ae', 'Jt'] },
      { name: 'teTrgExStr', label: 'Trg Ex Str', type: 'string' },
      { name: 'teTrgExIden', label: 'Trg Ex Iden', type: 'string' },
      { name: 'teTrgExDisposition', label: 'Trg Ex Disposition', type: 'dropdown', options: ['Permt', 'Temp'] },
      { name: 'teTrgExDispositionRemarks', label: 'Trg Ex Disposition Remarks', type: 'string' }
    ],
    'A Vehs Mov': [
      { name: 'avnTypeOfVeh', label: 'Type Of Veh', type: 'dropdown', options: ['Tks', 'IFVs', 'ICVs', 'Tk_Tptr'] },
      { name: 'avnStr', label: 'Str', type: 'string' },
      { name: 'avnIden', label: 'Iden', type: 'string' },
      { name: 'avnDirnLocA', label: 'Dirn Loc A', type: 'string' },
      { name: 'avnDirnLocB', label: 'Dirn Loc B', type: 'string' },
      { name: 'avnDirnLocC', label: 'Dirn Loc C', type: 'string' },
      { name: 'avnVehsNovMode', label: 'Vehs Nov Mode', type: 'dropdown', options: ['Rd', 'Rail'] },
      { name: 'avnNomenclatureOfRd', label: 'Nomenclature Of Rd', type: 'string' }
    ],
    'Arty Guns / LRVs Mov': [
      { name: 'aglmTypeOfArty', label: 'Type Of Arty', type: 'dropdown', options: ['Howitzer', 'Mortar', 'Guns', 'Rkts', 'Missiles'] },
      { name: 'aglmTypeOfPlatform', label: 'Type Of Platform', type: 'dropdown', options: ['Tr', 'Wheeled', 'Towed'] },
      { name: 'aglmStr', label: 'Str', type: 'string' },
      { name: 'aglmIden', label: 'Iden', type: 'string' },
      { name: 'aglmDirnLocA', label: 'Dirn Loc A', type: 'string' },
      { name: 'aglmDirnLocB', label: 'Dirn Loc B', type: 'string' },
      { name: 'aglmDirnLocC', label: 'Dirn Loc C', type: 'string' },
      { name: 'aglmArtyGunsMode', label: 'Arty Guns Mode', type: 'dropdown', options: ['Rd', 'Rail', 'Air'] },
      { name: 'aglmNomenclatureOfRd', label: 'Nomenclature Of Rd', type: 'string' }
    ],
    'Arty Amn Dumping': [
      { name: 'aadTypeOfAmn', label: 'Type Of Amn', type: 'dropdown', options: ['Howitzer', 'Mortar', 'Guns', 'Rkts', 'Missiles'] },
      { name: 'aadArtyAmnDumpingNoAmnVehs', label: 'Arty Amn Dumping No Amn Vehs', type: 'string' },
      { name: 'aadRouteLocA', label: 'Route Loc A', type: 'string' },
      { name: 'aadRouteLocB', label: 'Route Loc B', type: 'string' },
      { name: 'aadRouteLocC', label: 'Route Loc C', type: 'string' },
      { name: 'aadArtyAmnDumpingMode', label: 'Arty Amn Dumping Mode', type: 'dropdown', options: ['Rd', 'Rail', 'Air'] },
      { name: 'aadNomenclatureOfRd', label: 'Nomenclature Of Rd', type: 'string' }
    ],
    'Engr Coln Mov': [
      { name: 'ecmTypeOfEqpt', label: 'Type Of Eqpt', type: 'dropdown', options: ['Br_stores', 'Plant_eqpt', 'Mines'] },
      { name: 'ecmEngrColnNovStr', label: 'Engr Coln Mov Str', type: 'string' },
      { name: 'ecmIden', label: 'Iden', type: 'string' },
      { name: 'ecmEngrColnNovRouteLocA', label: 'Engr Coln Mov Route Loc A', type: 'string' },
      { name: 'ecmEngrColnNovRouteLocB', label: 'Engr Coln Mov Route Loc B', type: 'string' },
      { name: 'ecmEngrColnNovRouteLocC', label: 'Engr Coln Mov Route Loc C', type: 'string' },
      { name: 'ecmEngrColnNovMode', label: 'Engr Coln Mov Mode', type: 'string' },
      { name: 'ecmNomenclatureOfRd', label: 'Nomenclature Of Rd', type: 'string' }
    ],
    'Incr Vehs in Stg As': [
      { name: 'ivsaIncrVehsInStgAsTypeOfVeh', label: 'Incr Vehs In Stg As Type Of Veh', type: 'dropdown', options: ['A_vehs', 'B_vehs', 'C_vehs', 'Spl_eqpts'] },
      { name: 'ivsaIncrVehsInStgAsStr', label: 'Incr Vehs In Stg As Str', type: 'string' },
      { name: 'ivsaIden', label: 'Iden', type: 'string' },
      { name: 'ivsaIncrVehsInStgAsDispositionRemarks', label: 'Incr Vehs In Stg As Disposition Remarks', type: 'string' }
    ],
    'Incr Lgs Cvys': [
      { name: 'ilcIncrLgsCvysStr', label: 'Incr Lgs Cvys Str', type: 'string' },
      { name: 'ilcIden', label: 'Iden', type: 'string' },
      { name: 'ilcIncrLgsCvysRouteLocA', label: 'Incr Lgs Cvys Route Loc A', type: 'string' },
      { name: 'ilcIncrLgsCvysRouteLocB', label: 'Incr Lgs Cvys Route Loc B', type: 'string' },
      { name: 'ilcIncrLgsCvysRouteLocC', label: 'Incr Lgs Cvys Route Loc C', type: 'string' },
      { name: 'ilcIncrLgsCvysMode', label: 'Incr Lgs Cvys Mode', type: 'dropdown', options: ['Rd', 'Rail', 'Air'] },
      { name: 'ilcNomenclatureOfRd', label: 'Nomenclature Of Rd', type: 'string' },
    ],
    'Incr Lgs Trains': [
      { name: 'iltIncrLgsTrainsDateFrom', label: 'Incr Lgs Trains Date From', type: 'date' },
      { name: 'iltIncrLgsTrainsDateTo', label: 'Incr Lgs Trains Date To', type: 'date' },
      { name: 'iltNoOfTrainsRoutine', label: 'No Of Trains Routine', type: 'string' },
      { name: 'iltNoOfTrainsEnhanced', label: 'No Of Trains Enhanced', type: 'string' },
      { name: 'iltNoOfTrainsIncr', label: 'No Of Trains Incr', type: 'string' },
      { name: 'iltRouteOrigin', label: 'Route Origin', type: 'string' },
      { name: 'iltRouteDestination', label: 'Route Destination', type: 'string' },
      { name: 'iltTypeOfLgs', label: 'Type Of Lgs', type: 'dropdown', options: ['Stores', 'Supplies', 'POL'] },
    ],
    'Incr Radio Tfc': [
      { name: 'irtIncrRadioTfcDateFrom', label: 'Incr Radio Tfc Date From', type: 'date' },
      { name: 'irtIncrRadioTfcDateTo', label: 'Incr Radio Tfc Date To', type: 'date' },
      { name: 'irtTxnBand', label: 'Txn Band', type: 'dropdown', options: ['HF', 'VHF', 'UHF', 'Commercial_band', 'Unspecified'] },
      { name: 'irtTypeOfTxn', label: 'Type Of Txn', type: 'dropdown', options: ['Mil', 'Civ'] },
      { name: 'irtNoOfTxns', label: 'No Of Txns', type: 'string' },
    ],
    'Trg Ex(Mob)': [
      { name: 'teTypeOfForces', label: 'Type Of Forces', type: 'dropdown', options: ['Armd', 'Inf', 'Arty', 'Ae', 'Jt'] },
      { name: 'teMobTrgExStr', label: 'Mob Trg Ex Str', type: 'string' },
      { name: 'teMobTrgExIden', label: 'Mob Trg Ex Iden', type: 'string' },
      { name: 'teMobTrgExDisposition', label: 'Mob Trg Ex Disposition', type: 'dropdown', options: ['Permt', 'Temp'] },
      { name: 'teMobTrgExEqptOnWheels', label: 'Mob Trg Ex Eqpt On Wheels', type: 'dropdown', options: ['Yes', 'No'] },
      { name: 'teMobTrgExActivityTrg', label: 'Mob Trg Ex Activity Trg', type: 'dropdown', options: ['Trg', 'Non-Trg'] },
      { name: 'teActivityRoutine', label: 'Activity Routine', type: 'dropdown', options: ['Routine', 'Non-Routine'] },
      { name: 'teHault', label: 'Hault', type: 'dropdown', options: ['Permt', 'Temp'] }
    ],
    'Re-loc of Forces': [
      { name: 'rlfPermtLocName', label: 'Permt Loc Name', type: 'string' },
      { name: 'rlfNewLocName', label: 'New Loc Name', type: 'string' },
      { name: 'rlfReLocOfForcesDate', label: 'Re Loc Of Forces Date', type: 'date' },
      { name: 'rlfQuantumTps', label: 'Quantum Tps', type: 'string' },
      { name: 'rlfQuantumAVehs', label: 'Quantum A Vehs', type: 'string' },
      { name: 'rlfQuantumBVehs', label: 'Quantum B Vehs', type: 'string' },
      { name: 'rlfQuantumCVehs', label: 'Quantum C Vehs', type: 'string' },
      { name: 'RLFBilletingType', label: 'Billeting Type', type: 'string' },
      { name: 'rlfBilletingType', label: 'Billeting Type Dropdown', type: 'dropdown', options: ['Eqpt', 'Permt', 'Temp'] },
      { name: 'rlfReLocOfForcesIden', label: 'Re Loc Of Forces Iden', type: 'string' }
    ],
    'TRSO Mov': [
      { name: 'tmMobTrsoMovStr', label: 'Mob Trso Mov Str', type: 'string' },
      { name: 'tmEnFmn', label: 'En Fmn', type: 'string' },
      { name: 'tmEnUnit', label: 'En Unit', type: 'string' },
      { name: 'tmTrsoMovRouteLocA', label: 'Trso Mov Route Loc A', type: 'string' },
      { name: 'tmTrsoMovRouteLocB', label: 'Trso Mov Route Loc B', type: 'string' },
      { name: 'tmTrsoMovRouteLocC', label: 'Trso Mov Route Loc C', type: 'string' },
      { name: 'tmTrsoMovMode', label: 'Trso Mov Mode', type: 'dropdown', options: ['Rd', 'Rail', 'Air'] },
      { name: 'tmHaltLocA', label: 'Halt Loc A', type: 'string' },
      { name: 'tmHaltLocB', label: 'Halt Loc B', type: 'string' },
      { name: 'tmHaltLocC', label: 'Halt Loc C', type: 'string' }
    ],
    'Constr of Op Wks': [
      { name: 'cowBilleting', label: 'Billeting', type: 'dropdown', options: ['MSBs', 'Sheds', 'Containers'] },
      { name: 'cowStorage', label: 'Storage', type: 'dropdown', options: ['Shelters', 'UG_Tunnels', 'OG_Tunnels'] },
      { name: 'cowSplConstr', label: 'Spl Constr', type: 'string' },
    ],
    'Bdr Infra Devp': [
      { name: 'bidBdrInfraDevpBilleting', label: 'Bdr Infra Devp Billeting', type: 'dropdown', options: ['MSBs', 'Sheds', 'Containers'] },
      { name: 'bidBdrInfraDevpStorage', label: 'Bdr Infra Devp Storage', type: 'dropdown', options: ['Shelters', 'UG_Tunnels', 'OG_Tunnels'] },
      { name: 'bidBdrInfraDevpSplConstr', label: 'Bdr Infra Devp Spl Constr', type: 'string' },
      { name: 'bidBdrInfraDevpComnInfra', label: 'Bdr Infra Devp Comn Infra', type: 'string' },
      { name: 'bidBdrInfraDevpRdsCl', label: 'Bdr Infra Devp Rds Cl', type: 'string' },
      { name: 'bidBdrInfraDevpRdsLength', label: 'Bdr Infra Devp Rds Length', type: 'string' },
      { name: 'bidTypeRd', label: 'Type Rd', type: 'dropdown', options: ['All_wx', 'Fair_wx'] },
      { name: 'bidBrSpan', label: 'Br Span', type: 'string' },
      { name: 'bidBrCl', label: 'Br Cl', type: 'string' },
      { name: 'bidNosOfSettlements', label: 'Nos Of Settlements', type: 'string' },
      { name: 'bidNoOfHouses', label: 'No Of Houses', type: 'string' },
    ],
    'Def Improvement': [
      { name: 'diLocs', label: 'Locs', type: 'string' },
      { name: 'diPdsOhp', label: 'Pds Ohp', type: 'string' },
      { name: 'diPdsWoOhp', label: 'Pds Wo Ohp', type: 'string' },
      { name: 'diWpnPitsOhp', label: 'Wpn Pits Ohp', type: 'string' },
      { name: 'diWpnPitsWoOhp', label: 'Wpn Pits Wo Ohp', type: 'string' },
      { name: 'diComnTrenchesCovered', label: 'Comn Trenches Covered', type: 'string' },
      { name: 'diComnTrenchesUncovered', label: 'Comn Trenches Uncovered', type: 'string' },
      { name: 'diConstrBy', label: 'Constr By', type: 'dropdown', options: ['Mil', 'Civ'] },
    ],
    'Gun As / SAM sites': [
      { name: 'gaSsSamSiteLocs', label: 'Sam Site Locs', type: 'string' },
      { name: 'gaSsNoOfRamps', label: 'No Of Ramps', type: 'string' },
    ],
    'Amn Dumps / Caches / Msl Silos Devp': [
      { name: 'adcmAmnDumpsType', label: 'Amn Dumps Type', type: 'dropdown', options: ['Overgrnd_Hardened', 'Overgrnd_Temp', 'Undergrnd'] },
      { name: 'adcmAmnDumpsQty', label: 'Amn Dumps Qty', type: 'string' },
    ],
    'Addl Billeting': [
      { name: 'abAddlBilletingType', label: 'Addl Billeting Type', type: 'dropdown', options: ['Permt', 'Temp'] },
      { name: 'abAddlBilletingQty', label: 'Addl Billeting Qty', type: 'string' },
    ],
    'Comn Infra Devp - Rd/ Br/ Rail/ Air': [
      { name: 'cidTypeOfInfra', label: 'Type Of Infra', type: 'dropdown', options: ['Rd', 'Rail', 'Air', 'Br'] },
      { name: 'cidTypeOfInfraDescription', label: 'Type Of Infra Description', type: 'string' },
      { name: 'cidBdrInfraDevpQty', label: 'Bdr Infra Devp Qty', type: 'string' },
      { name: 'cidFromLoc', label: 'From Loc', type: 'string' },
      { name: 'cidToLoc', label: 'To Loc', type: 'string' }
    ],
    'Comn Tower / Radome Contsr': [
      { name: 'ctrcTypeOfComnInfra', label: 'Type Of Comn Infra', type: 'dropdown', options: ['Radome', 'Radar', 'BTS', 'CoW', 'MW'] },
      { name: 'ctrcComnTowerQty', label: 'Comn Tower Qty', type: 'string' },
      { name: 'ctrcComnTowerRemarks', label: 'Comn Tower Remarks', type: 'string' }
    ],
    'Lgs Dumping': [
      { name: 'ldNoOfShelters', label: 'No Of Shelters', type: 'string' },
      { name: 'ldModeOfDumping', label: 'Mode Of Dumping', type: 'dropdown', options: ['Veh', 'Train', 'Air'] },
      { name: 'ldLgsDumpingTypeOfLgs', label: 'Lgs Dumping Type Of Lgs', type: 'dropdown', options: ['FOL', 'Supplies', 'Amn'] },
      { name: 'ldNoOfVehFol', label: 'No Of Veh Fol', type: 'string' },
      { name: 'ldNoOfVehSupplies', label: 'No Of Veh Supplies', type: 'string' },
      { name: 'ldNoOfVehAmn', label: 'No Of Veh Amn', type: 'string' },
      { name: 'ldNoOfVehConstrMtrl', label: 'No Of Veh Constr Mtrl', type: 'string' },
      { name: 'ldNoOfTrainsFol', label: 'No Of Trains Fol', type: 'string' },
      { name: 'ldNoOfTrainsSupplies', label: 'No Of Trains Supplies', type: 'dropdown', options: ['Rd', 'Rail', 'Air'] },
      { name: 'ldNoOfTrainsAmn', label: 'No Of Trains Amn', type: 'string' },
      { name: 'ldNoOfTrainsConstrMtrl', label: 'No Of Trains Constr Mtrl', type: 'string' }
    ],
    'Br Stores Dumping': [
      { name: 'bsdBrStoresDumpingNoOfVehs', label: 'Br Stores Dumping No Of Vehs', type: 'string' },
      { name: 'bsdBrStoresDumpingDescriptionStores', label: 'Br Stores Dumping Description Stores', type: 'string' },
    ],
    'Engr Stores Dumping': [
      { name: 'esdEngrStoresDumpingNoOfVehs', label: 'Engr Stores Dumping No Of Vehs', type: 'string' },
      { name: 'esdEngrStoresDumpingDescriptionStores', label: 'Engr Stores Dumping Description Stores', type: 'string' },
    ],
    'Vis': [
      { name: 'vLoc', label: 'Loc', type: 'string' },
      { name: 'vLevel', label: 'Level', type: 'string' },
      { name: 'vFromTime', label: 'From time', type: 'time' },
      { name: 'vTotime', label: 'To Time', type: 'time' },
      { name: 'vNoOfIndis', label: 'No_Of_Indis', type: 'string' },
    ],
    'Bilatera l/ Multilateral Mtgs': [
      { name: 'bmmLoc', label: 'Loc', type: 'string' },
      { name: 'bmmLevel', label: 'Level', type: 'string' },
      { name: 'bmmFromTime', label: 'From time', type: 'time' },
      { name: 'bmmToTime', label: 'To Time', type: 'time' },
      { name: 'bmmNoOfIndis', label: 'No_Of_Indis', type: 'string' }
    ],
    'Conf': [
      { name: 'cLoc', label: 'Loc', type: 'string' },
      { name: 'cLevel', label: 'Level', type: 'string' },
      { name: 'cFromTime', label: 'From time', type: 'time' },
      { name: 'cToTime', label: 'To Time', type: 'time' },
      { name: 'cNoOfIndis', label: 'No_Of_Indis', type: 'string' }
    ],
    'Alliances': [
      { name: 'aDate', label: 'Date', type: 'date' },
      { name: 'aWith', label: 'With', type: 'string' },
      { name: 'aAgenda', label: 'Agenda', type: 'string' }
    ],
    'Collusivity': [
      { name: 'cDate', label: 'Date', type: 'date' },
      { name: 'cWith', label: 'With', type: 'string' }
    ],
    'Jt Ventures': [
      { name: 'jvDate', label: 'Date', type: 'date' },
      { name: 'jvWith', label: 'With', type: 'string' }
    ],
    'Expulsion / Arrest of Diplomats': [
      { name: 'eadLoc', label: 'Loc', type: 'string' },
      { name: 'eadDate', label: 'Date', type: 'date' },
      { name: 'eadTime', label: 'Time', type: 'time' },
      { name: 'eadOfCountry', label: 'Of_Country', type: 'string' }
    ],
    'Closure of Diplomatic Msns': [
      { name: 'cdmLoc', label: 'Loc', type: 'string' },
      { name: 'cdmDate', label: 'Date', type: 'date' },
      { name: 'cdmTime', label: 'Time', type: 'time' },
      { name: 'cdmOfCountry', label: 'Of_Country', type: 'string' }
    ],
    'Recalling of Diplomats': [
      { name: 'rdLoc', label: 'Loc', type: 'string' },
      { name: 'rdDate', label: 'Date', type: 'date' },
      { name: 'rdTime', label: 'Time', type: 'time' },
      { name: 'rdFromCountry', label: 'From_Country', type: 'string' }
    ],
    'Disregard to Agreements / Protocols / MOUs': [
      { name: 'dapmLoc', label: 'Loc', type: 'string' },
      { name: 'dapmDate', label: 'Date', type: 'date' },
      { name: 'dapmTime', label: 'Time', type: 'time' },
      { name: 'dapmTypeOfAgreement', label: 'Type_of_Agreement', type: 'string' },
    ],
    'Cartographic Aggression': [
      { name: 'caLoc', label: 'Loc', type: 'string' },
      { name: 'caNoOfLocs', label: 'No_of_Locs', type: 'string' },
      { name: 'caDate', label: 'Date', type: 'date' },
      { name: 'caTime', label: 'Time', type: 'time' },
    ],
    'Misinfo / Disinfo': [
      { name: 'mdLoc', label: 'Loc', type: 'string' },
      { name: 'mdDate', label: 'Date', type: 'date' },
      { name: 'mdTime', label: 'Time', type: 'time' },
      { name: 'mdTgtAgenda', label: 'Tgt_Agenda', type: 'string' },
    ],
    'Display of Mil Prowess': [
      { name: 'dmpLoc', label: 'Loc', type: 'string' },
      { name: 'dmpDate', label: 'Date', type: 'date' },
      { name: 'dmpTime', label: 'Time', type: 'time' },
      { name: 'dmpType', label: 'Type', type: 'string' },
      { name: 'dmpLevel', label: 'Level', type: 'dropdown', options: ['National', 'Regional', 'International'] },
    ],
    'Media Rhetoric': [
      { name: 'mrLoc', label: 'Loc', type: 'string' },
      { name: 'mrDate', label: 'Date', type: 'date' },
      { name: 'mrTime', label: 'Time', type: 'time' },
      { name: 'mrType', label: 'Type', type: 'string' },
    ],
    'Engr IS Disturbances': [
      { name: 'eidLoc', label: 'Loc', type: 'string' },
      { name: 'eidDate', label: 'Date', type: 'date' },
      { name: 'eidTime', label: 'Time', type: 'time' },
      {
        name: 'eidType', label: 'Type', type: 'dropdown', options: [
          'Ci v Unrest / Violence', 'Insurgency', 'Protests', 'Strikes', 'Espionage',
          'Sabotage', 'Corruption', 'Disclosure of info', 'Loss of Capb & Resources'
        ]
      },
    ],
    'Trade Embargo': [
      { name: 'teLoc', label: 'Loc', type: 'string' },
      { name: 'teDate', label: 'Date', type: 'date' },
      { name: 'teTime', label: 'Time', type: 'time' },
      { name: 'teOnWhom', label: 'On_Whom', type: 'string' },
      {
        name: 'teType', label: 'Type', type: 'dropdown', options: [
          'Commercial_Type', 'Commercial_Nos', 'Govt_Type', 'Govt_Nos', 'Imports', 'Exports'
        ]
      },
    ],
    'Sanctions': [
      { name: 'sLoc', label: 'Loc', type: 'string' },
      { name: 'sDate', label: 'Date', type: 'date' },
      { name: 'sTime', label: 'Time', type: 'time' },
      { name: 'sByWhom', label: 'By_Whom', type: 'string' },
      { name: 'sOnWhom', label: 'On_Whom', type: 'string' },
      {
        name: 'sType', label: 'Type', type: 'dropdown', options: [
          'Commercial_Type', 'Commercial_Nos', 'Govt_Type', 'Govt_Nos', 'Imports', 'Exports'
        ]
      },
    ],
    'Energy Sup Disruption': [
      { name: 'esdLoc', label: 'Loc', type: 'string' },
      { name: 'esdDate', label: 'Date', type: 'date' },
      { name: 'esdTime', label: 'Time', type: 'time' },
      { name: 'esdOnWhom', label: 'On_Whom', type: 'string' },
    ],
    'Tenders': [
      { name: 'tLoc', label: 'Loc', type: 'string' },
      { name: 'tDate', label: 'Date', type: 'date' },
      { name: 'tTime', label: 'Time', type: 'time' },
      { name: 'tBywhom', label: 'By_Whom', type: 'string' },
      { name: 'tToWhom', label: 'To_Whom', type: 'string' },
      { name: 'tType', label: 'Type', type: 'dropdown', options: ['Commercial_Type', 'Commercial_Nos', 'Govt_Type', 'Govt_Nos', 'Level'] }
    ],
    'Opening / Closure Trade Routes': [
      { name: 'octrLoc', label: 'Loc From', type: 'string' },
      { name: 'octrLocTo', label: 'Loc To', type: 'string' },
      { name: 'octrDate', label: 'Date', type: 'date' },
      { name: 'octrTime', label: 'Time From', type: 'time' },
      { name: 'octrTimeTo', label: 'Time To', type: 'time' }
    ],
    'Pol Unrest': [
      { name: 'puLoc', label: 'Loc', type: 'string' },
      { name: 'puDate', label: 'Date', type: 'date' },
      { name: 'puTime', label: 'Time', type: 'time' },
      { name: 'puLevel', label: 'Level', type: 'string' }
    ],
    'Regional Unrest Impact': [
      { name: 'ruiLoc', label: 'Loc', type: 'string' },
      { name: 'ruiDate', label: 'Date', type: 'date' },
      { name: 'ruiTime', label: 'Time', type: 'time' },
      { name: 'ruiLevel', label: 'Level', type: 'string' }
    ],
    'Fin Instability': [
      { name: 'fiSector', label: 'Sector', type: 'string' },
      { name: 'fiDate', label: 'Date', type: 'date' },
      { name: 'fiTime', label: 'Time', type: 'time' }
    ],
    'Hlth Concerns': [
      { name: 'hcLoc', label: 'Loc', type: 'string' },
      { name: 'hcDate', label: 'Date', type: 'date' },
      { name: 'hcTime', label: 'Time', type: 'time' },
      { name: 'hcType', label: 'Type', type: 'string' },
      { name: 'hclLevel', label: 'Level', type: 'dropdown', options: ['Local', 'Regional', 'National', 'International', 'Emergency', 'Primary', 'Secondary', 'Tertiary'] }
    ],
    'Heightened Cyber Ops': [
      { name: 'hcoLoc', label: 'Loc', type: 'string' },
      { name: 'hcoDate', label: 'Date', type: 'date' },
      { name: 'hcoTime', label: 'Time', type: 'time' },
      { name: 'hcoTimeTo', label: 'Time To', type: 'string' },
      { name: 'hcoTgt', label: 'Tgt', type: 'string' },
      { name: 'hcoLevel', label: 'Level', type: 'dropdown', options: ['Local', 'Regional', 'National', 'International'] }
    ],
    'Tgt Critical Infra / NWs': [
      { name: 'tcinLoc', label: 'Loc', type: 'string' },
      { name: 'tcinDate', label: 'Date', type: 'date' },
      { name: 'tcinTime', label: 'Time', type: 'time' },
      { name: 'tcinTimeTo', label: 'Time To', type: 'string' },
      { name: 'tcinTgt', label: 'Tgt', type: 'string' }
    ],
    'Hiring of Tech Skilled Indls': [
      { name: 'htsiLoc', label: 'Loc', type: 'string' },
      { name: 'htsiNoOfIndis', label: 'No of Indis', type: 'string' },
      { name: 'htsiPurpose', label: 'Purpose', type: 'string' }
    ],
    'Incr Def Spending': [
      { name: 'idsLoc', label: 'Loc', type: 'string' },
      { name: 'idsDate', label: 'Date', type: 'date' },
      { name: 'idsSection', label: 'Section', type: 'dropdown', options: ['Sustenance', 'Operational Preparedness', 'Tech', 'Production', 'Pay & Allces'] }
    ],
    'Incr Production': [
      { name: 'ipLoc', label: 'Loc', type: 'string' },
      { name: 'ipDate', label: 'Date', type: 'date' },
      { name: 'ipType', label: 'Eqpt_Type', type: 'string' },
      { name: 'ipTypeEqpt_Nos', label: 'Eqpt_Nos', type: 'string' },
      { name: 'ipTypeArms_Type', label: 'Arms_Type', type: 'string' },
      { name: 'ipTypeArms_Nos', label: 'Arms_Nos', type: 'string' },
      { name: 'ipTypeAmn_Type', label: 'Amn_Type', type: 'string' },
      { name: 'ipTypeAmn_Nos', label: 'Amn_Nos', type: 'string' },
      { name: 'ipTypeTech_Type', label: 'Tech_Type', type: 'string' },
      { name: 'ipTypeTech_Nos', label: 'Tech_Nos', type: 'string' },
      { name: 'ipTypeWLS_Type', label: 'WLS_Type', type: 'string' },
      { name: 'ipTypeWLS_Noss', label: 'WLS_Nos', type: 'string' }
    ],
    'Enhanced Tibetan Rect': [
      { name: 'etrLoc', label: 'Loc', type: 'string' },
      { name: 'etrDate', label: 'Date', type: 'date' },
      { name: 'etrNosRect', label: 'Nos_Rect', type: 'string' }
    ],
    'Embodiment of Res': [
      { name: 'erLoc', label: 'Loc', type: 'string' },
      { name: 'erDate', label: 'Date', type: 'date' },
      { name: 'erRect', label: 'Nos_Rect', type: 'string' }
    ],
    'Forced Conscription': [
      { name: 'fcLoc', label: 'Loc', type: 'string' },
      { name: 'fcDate', label: 'Date', type: 'date' },
      { name: 'fcNosRect', label: 'Nos_Rect', type: 'string' }
    ],
    'Incr Port Calls': [
      { name: 'ipcLoc', label: 'Loc', type: 'string' },
      { name: 'ipcDate', label: 'Date', type: 'date' },
      { name: 'ipcTimeFrom', label: 'Time From', type: 'time' },
      { name: 'ipcTimeTo', label: 'Time To', type: 'time' },
      { name: 'ipcType', label: 'Commercial_Type', type: 'string' },
      { name: 'ipcTypeCommercial_Nos', label: 'Commercial_Nos', type: 'string' },
      { name: 'ipcTypeWarship_Type', label: 'Warship_Type', type: 'string' },
      { name: 'ipcTypeWarship_Nos', label: 'Warship_Nos', type: 'string' },
      { name: 'ipcTypeSvl_Type', label: 'Svl_Type', type: 'string' },
      { name: 'ipcTypeSvl_Nos', label: 'Svl_Nos', type: 'string' }
    ],
    'Mil Alliances': [
      { name: 'maDate', label: 'Date', type: 'date' },
      { name: 'maWith', label: 'With', type: 'string' },
      { name: 'maAgenda', label: 'Agenda', type: 'string' },
    ],
    'Intensified EW Activities': [
      { name: 'ieaLoc', label: 'Loc', type: 'string' },
      { name: 'ieaDate', label: 'Date', type: 'date' },
      { name: 'ieaTime', label: 'Time From', type: 'time' },
      { name: 'ieaTimeTo', label: 'Time To', type: 'time' },
      { name: 'ieaTypeOfActivity', label: 'Type_of_Activity', type: 'string' },
    ],
    'BPMs': [
      { name: 'bpmLoc', label: 'Loc', type: 'string' },
      { name: 'bpmDate', label: 'Date', type: 'date' },
      { name: 'bpmBetween', label: 'Between', type: 'string' },
      { name: 'bpmTimeFrom', label: 'Time From', type: 'time' },
      { name: 'bpmTimeTo', label: 'Time To', type: 'time' },
      { name: 'bpmNpm', label: 'No_of_Pers_Mil', type: 'string' },
      { name: 'bpmNpo', label: 'No_of_Pers_Others', type: 'string' },
    ],
    'Bdr Interactions': [
      { name: 'biLoc', label: 'Loc', type: 'string' },
      { name: 'biDate', label: 'Date', type: 'date' },
      { name: 'biBetween', label: 'Between', type: 'string' },
      { name: 'biTimeFrom', label: 'Time From', type: 'time' },
      { name: 'biTimeTo', label: 'Time To', type: 'time' },
      { name: 'biNpm', label: 'No_of_Pers_Mil', type: 'string' },
      { name: 'biNpo', label: 'No_of_Pers_Others', type: 'string' },
    ],
    'Cease Fire Violations': [
      { name: 'cfvLoc', label: 'Loc', type: 'string' },
      { name: 'cfvate', label: 'Date', type: 'date' },
      { name: 'cfvBetween', label: 'Between', type: 'string' },
      { name: 'cfvTimeFrom', label: 'Time From', type: 'time' },
      { name: 'cfvTimeTo', label: 'Time To', type: 'time' },
    ],
    // Additional configurations for other indicators
  };

  

}
