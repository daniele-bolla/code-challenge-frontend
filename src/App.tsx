import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
import { fetchFleets, fetchSnapshotData, fetchVehicles } from './services/FleetService';
import { Fleet } from './types/fleet';
import { Vehicle } from './types/vehicle';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Snapshot } from './types/data';


function App() {
  /**Map */
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoidHRjLWhheWVza2ciLCJhIjoiY203dWNoZG94MDIyYzJxcjZ6Y2EwY3BybyJ9.Jn4YpF1DPcTaVmqN-uyJxg";

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-74.0060152, 40.7127281],
        zoom: 5,
        maxZoom: 15,
      });
      mapRef.current = map;

      // Add zoom controls
      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // Add your custom markers and lines here

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);
	
  const locationsData = "-0.209872,51.827568;-0.209502,51.828938;-0.209185,51.830303;-0.208803,51.831703;-0.208308,51.83334;-0.207722,51.834641;-0.207053,51.835888;-0.206247,51.837067;-0.205453,51.838158;-0.204703,51.839226;-0.203932,51.840252;-0.203182,51.841213;-0.20252,51.84214;-0.2017,51.843124;-0.200915,51.844177;-0.200163,51.845222;-0.199318,51.846294;-0.198445,51.847462;-0.197622,51.848675;-0.1969,51.849949;-0.196352,51.851238;-0.196023,51.852547;-0.195838,51.853863;-0.195893,51.855213;-0.196027,51.856506;-0.196157,51.857773;-0.196282,51.858986;-0.196438,51.860302;-0.196575,51.861706;-0.196683,51.863098;-0.196852,51.864491;-0.197043,51.865887;-0.197393,51.867252;-0.197893,51.868549;-0.198453,51.869823;-0.199025,51.871117;-0.199623,51.872448;-0.200207,51.873779;-0.200812,51.875103;-0.20152,51.876675;-0.20211,51.877991;-0.202625,51.879234;-0.203175,51.880436;-0.203663,51.881721;-0.204258,51.883072;-0.204885,51.884476;-0.205535,51.885853;-0.206203,51.887203;-0.206982,51.888538;-0.207867,51.889801;-0.208845,51.891037;-0.209992,51.892246;-0.211507,51.893604;-0.212807,51.894672;-0.214138,51.89579;-0.21547,51.896889;-0.216775,51.89798;-0.218073,51.899078;-0.219402,51.900166;-0.22071,51.901279;-0.222048,51.902378;-0.223407,51.903519;-0.224637,51.904678;-0.225708,51.905937;-0.226582,51.907261;-0.227307,51.908646;-0.227803,51.910114;-0.228033,51.911533;-0.228122,51.91288;-0.22795,51.91415;-0.2277,51.915367;-0.227232,51.91658;-0.22658,51.917774;-0.225877,51.918987;-0.224882,51.92028;-0.224067,51.921394;-0.223242,51.922462;-0.222477,51.923485;-0.22175,51.924568;-0.221018,51.925648;-0.220422,51.92675;-0.219858,51.927818;-0.219408,51.928871;-0.218937,51.929955;-0.21838,51.931114;-0.217822,51.932358;-0.217275,51.933605;-0.216685,51.934856;-0.216122,51.936157;-0.215497,51.9375;-0.214858,51.938931;-0.214223,51.940327;-0.213593,51.941715;-0.213003,51.943127;-0.21251,51.944553;-0.212108,51.94595;-0.211842,51.947342;-0.211607,51.949009;-0.211462,51.950367;-0.211312,51.951706;-0.211133,51.953014;-0.210812,51.954258;-0.21036,51.955498;-0.209863,51.956715;-0.209187,51.957863;-0.208423,51.958969;-0.207485,51.960091;-0.206357,51.961243;-0.205105,51.962379;-0.203775,51.963463;-0.202428,51.964481;-0.201077,51.965504;-0.199795,51.966572;-0.198625,51.967674;-0.197612,51.968887;-0.196737,51.970196;-0.196098,51.971577;-0.195747,51.972973;-0.19557,51.974358;-0.195598,51.975716;-0.195888,51.977314;-0.19618,51.978657;-0.196427,51.980042;-0.196685,51.981396;-0.196945,51.982765;-0.197207,51.98415;-0.19745,51.985504;-0.197712,51.98687;-0.197965,51.988224;-0.198125,51.989582;-0.19815,51.990898;-0.198068,51.992123;-0.197905,51.99329;-0.197763,51.994431;-0.197608,51.995575;-0.197483,51.996689;-0.197355,51.997768;-0.197297,51.998863;-0.197305,51.999947;-0.197517,52.001057;-0.197955,52.002171;-0.198478,52.003265;-0.199123,52.004265;-0.199752,52.00526;-0.200415,52.006275;-0.201148,52.007282;-0.201823,52.008251;-0.202553,52.009132;-0.203013,52.009754;-0.203475,52.010387;-0.203963,52.011002;-0.2044,52.011543;-0.20463,52.011845;-0.204647,52.011875;-0.204715,52.011906;-0.204802,52.01194;-0.204842,52.011951;-0.205432,52.012154;-0.206523,52.012257;-0.207597,52.012138;-0.208667,52.012005;-0.210107,52.011868;-0.211735,52.011669;-0.213387,52.011528;-0.215073,52.011391;-0.21671,52.011292;-0.21826,52.01112;-0.219707,52.010998;-0.220917,52.010902;-0.221838,52.010735;-0.22243,52.010483;-0.223518,52.010479;-0.224893,52.010246;-0.22636,52.010017;-0.227848,52.009808;-0.229443,52.009483;-0.23114,52.009251;-0.232838,52.008972;-0.234455,52.008667;-0.23606,52.008438;-0.237653,52.008186;-0.239218,52.00811;-0.240002,52.008156;-0.24031,52.008156;-0.240652,52.008121;-0.241248,52.008411;-0.242145,52.008827;-0.242847,52.009384;-0.243463,52.010052;-0.244173,52.010853;-0.24529,52.012177;-0.246268,52.01326;-0.247163,52.014313;-0.24808,52.015396;-0.248837,52.016315;-0.24937,52.016914;-0.2498,52.017273;-0.250312,52.017418;-0.250607,52.017723;-0.250588,52.018265;-0.250947,52.018925;-0.251288,52.019714;-0.251438,52.020523;-0.251482,52.021217;-0.25148,52.021492;-0.251705,52.021812;-0.251657,52.022388;-0.251873,52.023117;-0.252348,52.023933;-0.253108,52.024742;-0.254273,52.025452;-0.255635,52.025986;-0.25718,52.026398;-0.259132,52.026524;-0.260722,52.026394;-0.262247,52.026234;-0.26383,52.0261;-0.265482,52.026192;-0.267022,52.026371;-0.26857,52.026558;-0.270117,52.026585;-0.271498,52.026474;-0.272762,52.026344;-0.274122,52.026283;-0.275588,52.026241;-0.277005,52.026237;-0.27847,52.026299;-0.279912,52.02639;-0.281238,52.026463;-0.282395,52.026535;-0.283525,52.0266;-0.284672,52.026642;-0.285235,52.02668;-0.285557,52.026691;-0.286,52.026711;-0.286528,52.026718;-0.287107,52.026695;-0.288267,52.026825;-0.28973,52.026859;-0.291327,52.026863;-0.293133,52.026886;-0.29492,52.026852;-0.296808,52.026875;-0.298653,52.026886;-0.300452,52.026863;-0.302168,52.026871;-0.303783,52.026867;-0.305398,52.026863;-0.307047,52.026859;-0.308752,52.02684;-0.310368,52.026768;-0.311963,52.026546;-0.313382,52.026218;-0.31469,52.025894;-0.31569,52.025738;-0.316113,52.025635;-0.316577,52.02552;-0.317518,52.025761;-0.318773,52.026134;-0.320048,52.02668;-0.321403,52.02721;-0.322815,52.027748;-0.324253,52.028286;-0.325707,52.028786;-0.327152,52.029209;-0.32853,52.029606;-0.329773,52.029995;-0.33094,52.0303;-0.331862,52.030556;-0.332555,52.030605;-0.333398,52.030899;-0.334642,52.031288;-0.336395,52.031708;-0.337858,52.03204;-0.339305,52.032387;-0.340665,52.032673;-0.341967,52.032963;-0.343257,52.033272;-0.34461,52.033558;-0.345892,52.033901;-0.34703,52.03421;-0.348153,52.0345;-0.349258,52.034901;-0.350138,52.035339;-0.350573,52.035648;-0.350995,52.035824;-0.352108,52.035843;-0.353163,52.03569;-0.354292,52.035522;-0.355418,52.03537;-0.35655,52.035225;-0.357685,52.035076;-0.358725,52.034969;-0.359343,52.03476;-0.360245,52.034733;-0.3614,52.034641;-0.362668,52.034462;-0.363867,52.034283;-0.365082,52.034134;-0.366293,52.034023;-0.367502,52.03384;-0.368748,52.033661;-0.370112,52.033504;-0.37145,52.03331;-0.372782,52.03315;-0.374152,52.032997;-0.37549,52.032806;-0.37711,52.032616;-0.378477,52.032433;-0.37981,52.032219;-0.381155,52.032074;-0.382493,52.031925;-0.38383,52.031712;-0.385237,52.031479;-0.386608,52.031136;-0.3879,52.030716;-0.389117,52.030193;-0.39018,52.029453;-0.391063,52.028748;-0.392237,52.028191;-0.393402,52.027725;-0.394752,52.027363;-0.39609,52.026943;-0.397135,52.026329;-0.397955,52.025658;-0.398717,52.024994;-0.399272,52.024258;-0.399717,52.023624;-0.400365,52.022999;-0.401435,52.022602;-0.402165,52.022507;-0.402448,52.022488;-0.403073,52.022453;-0.40413,52.022438;-0.405405,52.022472;-0.406833,52.022743;-0.408297,52.023159;-0.409663,52.023525;-0.410908,52.023865;-0.41213,52.024216;-0.413333,52.024578;-0.414467,52.024902;-0.415478,52.02523;-0.416387,52.025494;-0.417205,52.02573;-0.417847,52.02586;-0.418408,52.025932;-0.418908,52.026028;-0.419005,52.026047;-0.419,52.026043;-0.419,52.026039;-0.419103,52.026047;-0.419472,52.026085;-0.419927,52.026169;-0.420207,52.026211;-0.420307,52.026188;-0.420325,52.026188;-0.420323,52.026184;-0.420323,52.026184;-0.420492,52.026199;-0.420788,52.026234;-0.421178,52.026283;-0.421492,52.026283;-0.421603,52.02631;-0.42174,52.02631;-0.421875,52.026337;-0.42197,52.026325;-0.422108,52.026344;-0.422248,52.026348;-0.42244,52.026371;-0.422647,52.026337;-0.422735,52.026352;-0.422837,52.026344;-0.422998,52.026329;-0.42327,52.026344;-0.42359,52.026375;-0.423852,52.026367;-0.423878,52.026379;-0.423882,52.026379;-0.424032,52.026382;-0.424267,52.026268;-0.424777,52.02597;-0.425665,52.026081;-0.426877,52.025879;-0.428038,52.025608;-0.429048,52.025269;-0.42998,52.024952;-0.430983,52.02467;-0.432065,52.024391;-0.433473,52.024036;-0.434752,52.023716;-0.436058,52.023376;-0.437382,52.023048;-0.438792,52.022675;-0.440343,52.022259;-0.442033,52.021713;-0.44359,52.021156;-0.44501,52.020638;-0.446318,52.020184;-0.447657,52.019749;-0.449045,52.019394;-0.45054,52.019142;-0.45199,52.018993;-0.453457,52.01886;-0.45457,52.018688;-0.455695,52.018436;-0.456777,52.018082;-0.457897,52.01762;-0.458915,52.01709;-0.459965,52.016476;-0.460947,52.01577;-0.461967,52.015072;-0.463163,52.014465;-0.464492,52.013977;-0.465858,52.013699;-0.46727,52.013496;-0.468638,52.01347;-0.470012,52.013523;-0.471352,52.013725;-0.47263,52.014015;-0.473825,52.014439;-0.474947,52.0149;-0.47603,52.015369;-0.477023,52.015804;-0.477985,52.016182;-0.478918,52.016548;-0.479348,52.016762;-0.479707,52.016773;-0.48043,52.017082;-0.481712,52.017387;-0.483275,52.017616;-0.484868,52.01778;-0.48624,52.017876;-0.487485,52.017918;-0.48877,52.017876;-0.490125,52.0177;-0.491415,52.017567;-0.492637,52.017422;-0.493873,52.017323;-0.495148,52.017139;-0.496528,52.016964;-0.497918,52.016865;-0.49911,52.016739;-0.500102,52.016689;-0.500697,52.016727;-0.501015,52.016735;-0.501643,52.016758;-0.502863,52.016682;-0.50339,52.016575;-0.503735,52.01659;-0.503987,52.017067;-0.504312,52.01778;-0.504548,52.018532;-0.504717,52.019318;-0.504917,52.019981;-0.504973,52.020424;-0.505212,52.020889;-0.505532,52.021591;-0.505935,52.022308;-0.506268,52.022896;-0.506583,52.023472;-0.506802,52.023998;-0.507008,52.024345;-0.507088,52.024712;-0.507122,52.025475;-0.507085,52.026375;-0.507073,52.027359;-0.507203,52.028351;-0.507425,52.029289;-0.507883,52.030247;-0.508643,52.03109;-0.509872,52.031944;-0.511193,52.032501;-0.512633,52.032936;-0.514068,52.033222;-0.51557,52.033054;-0.516445,52.032921;-0.51663,52.032887;-0.517328,52.032757;-0.518395,52.032452;-0.51957,52.032173;-0.520695,52.031872;-0.521455,52.031525;-0.5219,52.031212;-0.522825,52.03141;-0.523967,52.031544;-0.525247,52.031555;-0.526562,52.031666;-0.527832,52.032009;-0.529173,52.031902;-0.530693,52.031487;-0.532277,52.031071;-0.533712,52.030636;-0.535125,52.030193;-0.536555,52.029736;-0.537845,52.029255;-0.53915,52.028831;-0.54063,52.028584;-0.542218,52.028572;-0.543895,52.028332;-0.545315,52.02816;-0.546617,52.028202;-0.548,52.02837;-0.549418,52.028553;-0.550935,52.028553;-0.552248,52.028366;-0.553475,52.027962;-0.554832,52.027466;-0.555972,52.027035;-0.557077,52.026554;-0.558267,52.026257;-0.55942,52.025955;-0.560388,52.025654;-0.561388,52.025196;-0.562343,52.024624;-0.563457,52.024063;-0.564615,52.023544;-0.565773,52.02298;-0.566793,52.022293;-0.567797,52.02161;-0.569198,52.020947;-0.570558,52.020538;-0.572065,52.020275;-0.573663,52.020279;-0.575275,52.0205;-0.57689,52.020882;-0.578457,52.021271;-0.580025,52.021675;-0.58159,52.022064;-0.583152,52.022469;-0.584687,52.022846;-0.586157,52.023205;-0.58759,52.023556;-0.588887,52.023888;-0.589983,52.024162;-0.590605,52.02433;-0.590965,52.02449;-0.591568,52.024471;-0.592312,52.02475;-0.593408,52.025074;-0.594357,52.025402;-0.595315,52.025734;-0.596248,52.026142;-0.597138,52.026474;-0.597912,52.026806;-0.598612,52.027115;-0.599105,52.027382;-0.599418,52.027538;-0.600007,52.02771;-0.600592,52.028172;-0.601263,52.028431;-0.601463,52.028484;-0.601578,52.0285;-0.601593,52.028507;-0.601592,52.028507;-0.601592,52.028507;-0.601723,52.028522;-0.602322,52.028339;-0.602583,52.027966;-0.602647,52.027729;-0.602655,52.027355;-0.603208,52.026905;-0.603417,52.026531;-0.603495,52.026367;-0.603557,52.026218;-0.60357,52.025944;-0.603577,52.025562;-0.604077,52.025471;-0.604343,52.025791;-0.604405,52.026291;-0.605138,52.026657;-0.60614,52.026993;-0.607293,52.027344;-0.608653,52.027725;-0.609907,52.028091;-0.611282,52.028465;-0.612685,52.028809;-0.614135,52.029175;-0.615618,52.029495;-0.617112,52.029911;-0.618662,52.030281;-0.620272,52.030678;-0.621898,52.031086;-0.623552,52.031502;-0.625257,52.031906;-0.626982,52.032341;-0.628648,52.032745;-0.630395,52.033207;-0.632815,52.033855;-0.634808,52.034351;-0.636843,52.03487;-0.638865,52.035477;-0.640878,52.036121;-0.642872,52.036812;-0.644755,52.03754;-0.646475,52.038338;-0.64821,52.039124;-0.64999,52.039921;-0.651803,52.040783;-0.653597,52.04158;-0.655347,52.042404;-0.657087,52.043182;-0.658795,52.044006;-0.660525,52.044788;-0.662305,52.045597;-0.664065,52.046398;-0.665883,52.04726;-0.667833,52.048073;-0.669807,52.048805;-0.671818,52.049469;-0.673788,52.050083;-0.675702,52.050678;-0.677612,52.051273;-0.679392,52.051838;-0.681245,52.052414;-0.683133,52.053028;-0.684997,52.053627;-0.68691,52.054218;-0.688742,52.054779;-0.69042,52.05529;-0.691967,52.055698;-0.693612,52.056213;-0.695572,52.056828;-0.697123,52.057316;-0.698402,52.057728;-0.699232,52.058014;-0.699815,52.057957;-0.700017,52.057415;-0.700128,52.056622;-0.700715,52.055882;-0.70133,52.055351;-0.701557,52.055187;-0.70158,52.055176;-0.701757,52.054974;-0.701697,52.054531;-0.702165,52.05394;-0.702445,52.053211;-0.70276,52.052368;-0.703322,52.051449;-0.704025,52.050652;-0.704912,52.049995;-0.705697,52.0495;-0.706385,52.049091;-0.706707,52.048962;-0.706898,52.048882;-0.707172,52.048553;-0.707992,52.048401;-0.709047,52.04808;-0.710325,52.047752;-0.711777,52.047462;-0.713397,52.047153;-0.715353,52.046947;-0.717448,52.046822;-0.719455,52.046787;-0.72127,52.046902;-0.722627,52.047001;-0.722977,52.046993;-0.723052,52.046982;-0.723792,52.046902;-0.724667,52.047207;-0.726187,52.047264;-0.728252,52.047085;-0.730143,52.046638;-0.731682,52.046059;-0.73296,52.04541;-0.734072,52.044918;-0.735078,52.04438;-0.736662,52.043915;-0.738232,52.043633;-0.738982,52.043327;-0.740053,52.043209;-0.741282,52.042858;-0.742413,52.042427;-0.743425,52.042076;-0.744008,52.041832;-0.744315,52.041534;-0.745375,52.04126;-0.746758,52.040649;-0.748262,52.039928;-0.749245,52.039501;-0.749603,52.039139;-0.750152,52.039265;-0.749458,52.03957;-0.748518,52.039909;-0.74803,52.040207;-0.748093,52.040428;-0.748177,52.040489;-0.748168,52.040493;-0.748183,52.040493";
  
  function parseLocations(locations: string): number[][]{
    const parsedLocations = locations.split(';').map(loc => {
      const [lng, lat] = loc.split(',');
      return [parseFloat(lng), parseFloat(lat)];
    });
    return parsedLocations
  }
  const parsedLocations = parseLocations(locationsData)
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState<Snapshot | null>(null);

  const getFleets = async () => {
    const data = await fetchFleets();
    setFleets(data);
  };
  const getVehicles = async (selectedFleet:string) => {
    const data = await fetchVehicles(selectedFleet);
    setVehicles(data);
  };
  const getSnapshotData = async (page?:number) => {
      const { snapshots} = await fetchSnapshotData(page)
      setSnapshots(snapshots)
  };


  useEffect(() => {
    getFleets();
    getSnapshotData();
  }, []);

  const handleFleetChange = (value: string) => {
    if(value){
      setSelectedFleet(value);
      getVehicles(value);
    }
  };

  const handleVehicleChange = (value: string) => {
    setSelectedVehicle(value);

    function searchVehichle(page = 0){
      if(page) getSnapshotData(page)
      const vehicleData = snapshots.find((item: Snapshot) => item.vehicleId === Number(value));
      if(vehicleData) {
        return vehicleData
      } else if(page == 3) {
        return false
      } else {
        searchVehichle(page++)
      }
    }

    if(mapRef.current){
      const coordinates = parsedLocations
      mapRef.current.fitBounds([
        [Math.min(...coordinates.map(loc => loc[0])), Math.min(...coordinates.map(loc => loc[1]))],
        [Math.max(...coordinates.map(loc => loc[0])), Math.max(...coordinates.map(loc => loc[1]))]
      ], {
        padding: 40,
        maxZoom: 14,
      });
      mapRef.current.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates':coordinates
            }
        }
      });
      mapRef.current.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#888',
            'line-width': 8
        }
      });

    }
    const vehicleData = searchVehichle()
    if(vehicleData){
      setSelectedVehicleData(vehicleData)
    }
 
  };
  
  return (
    <>
      <h1>Worn Tyres Platform</h1>

      <div className="mt-4 h-[500px]">
        <div id='map-container' className="w-full h-full" ref={mapContainer}/>
      </div>
      <div className="flex mb-4 space-x-4">
        <Select onValueChange={handleFleetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fleet" />
          </SelectTrigger>
          <SelectContent>
            {fleets.map((fleet: Fleet) => (
              <SelectItem key={fleet.id} value={fleet.id}>
                {fleet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleVehicleChange} disabled={!selectedFleet}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.map((vehicle: Vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedVehicleData && (
        <Card>
          <CardHeader>
            <CardTitle>Snapshot Data</CardTitle>
            <CardDescription>Data for the selected vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>Min PSU1 Voltage: {selectedVehicleData.minPsu1Voltage}</div>
              <div>Max PSU1 Voltage: {selectedVehicleData.maxPsu1Voltage}</div>
              <div>Avg PSU1 Voltage: {selectedVehicleData.avgPsu1Voltage}</div>
              <div>Min PSU2 Voltage: {selectedVehicleData.minPsu2Voltage}</div>
              <div>Max PSU2 Voltage: {selectedVehicleData.maxPsu2Voltage}</div>
              <div>Avg PSU2 Voltage: {selectedVehicleData.avgPsu2Voltage}</div>
              <div>Min Humidity: {selectedVehicleData.minHumidity}</div>
              <div>Max Humidity: {selectedVehicleData.maxHumidity}</div>
              <div>Avg Humidity: {selectedVehicleData.avgHumidity}</div>
              <div>Min Pressure: {selectedVehicleData.minPressure}</div>
              <div>Max Pressure: {selectedVehicleData.maxPressure}</div>
              <div>Avg Pressure: {selectedVehicleData.avgPressure}</div>
              <div>Routed KM Travelled: {selectedVehicleData.routedKmTravelled}</div>
              <div>KM Travelled: {selectedVehicleData.kmTravelled}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default App
