using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BIS.Common.Enum.Enum;

namespace BIS.Common.Entities
{
    public class MasterData 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public Status? Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int CorpsId { get; set; }
        public int? DivisionId { get; set; }
        public string InputLevel { get; set; }
        public DateTime ReportedDate { get; set; } = DateTime.Now.Date;
        public DateTime? RptDate { get; set; }
        //[Column("Input Level")]
        //[Display(Name = "Input Lvl")]
        //public string Name { get; set; }
        public string Sector { get; set; }
        public int Fmn { get; set; }

        //public int? CorpsId { get; set; }
        //[ForeignKey("MasterFmn")]
        //public int? MasterFmnID { get; set; }
        //public virtual MasterFmn FmnNew { get; set; }


        //
        //public int? MasterSectorID { get; set; }
        //[ForeignKey("MasterSector")]
        //[ValidateNever]
        //public MasterSector SectorNew { get; set; }

        //[ForeignKey("MasterInputLevel")]
        //public int? MasterInputlevelID { get; set; }
        //public virtual MasterInputLevel InputLevelNew { get; set; }

        //[ForeignKey("MasterSource")]
        //public int? MasterSourceID { get; set; }
        //public virtual MasterSource SourceNew { get; set; }

        public string Source { get; set; }
        public string SourceLoc { get; set; }
        public string TypeOfLoc { get; set; }
        public string EnLocName { get; set; }
        public string Aspect { get; set; }
        public string? Indicator { get; set; }
        public string Frmn { get; set; }

        #region PlacementofaddlSvlEqpt
        public string? TypeSvlEqpt { get; set; }
        public string? NoSvlEqpt { get; set; }
        public string? HtM { get; set; }
        public string? Tgt { get; set; }
        public string? POASEReamrks { get; set; }
        #endregion

        #region Incr Recce
        public string? VisSrOffrs { get; set; }
        public string? Ptls { get; set; }
        public string? NewTps { get; set; }
        public string? Cvys { get; set; }
        public string? Obsn { get; set; }
        public string? IRRemarks { get; set; }

        #endregion

        #region Incr in OP loc
        public string? Type { get; set; }
        public string? TimeFrom { get; set; }
        public string? TimeTo { get; set; }
        public string? IOLRemarks { get; set; }
        #endregion

        #region Jamming
        public string? JammingEqpt { get; set; }
        public string? JammingTimefrom { get; set; }
        public string? JammingTimeto { get; set; }
        public string? JammingDtOfJx { get; set; }
        public string? JammingEffect { get; set; }
        public string? JammingSpecificationFreq { get; set; }
        public string? JammingSpecificationWavelength { get; set; }
        public string? JammingSpecificationType { get; set; }
        public string? JammingRemarks { get; set; }
        #endregion

        #region Enhanced Tourist Influx
        public string? ETINoOfTourists { get; set; }
        public string? ETITimefrom { get; set; }
        public string? ETITimeto { get; set; }
        public string? ETIFrequencyDaily { get; set; }
        public string? ETIFrequencyWeekly { get; set; }
        public string? ETIFrequencySeasonal { get; set; }
        #endregion

        #region Face-off / Skirmish
        public string? FoSTimefrom { get; set; }
        public string? FoSTimeto { get; set; }
        public string? FoSSkirmishPurpose { get; set; }
        public string? FoSSkirmishPlaFmn { get; set; }
        public string? FoSSkirmishPlaNoOfPers { get; set; }
        public string? FoSSkirmishPlaNoOfOffrs { get; set; }
        public string? FoSSkirmishPlaNoOfJcos { get; set; }
        public string? FoSSkirmishPlaNoOfOr { get; set; }
        public string? FoSSkirmishPlaNoOfCiv { get; set; }
        public string? FoSSkirmishPlaNameOfOffrs { get; set; }
        public string? FoSCas { get; set; }
        public string? FoSDamageEqpt { get; set; }
        public string? FoSDamageProperty { get; set; }
        public string? FoSLossWpn { get; set; }
        public string? FoSLossAmn { get; set; }
        public string? FoSLossEqpt { get; set; }
        public string? FoSCasFatal { get; set; }
        public string? FoSCasNonFatal { get; set; }
        #endregion

        #region Activation of Dormant Z
        public string? ADZTimefrom { get; set; }
        public string? ADZTimeto { get; set; }
        public string? ADZNoOfPers { get; set; }
        public string? ADZActivity { get; set; }
        #endregion

        #region Setting_of_camp
        public string? SoCUnitType { get; set; }
        public string? SoCNoOfUnits { get; set; }
        public string? SoCOccupiedBy { get; set; }
        public string? SoCNoOfPlaPers { get; set; }
        public string? SoCNoOfCivs { get; set; }
        public string? SoCNoOfRbaPers { get; set; }
        public string? SoCNoOfPapfPers { get; set; }
        public string? SoCNoOfMilitia { get; set; }
        public string? SoCNoOfEqpt { get; set; }
        public string? SoCDescription { get; set; }
        #endregion

        #region Grazier Activity
        public string? GANoOfGraziers { get; set; }
        public string? GANoOfAnimals { get; set; }
        public string? GANoOfDu { get; set; }
        public string? GAGrazierDescription { get; set; }
        #endregion

        #region Aggressive recce
        public string? ARAggressiveRecceNoOfPers { get; set; }
        public string? ARTypeOfPers { get; set; }
        public string? ARAggressiveRecceDescription { get; set; }
        #endregion

        #region Drone Activity / Incursion
        public string? DAINoOfDrones { get; set; }
        public string? DAIAltM { get; set; }
        public string? DAITypeOfDrone { get; set; }
        public string? DAIFltPathLocA { get; set; }
        public string? DAIFltPathLocB { get; set; }
        public string? DAIFltPathLocC { get; set; }
        public string? DAIFltPathLocD { get; set; }
        public string? DAIDirnFrom { get; set; }
        public string? DAIDirnTo { get; set; }
        public string? DAIIncursionKms { get; set; }
        #endregion

        #region Comb Ac in Proximity
        public string? CAPNoOfAeProximity { get; set; }
        public string? CAPTypeOfAeProximity { get; set; }
        public string? CAPFltPathLocA { get; set; }
        public string? CAPFltPathLocB { get; set; }
        public string? CAPFltPathLocC { get; set; }
        public string? CAPProximityDirnFrom { get; set; }
        public string? CAPProximityDirnTo { get; set; }
        public string? CAPIncursionKms { get; set; }
        public string? CAPActivity { get; set; }
        #endregion

        #region Fighter_activity_near_LAC
        public string? FLACNoOfAc { get; set; }
        public string? FLACAltM { get; set; }
        public string? FLACTypeOfAc { get; set; }
        public string? FLACFltPathLocA { get; set; }
        public string? FLACFltPathLocB { get; set; }
        public string? FLACFltPathLocC { get; set; }
        public string? FLACFltPathLocD { get; set; }
        public string? FLACAcDirnFrom { get; set; }
        public string? FLACAcDirnTo { get; set; }
        public string? FLACActivity { get; set; }
        #endregion

        #region Airspace Violation
        public string? AVNoOfAePlatform { get; set; }
        public string? AVAltM { get; set; }
        public string? AVAirspaceViolationTypeOfAc { get; set; }
        public string? AVFltPathLocA { get; set; }
        public string? AVFltPathLocB { get; set; }
        public string? AVFltPathLocC { get; set; }
        public string? AVFltPathLocD { get; set; }
        public string? AVAirspaceViolationDirnFrom { get; set; }
        public string? AVAirspaceViolationDirnTo { get; set; }
        public string? AVActivity { get; set; }
        public string? AVIncursionKms { get; set; }

        #endregion

        #region Enhanced Str / Force Posturing
        public string? ESFPTypeOfPers { get; set; }
        public string? ESFPStr { get; set; }
        public string? ESFPIden { get; set; }
        public string? ESFPDisposition { get; set; }
        public string? ESFPDispositionRemarks { get; set; }
        #endregion

        #region Res Build Up
        public string? RBUTypeOfPers { get; set; }
        public string? RBUResBuildUpStr { get; set; }
        public string? RBUResBuildUpRemarks { get; set; }
        #endregion

        #region Conc of A vehs
        public string? CAVConcOfVehsTypeOfVeh { get; set; }
        public string? CAVConcOfVehsStr { get; set; }
        public string? CAVConcOfVehsIden { get; set; }
        public string? CAVConcOfVehsDisposition { get; set; }
        public string? CAVConcOfVehsDispositionRemarks { get; set; }
        #endregion

        #region Trg Ex
        public string? TETypeOfTrg { get; set; }
        public string? TETrgExStr { get; set; }
        public string? TETrgExIden { get; set; }
        public string? TETrgExDisposition { get; set; }
        public string? TETrgExDispositionRemarks { get; set; }
        #endregion

        #region A Vehs Mov
        public string? AVNTypeOfVeh { get; set; }
        public string? AVNStr { get; set; }
        public string? AVNIden { get; set; }
        public string? AVNDirnLocA { get; set; }
        public string? AVNDirnLocB { get; set; }
        public string? AVNDirnLocC { get; set; }
        public string? AVNVehsNovMode { get; set; }
        public string? AVNNomenclatureOfRd { get; set; }
        #endregion

        #region Arty Guns / LRVs Mov
        public string? AGLMTypeOfArty { get; set; }
        public string? AGLMTypeOfPlatform { get; set; }
        public string? AGLMStr { get; set; }
        public string? AGLMIden { get; set; }
        public string? AGLMDirnLocA { get; set; }
        public string? AGLMDirnLocB { get; set; }
        public string? AGLMDirnLocC { get; set; }
        public string? AGLMArtyGunsMode { get; set; }
        public string? AGLMNomenclatureOfRd { get; set; }
        #endregion

        #region  Arty Amn Dumping
        public string? AADTypeOfAmn { get; set; }
        public string? AADArtyAmnDumpingNoAmnVehs { get; set; }
        public string? AADRouteLocA { get; set; }
        public string? AADRouteLocB { get; set; }
        public string? AADRouteLocC { get; set; }
        public string? AADArtyAmnDumpingMode { get; set; }
        public string? AADNomenclatureOfRd { get; set; }
        #endregion

        #region Engr Coln Mov
        public string? ECMTypeOfEqpt { get; set; }
        public string? ECMEngrColnNovStr { get; set; }
        public string? ECMIden { get; set; }
        public string? ECMEngrColnNovRouteLocA { get; set; }
        public string? ECMEngrColnNovRouteLocB { get; set; }
        public string? ECMEngrColnNovRouteLocC { get; set; }
        public string? ECMEngrColnNovMode { get; set; }
        public string? ECMNomenclatureOfRd { get; set; }
        #endregion

        #region Constr of Op Wks
        public string? COWBilleting { get; set; }
        public string? COWStorage { get; set; }
        public string? COWSplConstr { get; set; }
        #endregion

        #region Bdr Infra Devp
        public string? BIDBdrInfraDevpBilleting { get; set; }
        public string? BIDBdrInfraDevpStorage { get; set; }
        public string? BIDBdrInfraDevpSplConstr { get; set; }
        public string? BIDBdrInfraDevpComnInfra { get; set; }
        public string? BIDBdrInfraDevpRdsCl { get; set; }
        public string? BIDBdrInfraDevpRdsLength { get; set; }
        public string? BIDTypeRd { get; set; }
        public string? BIDBrSpan { get; set; }
        public string? BIDBrCl { get; set; }
        public string? BIDNosOfSettlements { get; set; }
        public string? BIDNoOfHouses { get; set; }
        #endregion

        #region Def Improvement
        public string? DILocs { get; set; }
        public string? DIPdsOhp { get; set; }
        public string? DIPdsWoOhp { get; set; }
        public string? DIWpnPitsOhp { get; set; }
        public string? DIWpnPitsWoOhp { get; set; }
        public string? DIComnTrenchesCovered { get; set; }
        public string? DIComnTrenchesUncovered { get; set; }
        public string? DIConstrBy { get; set; }
        #endregion

        #region Gun As / SAM sites
        public string? GASsSamSiteLocs { get; set; }
        public string? GASsNoOfRamps { get; set; }
        #endregion

        #region Amn Dumps / Caches / Msl Silos Devp
        public string? ADCMAmnDumpsType { get; set; }
        public string? ADCMAmnDumpsQty { get; set; }
        #endregion

        #region Addl Billeting
        public string? ABAddlBilletingType { get; set; }
        public string? ABAddlBilletingQty { get; set; }
        #endregion

        #region Comn Infra Devp – Rd/ Br/ Rail/ Air
        public string? CIDTypeOfInfra { get; set; }
        public string? CIDTypeOfInfraDescription { get; set; }
        public string? CIDBdrInfraDevpQty { get; set; }
        public string? CIDFromLoc { get; set; }
        public string? CIDToLoc { get; set; }


        //Additional fields in Comn Infra Decp -Rd/Br/Rail/Air (UNDER TYPE of INFRA)
        /* public string? CIDToLoc { get; set; }*/

        public string? CIDTOIRoadCl { get; set; }
        public string? CIDTOIRailBroadGauge { get; set; }
        public string? CIDTOIRailMetreGauge { get; set; }
        public string? CIDTOIRailRailwaySidings { get; set; }
        public string? CIDTOIRailDescription { get; set; }
        public string? CIDTOIAirLengthAitstrip { get; set; }
        public string? CIDTOIAirNoOfHangers { get; set; }
        public string? CIDTOIAirNoOfHAS { get; set; }
        public string? CIDTOIAirMiscShelters { get; set; }
        public string? CIDTOIBrSpan { get; set; }
        public string? CIDTOIBrWidth { get; set; }
        public string? CIDTOIBrCl { get; set; }
        public string? CIDTOIBrPermt { get; set; }
        public string? CIDTOIBrTemp { get; set; }
        #endregion

        #region Comn Tower / Radome Contsr
        public string? CTRCTypeOfComnInfra { get; set; }
        public string? CTRCComnTowerQty { get; set; }
        public string? CTRCComnTowerRemarks { get; set; }
        #endregion

        #region Lgs Dumping
        public string? LDNoOfShelters { get; set; }
        public string? LDModeOfDumping { get; set; }
        public string? LDLgsDumpingTypeOfLgs { get; set; }
        public string? LDNoOfVehFol { get; set; }
        public string? LDNoOfVehSupplies { get; set; }
        public string? LDNoOfVehAmn { get; set; }
        public string? LDNoOfVehConstrMtrl { get; set; }
        public string? LDNoOfTrainsFol { get; set; }
        public string? LDNoOfTrainsSupplies { get; set; }
        public string? LDNoOfTrainsAmn { get; set; }
        public string? LDNoOfTrainsConstrMtrl { get; set; }
        #endregion

        #region Br Stores Dumping
        public string? BSDBrStoresDumpingNoOfVehs { get; set; }
        public string? BSDBrStoresDumpingDescriptionStores { get; set; }
        #endregion

        #region Engr Stores Dumping
        public string? ESDEngrStoresDumpingNoOfVehs { get; set; }
        public string? ESDEngrStoresDumpingDescriptionStores { get; set; }
        #endregion

        #region Incr Vehs in Stg As
        public string? IVSAIncrVehsInStgAsTypeOfVeh { get; set; }
        public string? IVSAIncrVehsInStgAsStr { get; set; }
        public string? IVSAIden { get; set; }
        public string? IVSAIncrVehsInStgAsDispositionRemarks { get; set; }
        #endregion

        #region Incr Lgs Cvys
        public string? ILCIncrLgsCvysStr { get; set; }
        public string? ILCIden { get; set; }
        public string? ILCIncrLgsCvysRouteLocA { get; set; }
        public string? ILCIncrLgsCvysRouteLocB { get; set; }
        public string? ILCIncrLgsCvysRouteLocC { get; set; }
        public string? ILCIncrLgsCvysMode { get; set; }
        public string? ILCNomenclatureOfRd { get; set; }
        #endregion

        #region Incr Lgs Trains
        public string? ILTIncrLgsTrainsDateFrom { get; set; }
        public string? ILTIncrLgsTrainsDateTo { get; set; }
        public string? ILTNoOfTrainsRoutine { get; set; }
        public string? ILTNoOfTrainsEnhanced { get; set; }
        public string? ILTNoOfTrainsIncr { get; set; }
        public string? ILTRouteOrigin { get; set; }
        public string? ILTRouteDestination { get; set; }
        public string? ILTTypeOfLgs { get; set; }
        #endregion

        #region Incr Radio Tfc
        public string? IRTIncrRadioTfcDateFrom { get; set; }
        public string? IRTIncrRadioTfcDateTo { get; set; }
        public string? IRTTxnBand { get; set; }
        public string? IRTTypeOfTxn { get; set; }
        public string? IRTNoOfTxns { get; set; }
        #endregion

        #region  Trg Ex
        public string? TETypeOfForces { get; set; }
        public string? TEMobTrgExStr { get; set; }
        public string? TEMobTrgExIden { get; set; }
        public string? TEMobTrgExDisposition { get; set; }
        public string? TEMobTrgExEqptOnWheels { get; set; }
        public string? TEMobTrgExActivityTrg { get; set; }
        public string? TEActivityRoutine { get; set; }
        public string? TEHault { get; set; }
        #endregion

        #region Re-loc of Forces
        public string? RLFPermtLocName { get; set; }
        public string? RLFNewLocName { get; set; }
        public string? RLFReLocOfForcesDate { get; set; }
        public string? RLFQuantumTps { get; set; }
        public string? RLFQuantumAVehs { get; set; }
        public string? RLFQuantumBVehs { get; set; }
        public string? RLFQuantumCVehs { get; set; }
        public string? RLFBilletingType { get; set; }
        public string? RLFReLocOfForcesIden { get; set; }
        #endregion

        #region TRSO Mov
        public string? TMMobTrsoMovStr { get; set; }
        public string? TMEnFmn { get; set; }
        public string? TMEnUnit { get; set; }
        public string? TMTrsoMovRouteLocA { get; set; }
        public string? TMTrsoMovRouteLocB { get; set; }
        public string? TMTrsoMovRouteLocC { get; set; }
        public string? TMTrsoMovMode { get; set; }
        public string? TMHaltLocA { get; set; }
        public string? TMHaltLocB { get; set; }
        public string? TMHaltLocC { get; set; }
        public int UserId { get; set; }
        #endregion


        #region Heightened diplomatic Eng (HDE) -> Vis
        public string? VLoc { get; set; }
        public string? VLevel { get; set; }
        public string? VFromTime { get; set; }
        public string? VTotime { get; set; }
        public string? VNoOfIndis { get; set; }
        #endregion

        #region Bilateral l/ Multilateral Mtgs
        public string? BMMLoc { get; set; }
        public string? BMMLevel { get; set; }
        public string? BMMFromTime { get; set; }
        public string? BMMToTime { get; set; }
        public string? BMMNoOfIndis { get; set; }
        #endregion

        #region Conf
        public string? CLoc { get; set; }
        public string? CLevel { get; set; }
        public string? CFromTime { get; set; }
        public string? CToTime { get; set; }
        public string? CNoOfIndis { get; set; }
        #endregion

        #region Alliances
        public string? ADate { get; set; }
        public string? AWith { get; set; }
        public string? AAgenda { get; set; }
        #endregion

        #region Collusivity
        public string? CDate { get; set; }
        public string? CWith { get; set; }
        #endregion

        #region Jt Ventures
        public string? JVDate { get; set; }
        public string? JVWith { get; set; }
        #endregion

        #region Expulsion / Arrest of Diplomats
        public string? EADLoc { get; set; }
        public string? EADDate { get; set; }
        public string? EADTime { get; set; }
        public string? EADOfCountry { get; set; }
        #endregion

        #region Closure of Diplomatic Msns
        public string? CDMLoc { get; set; }
        public string? CDMDate { get; set; }
        public string? CDMTime { get; set; }
        public string? CDMOfCountry { get; set; }
        #endregion

        #region Recalling of Diplomats
        public string? RDLoc { get; set; }
        public string? RDDate { get; set; }
        public string? RDTime { get; set; }
        public string? RDFromCountry { get; set; }
        #endregion


        #region Disregard to Agreements / Protocols / MOUs
        public string? DAPMLoc { get; set; }
        public string? DAPMDate { get; set; }
        public string? DAPMTime { get; set; }
        public string? DAPMTypeOfAgreement { get; set; }
        #endregion

        #region Cartographic Aggression
        public string? CALoc { get; set; }
        public string? CANoOfLocs { get; set; }
        public string? CADate { get; set; }
        public string? CATime { get; set; }
        #endregion

        #region Misinfo / Disinfo
        public string? MDLoc { get; set; }
        public string? MDDate { get; set; }
        public string? MDTime { get; set; }
        public string? MDTgtAgenda { get; set; }
        #endregion

        #region Display of Mil Prowess
        public string? DMPLoc { get; set; }
        public string? DMPDate { get; set; }
        public string? DMPTime { get; set; }
        public string? DMPType { get; set; }
        public string? DMPLevel { get; set; }

        #endregion

        #region Media Rhetoric
        public string? MRLoc { get; set; }
        public string? MRDate { get; set; }
        public string? MRTime { get; set; }
        public string? MRType { get; set; }
        #endregion

        #region Engr IS Disturbances
        public string? EIDLoc { get; set; }
        public string? EIDDate { get; set; }
        public string? EIDTime { get; set; }
        public string? EIDType { get; set; }
        #endregion

        #region Trade Embargo
        public string? TELoc { get; set; }
        public string? TEDate { get; set; }
        public string? TETime { get; set; }
        public string? TEOnWhom { get; set; }
        public string? TEType { get; set; }
        #endregion

        #region  Sanctions
        public string? SLoc { get; set; }
        public string? SDate { get; set; }
        public string? STime { get; set; }
        public string? SByWhom { get; set; }
        public string? SOnWhom { get; set; }
        public string? SType { get; set; }
        #endregion

        #region Energy Sup Disruption
        public string? ESDLoc { get; set; }
        public string? ESDDate { get; set; }
        public string? ESDTime { get; set; }
        public string? ESDOnWhom { get; set; }
        #endregion

        #region Tenders
        public string? TLoc { get; set; }
        public string? TDate { get; set; }
        public string? TTime { get; set; }
        public string? TBywhom { get; set; }
        public string? TToWhom { get; set; }
        public string? TType { get; set; }
        #endregion

        #region Opening / Closure Trade Routes
        public string? OCTRLoc { get; set; }
        public string? OCTRLocTo { get; set; }
        public string? OCTRDate { get; set; }
        public string? OCTRTime { get; set; }
        public string? OCTRTimeTo { get; set; }
        #endregion


        #region Pol Unrest
        public string? PULoc { get; set; }
        public string? PUDate { get; set; }
        public string? PUTime { get; set; }
        public string? PULevel { get; set; }
        #endregion

        #region Regional Unrest Impact
        public string? RUILoc { get; set; }
        public string? RUIDate { get; set; }
        public string? RUITime { get; set; }
        public string? RUILevel { get; set; }
        #endregion

        #region Fin Instability
        public string? FISector { get; set; }
        public string? FIDate { get; set; }
        public string? FITime { get; set; }
        #endregion

        #region Hlth Concerns
        public string? HCLoc { get; set; }
        public string? HCDate { get; set; }
        public string? HCTime { get; set; }
        public string? HCType { get; set; }
        public string? HCLLevel { get; set; }
        #endregion

        #region Heightened Cyber Ops
        public string? HCOLoc { get; set; }
        public string? HCODate { get; set; }
        public string? HCOTime { get; set; }
        public string? HCOTimeTo { get; set; }
        public string? HCOTgt { get; set; }
        public string? HCOLevel { get; set; }
        #endregion

        #region Tgt Critical Infra / NWs
        public string? TCINLoc { get; set; }
        public string? TCINDate { get; set; }
        public string? TCINTime { get; set; }
        public string? TCINTimeTo { get; set; }
        public string? TCINTgt { get; set; }
        #endregion

        #region Hiring of Tech Skilled Indls
        public string? HTSILoc { get; set; }
        public string? HTSINoOfIndis { get; set; }
        public string? HTSIPurpose { get; set; }
        #endregion

        #region Incr Def  Spending
        public string? IDSLoc { get; set; }
        public string? IDSDate { get; set; }
        public string? IDSSection { get; set; }
        #endregion

        #region Incr Production
        public string? IPLoc { get; set; }
        public string? IPDate { get; set; }
        public string? IPType { get; set; }
        public string? IPTypeEqpt_Nos { get; set; }
        public string? IPTypeArms_Type { get; set; }
        public string? IPTypeArms_Nos { get; set; }
        public string? IPTypeAmn_Type { get; set; }
        public string? IPTypeAmn_Nos { get; set; }
        public string? IPTypeTech_Type { get; set; }
        public string? IPTypeTech_Nos { get; set; }
        public string? IPTypeWLS_Type { get; set; }
        public string? IPTypeWLS_Nos { get; set; }
        #endregion

        #region Enhanced Tibetan Rect
        public string? ETRLoc { get; set; }
        public string? ETRDate { get; set; }
        public string? ETRNosRect { get; set; }
        #endregion

        #region Embodiment of Res
        public string? ERLoc { get; set; }
        public string? ERDate { get; set; }
        public string? ERRect { get; set; }
        #endregion

        #region Forced Conscription
        public string? FCLoc { get; set; }
        public string? FCDate { get; set; }
        public string? FCNosRect { get; set; }
        #endregion

        #region Incr Port Calls
        public string? IPCLoc { get; set; }
        public string? IPCDate { get; set; }
        public string? IPCTimeFrom { get; set; }
        public string? IPCTimeTo { get; set; }
        public string? IPCType { get; set; }
        public string? IPCTypeCommercial_Nos { get; set; }
        public string? IPCTypeWarship_Type { get; set; }
        public string? IPCTypeWarship_Nos { get; set; }
        public string? IPCTypeSvl_Type { get; set; }
        public string? IPCTypeSvl_Nos { get; set; }
        #endregion

        #region Mil Alliances
        public string? MADate { get; set; }
        public string? MAWith { get; set; }
        public string? MAAgenda { get; set; }
        #endregion

        #region Intensified EW Activities
        public string? IEALoc { get; set; }
        public string? IEADate { get; set; }
        public string? IEATime { get; set; }
        public string? IEATimeTo { get; set; }
        public string? IEATypeOfActivity { get; set; }
        #endregion

        #region BPM
        public string? BPMLoc { get; set; }
        public string? BPMDate { get; set; }
        public string? BPMBetween { get; set; }
        public string? BPMTimeFrom { get; set; }
        public string? BPMTimeTo { get; set; }
        public string? BPMNpm { get; set; }
        public string? BPMNpo { get; set; }
        #endregion

        #region Bdr Interactions
        public string? BILoc { get; set; }
        public string? BIDate { get; set; }
        public string? BIBetween { get; set; }
        public string? BITimeFrom { get; set; }
        public string? BITimeTo { get; set; }
        public string? BINpm { get; set; }
        public string? BINpo { get; set; }
        #endregion

        #region Cease Fire Violations
        public string? CfvLoc { get; set; }
        public string? Cfvate { get; set; }
        public string? CfvBetween { get; set; }
        public string? CfvTimeFrom { get; set; }
        public string? CfvTimeTo { get; set; }
        #endregion


    }

    public class MasterSector : CommonModel
    {
        public int CorpsId { get; set; }
        public string Name { get; set; }
    }
    public class MasterInputLevel : CommonModel
    {
        public string Name { get; set; }
        public bool? IfDeleted { get; set; }
    }
    public class Source : CommonModel
    {
        public string Name { get; set; }
    }
    public class MasterLocation : CommonModel
    {
        public string Name { get; set; }
        public CategoryLoc CategoryLoc { get; set; }
    }
    public class EnemyLocation : CommonModel
    {
        public string Name { get; set; }
    }
}
