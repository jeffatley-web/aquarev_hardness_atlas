/* Hotel Water Hardness Atlas — Webflow build
   Renders the key, filters, map, table and footer into #hwa-app.
   Needs d3 v7, topojson-client v3 and datamaps.world (for the world geometry) loaded before this file. */
(function(){
"use strict";
var CLS={soft:"Soft",moderate:"Moderate",hard:"Hard",veryhard:"Very hard",variable:"Variable"};
var SEV={soft:0,moderate:1,hard:2,veryhard:3,variable:4};
/* row: place, markets, source, lo, hi, class, desal, note, [lat,lon], ISO3 codes */
var DATA=[
["North America",[
 ["USA — Desert Southwest","Phoenix, Scottsdale, Las Vegas, Palm Springs","Colorado River, deep wells",200,350,"veryhard",false,"Highest evaporation in the US stacked on very hard fill; pool calcium passes 500 mg/L without regular dilution.",[34.6,-113.4],["USA"]],
 ["USA — Southern California","Los Angeles, San Diego, Orange County","Colorado River / State Project blend",100,280,"hard",false,"Blend ratio shifts hardness by season; coastal resorts usually sit at the harder end.",[33.6,-118.2],["USA"]],
 ["USA — Texas","San Antonio, Austin, Dallas, Houston","Edwards limestone aquifer, lakes",120,350,"veryhard",false,"Hill Country and San Antonio on the Edwards aquifer are the extreme; Houston surface water is moderate.",[30.3,-98.4],["USA"]],
 ["USA — Florida","Orlando, Miami, Tampa, Florida Keys","Floridan limestone aquifer",180,320,"veryhard",false,"Very hard plus warm, humid, high-bather-load pools; scale and cloudy water are chronic.",[27.8,-81.6],["USA"]],
 ["USA — Midwest","Chicago, Indianapolis, Minneapolis, Kansas City","Great Lakes, limestone aquifers",130,320,"hard",false,"Lake Michigan cities around 140; well-fed cities such as Indianapolis and the Twin Cities are very hard.",[41.3,-89.5],["USA"]],
 ["USA — Mountain West","Denver, Salt Lake City, Park City","Snowmelt reservoirs, valley wells",60,250,"variable",false,"Denver moderate; Salt Lake and Utah resort towns hard.",[40.2,-108.5],["USA"]],
 ["USA — Northeast","New York, Boston, Philadelphia","Upland reservoirs",20,90,"soft",false,"New York and Boston water is soft and corrosive; pools need calcium added on every fill.",[41.7,-73.2],["USA"]],
 ["USA — Pacific Northwest","Seattle, Portland, Vancouver BC","Mountain reservoirs",5,30,"soft",false,"Among the softest municipal water in North America; etches plaster and attacks copper.",[46.6,-122.5],["USA"]],
 ["USA — Hawaii","Honolulu, Maui, Kona and Kohala coasts","Basalt aquifers, brackish coastal wells",40,160,"moderate",false,"Oahu wells moderate; Kona and Waikoloa resorts on brackish wells run harder with high chloride.",[20.7,-157.2],[]],
 ["Canada — Prairies & Ontario","Calgary, Winnipeg, Regina, Toronto","Rivers, glacial aquifers, Lake Ontario",120,350,"hard",false,"Regina and Winnipeg very hard; Toronto about 125. Vancouver and Montreal are soft.",[50.8,-100.5],["CAN"]],
 ["Mexico — Yucatán & Riviera Maya","Cancún, Playa del Carmen, Tulum, Cozumel","Karst limestone aquifer",300,550,"veryhard",false,"Some of the hardest resort water anywhere; saltwater intrusion adds corrosion on top of scale.",[20.6,-87.6],["MEX"]],
 ["Mexico — Pacific & Baja","Los Cabos, Puerto Vallarta, Mazatlán","Wells blended with desalination",60,300,"variable",true,"Cabo mixes soft desal with hard wells; hardness swings with the blend ratio.",[23.0,-109.7],["MEX"]],
 ["Mexico — Central","Mexico City, Guadalajara, San Miguel","Volcanic aquifers",100,250,"hard",false,"Hard, with high sulphate in parts of the Valley of Mexico.",[20.2,-101.0],["MEX"]]
]],
["Caribbean",[
 ["Bahamas & Turks and Caicos","Nassau, Paradise Island, Providenciales","Desal blended with limestone wells",30,350,"variable",true,"Desal is soft and aggressive, well water very hard; which one arrives depends on the day.",[24.3,-76.3],["BHS","TCA"]],
 ["Dominican Republic","Punta Cana, La Romana, Puerto Plata","Karst limestone wells",300,500,"veryhard",false,"Punta Cana runs some of the hardest resort water in the Caribbean.",[18.7,-69.6],["DOM"]],
 ["Jamaica","Montego Bay, Negril, Ocho Rios","Limestone springs and rivers",200,350,"veryhard",false,"Persistent scale in laundries and calorifiers; pool calcium climbs quickly.",[18.2,-77.6],["JAM"]],
 ["Barbados","Bridgetown, west and south coasts","Coral limestone aquifer",200,320,"veryhard",false,"Coral-rock water; very hard and alkaline.",[13.2,-59.5],["BRB"]],
 ["Aruba, Curaçao, Bonaire","Palm Beach, Eagle Beach, Willemstad","Desalination",10,60,"soft",true,"Very soft desal; corrosive unless remineralised. Pools need calcium and bicarbonate dosed.",[12.3,-69.3],["ABW","CUW"]],
 ["Cayman Islands & Bermuda","Seven Mile Beach, Hamilton","Desal (Cayman), rainwater tanks (Bermuda)",20,80,"soft",true,"Soft, low-alkalinity water with poor pH buffering.",[19.4,-81.3],["CYM","BMU"]],
 ["Puerto Rico & US Virgin Islands","San Juan, Dorado, St Thomas, St Croix","Reservoirs; desal on USVI",60,200,"moderate",true,"San Juan moderate to hard; USVI desal soft.",[18.3,-65.5],["PRI","VIR"]],
 ["Cuba","Varadero, Havana, Cayo Coco","Limestone aquifers",250,450,"veryhard",false,"Very hard and often saline from coastal intrusion.",[22.3,-80.2],["CUB"]]
]],
["Central & South America",[
 ["Costa Rica & Panama","Guanacaste, Manuel Antonio, Panama City","Volcanic rivers and wells",40,150,"moderate",false,"Soft to moderate; Guanacaste wells harden in the dry season.",[9.4,-83.3],["CRI","PAN"]],
 ["Colombia & Ecuador","Bogotá, Cartagena, Quito, Galápagos","Highland reservoirs; coastal wells",20,120,"soft",false,"Bogotá soft; Cartagena moderate; Galápagos desal.",[2.8,-75.6],["COL","ECU"]],
 ["Peru & Chile","Lima, Cusco, Santiago, Atacama","Andean rivers",150,350,"veryhard",false,"Andean mineral load; Lima and Santiago both very hard with high sulphate.",[-19.5,-70.6],["PER","CHL"]],
 ["Brazil","Rio de Janeiro, São Paulo, Bahia coast","Surface reservoirs",20,80,"soft",false,"Soft water; pools need calcium added.",[-19.0,-44.5],["BRA"]],
 ["Argentina & Uruguay","Buenos Aires, Mendoza, Punta del Este","Río de la Plata, Andean rivers",60,150,"moderate",false,"Moderate with elevated sodium; Mendoza harder.",[-34.8,-58.5],["ARG","URY"]]
]],
["Europe",[
 ["UK — South & East England","London, Kent, Cotswolds, Cambridge","Chalk and limestone aquifers",250,350,"veryhard",false,"London is textbook very hard; kettles to calorifiers scale within months.",[51.6,-0.2],["GBR"]],
 ["UK — North & West, Scotland, Wales","Manchester, Edinburgh, Lake District, Highlands","Upland reservoirs",10,60,"soft",false,"Very soft and slightly acidic; corrosion and plaster etching rather than scale.",[55.6,-3.9],["GBR"]],
 ["Ireland","Dublin, Cork, Kerry, Galway","Limestone rivers (east), peat uplands (west)",100,300,"hard",false,"Dublin hard; the west coast is soft.",[53.2,-7.9],["IRL"]],
 ["France — Paris & North","Paris, Champagne, Loire Valley","Chalk aquifers",250,350,"veryhard",false,"Very hard; utilities report it as TH 25–35 °fH.",[48.9,2.4],["FRA"]],
 ["France — Riviera & Provence","Nice, Cannes, Saint-Tropez, Marseille","Alpine rivers, karst springs",150,300,"hard",false,"Hard; Riviera resorts on the harder end.",[43.5,6.4],["FRA"]],
 ["Spain — Mediterranean & Balearics","Barcelona, Valencia, Costa del Sol, Mallorca, Ibiza","Limestone aquifers, some desal",250,450,"veryhard",true,"Mallorca and the Costa Blanca are among Europe's hardest; desal blends only partly offset it.",[39.6,0.8],["ESP"]],
 ["Spain — Madrid & Canary Islands","Madrid, Tenerife, Gran Canaria, Lanzarote","Sierra reservoirs; desal",20,80,"soft",true,"Madrid famously soft; Canary Islands desal soft and aggressive.",[40.4,-3.9],["ESP"]],
 ["Portugal","Lisbon, Algarve, Madeira, Porto","Rivers; Algarve limestone aquifer",80,300,"hard",false,"Lisbon moderate; Algarve hard and rising in drought years.",[38.3,-8.4],["PRT"]],
 ["Italy","Rome, Milan, Florence, Venice, Amalfi Coast","Apennine karst springs",200,350,"veryhard",false,"Rome's spring water is very hard; Milan and Florence hard.",[42.3,12.8],["ITA"]],
 ["Germany, Austria, Switzerland","Berlin, Munich, Frankfurt, Vienna, Zurich","Alpine rivers, glacial aquifers",150,350,"hard",false,"Berlin and Munich very hard (German 'hart', 14 °dH and up); Vienna's Alpine springs moderate.",[48.8,11.2],["DEU","AUT","CHE"]],
 ["Benelux","Amsterdam, Brussels, Bruges, Luxembourg","Dune-filtered rivers, chalk aquifers",100,300,"hard",false,"Belgium hard; Dutch utilities soften centrally, so most cities land moderate.",[51.6,4.6],["NLD","BEL","LUX"]],
 ["Scandinavia","Oslo, Stockholm, Helsinki, Bergen","Lakes and rivers",10,60,"soft",false,"Very soft and corrosive.",[60.6,15.2],["NOR","SWE","FIN"]],
 ["Denmark","Copenhagen, Aarhus","Chalk and limestone aquifers",300,450,"veryhard",false,"The Nordic outlier: Copenhagen has some of the hardest water in Europe.",[55.9,11.4],["DNK"]],
 ["Greece","Athens, Crete, Mykonos, Santorini, Rhodes","Reservoirs; island wells and desal",150,400,"veryhard",true,"Athens hard; Cycladic islands mix desal with very hard brackish wells.",[37.6,24.3],["GRC"]],
 ["Turkey — Mediterranean coast","Antalya, Belek, Bodrum, Fethiye","Karst limestone aquifers",250,400,"veryhard",false,"Very hard, hot and high-evaporation; classic scaling conditions.",[36.9,30.8],["TUR"]],
 ["Cyprus & Malta","Paphos, Limassol, Ayia Napa, Valletta","Limestone aquifers, desal",250,600,"veryhard",true,"Malta's groundwater is among the hardest in the world; desal share is growing.",[35.0,33.2],["CYP","MLT"]],
 ["Croatia & Adriatic","Dubrovnik, Split, Hvar, Montenegro coast","Dalmatian karst springs",200,350,"veryhard",false,"Very hard karst water along the entire coast.",[43.4,17.1],["HRV","MNE"]],
 ["Central Europe","Prague, Budapest, Warsaw, Kraków","Rivers and aquifers",150,320,"hard",false,"Budapest and Warsaw hard; Prague moderate.",[49.6,18.9],["CZE","HUN","POL"]]
]],
["Middle East & North Africa",[
 ["United Arab Emirates","Dubai, Abu Dhabi, Ras Al Khaimah","Desalination, remineralised at plant",50,120,"moderate",true,"Soft desal remineralised at the plant; low buffering, and extreme evaporation pushes pool calcium up regardless.",[24.4,54.9],["ARE"]],
 ["Saudi Arabia","Riyadh, Jeddah, Red Sea, AlUla","Desal blended with deep fossil aquifers",80,350,"variable",true,"Jeddah and Red Sea desal soft; Riyadh blends with very hard groundwater.",[24.2,43.6],["SAU"]],
 ["Qatar, Bahrain, Kuwait","Doha, Manama, Kuwait City","Desalination",40,150,"moderate",true,"Same profile as the UAE; watch corrosion in low-alkalinity water.",[27.6,49.4],["QAT","BHR","KWT"]],
 ["Oman","Muscat, Salalah, Musandam","Desal plus wadi aquifers",100,300,"hard",true,"Interior and wadi wells hard; coastal desal soft.",[22.3,57.4],["OMN"]],
 ["Egypt — Red Sea","Sharm El Sheikh, Hurghada, Marsa Alam","Brackish wells, resort desal",100,500,"variable",true,"Resort-run desal is common; untreated well water is very hard and saline.",[26.4,34.2],["EGY"]],
 ["Egypt — Nile Valley","Cairo, Luxor, Aswan","Nile River",100,180,"moderate",false,"Moderate; turbidity and chlorine demand matter more than hardness.",[28.6,30.6],["EGY"]],
 ["Israel & Jordan","Tel Aviv, Eilat, Dead Sea, Amman, Petra","National carrier plus desal; Jordanian aquifers",100,400,"hard",true,"Israeli desal has softened supply; Amman and Dead Sea resorts very hard.",[31.4,36.0],["ISR","JOR"]],
 ["Morocco","Marrakech, Casablanca, Agadir, Fez","Atlas aquifers and dams",200,500,"veryhard",false,"Marrakech very hard; scale across riad and resort hot-water plant.",[32.0,-6.8],["MAR"]],
 ["Tunisia","Hammamet, Djerba, Sousse","Saline aquifers, desal",300,600,"veryhard",true,"Very hard and saline; desal expanding on Djerba.",[34.9,9.8],["TUN"]]
]],
["Sub-Saharan Africa & Indian Ocean",[
 ["South Africa","Cape Town, Johannesburg, Garden Route, Kruger","Mountain catchments; Vaal River",10,120,"soft",false,"Cape Town very soft; Johannesburg moderate.",[-30.0,24.8],["ZAF"]],
 ["East Africa","Nairobi, Zanzibar, Mombasa, Serengeti lodges","Rivers; coral limestone wells on the coast",30,400,"variable",false,"Nairobi soft; Zanzibar and Mombasa coral-rock wells very hard.",[-3.2,37.9],["KEN","TZA"]],
 ["Mauritius, Seychelles, Réunion","Grand Baie, Le Morne, Mahé, Praslin","Volcanic catchments",30,120,"soft",false,"Soft; low alkalinity needs buffering for pools.",[-20.3,57.6],["MUS","SYC"]],
 ["Maldives","All resort atolls","Resort-operated RO desalination",10,60,"soft",true,"Every resort makes its own water; aggressive unless remineralised, and quality drifts with membrane age.",[3.6,73.3],["MDV"]]
]],
["Asia-Pacific",[
 ["Japan","Tokyo, Osaka, Kyoto, Okinawa","Rivers and dams; Okinawa limestone",40,200,"moderate",false,"Mainland soft to moderate; Okinawa resorts hard.",[36.2,138.4],["JPN"]],
 ["China — North","Beijing, Tianjin, Xi'an","Deep aquifers",250,400,"veryhard",false,"Beijing has some of the hardest big-city water in Asia.",[39.6,115.9],["CHN"]],
 ["China — South & Hong Kong","Shanghai, Guangzhou, Hong Kong, Hainan","Yangtze and Dongjiang rivers",20,150,"soft",false,"Hong Kong and Guangzhou soft; Shanghai moderate.",[24.6,113.8],["CHN","HKG"]],
 ["South Korea & Taiwan","Seoul, Busan, Jeju, Taipei","Dams and rivers",40,100,"moderate",false,"Soft to moderate.",[36.1,127.6],["KOR","TWN"]],
 ["India — North & interior","Delhi, Jaipur, Agra, Udaipur","Groundwater, Yamuna",200,600,"veryhard",false,"Rajasthan groundwater is extreme; heritage-hotel plant scales aggressively.",[26.6,75.2],["IND"]],
 ["India — Coastal & South","Mumbai, Goa, Kerala, Chennai, Bangalore","Reservoirs (west); borewells (Chennai, Bangalore)",40,400,"variable",false,"Mumbai and Goa soft; Chennai and Bangalore borewells very hard.",[13.6,76.9],["IND"]],
 ["Thailand","Bangkok, Phuket, Koh Samui, Chiang Mai","Rivers; island wells",60,250,"moderate",false,"Bangkok moderate; Phuket and Samui wells hard in the dry season.",[13.4,100.4],["THA"]],
 ["Vietnam & Cambodia","Hanoi, Ho Chi Minh City, Da Nang, Siem Reap","Rivers; Hanoi groundwater",40,250,"moderate",false,"Hanoi hard with iron and manganese; Ho Chi Minh City soft.",[14.4,107.3],["VNM","KHM"]],
 ["Indonesia — Bali","Nusa Dua, Uluwatu, Seminyak, Ubud","Limestone wells (Bukit); rivers (north)",100,350,"hard",false,"Bukit peninsula resorts on limestone wells run very hard; Ubud softer.",[-8.5,115.2],["IDN"]],
 ["Malaysia & Singapore","Kuala Lumpur, Langkawi, Singapore","Rivers, reservoirs, NEWater/desal blend",20,80,"soft",true,"Soft; pools need calcium and alkalinity added.",[3.3,102.0],["MYS","SGP"]],
 ["Philippines","Manila, Cebu, Boracay, Palawan","Reservoirs (Manila); limestone wells (Cebu)",50,400,"variable",true,"Cebu and Bohol very hard; Boracay mixes desal and wells.",[11.8,123.2],["PHL"]],
 ["Australia — East coast","Sydney, Melbourne, Brisbane, Gold Coast, Cairns","Dam catchments",10,150,"soft",false,"Melbourne is among the softest in the world; Brisbane moderate.",[-30.5,150.6],["AUS"]],
 ["Australia — West & South","Perth, Adelaide, Margaret River","Aquifers, Murray River, desal",100,220,"hard",true,"Perth and Adelaide hard; desal share rising in Perth.",[-32.4,124.0],["AUS"]],
 ["New Zealand","Auckland, Queenstown, Rotorua","Dams and alpine lakes",20,80,"soft",false,"Very soft; Rotorua geothermal areas add sulphur and silica.",[-40.6,173.5],["NZL"]],
 ["Pacific Islands","Fiji, Bora Bora, Guam","Catchments; desal on atolls; Guam limestone",30,300,"variable",true,"Fiji soft; Guam limestone very hard; atoll resorts on desal.",[-17.6,178.1],["FJI","PYF","GUM"]]
]]
];

var app=document.getElementById("hwa-app");
if(!app)return;

/* ---------- static sections ---------- */
var KEY=[
 ["soft","Soft","0 – 60 mg/L · 0–3.5 gpg","Upland reservoirs, granite or basalt catchments, rain tanks, desalinated water.","<b>Corrosion, not scale.</b> Aggressive to copper, brass, plaster and grout. Pools need calcium chloride to reach target; low alkalinity lets pH swing."],
 ["moderate","Moderately hard","61 – 120 mg/L · 3.5–7 gpg","Mixed catchments, remineralised desal, volcanic aquifers.","<b>Balanced fill water.</b> Light scale in calorifiers over years. Pool calcium usually lands in range on fill; watch upward drift as evaporation concentrates it."],
 ["hard","Hard","121 – 180 mg/L · 7–10.5 gpg","Lake and river supplies over sedimentary rock, alpine glacial aquifers.","<b>Softening pays on the hot side.</b> Scale in boilers, dishwashers, steamers and showerheads. Pool calcium passes the ceiling within a season without dilution."],
 ["veryhard","Very hard","&gt; 180 mg/L · &gt; 10.5 gpg","Chalk, limestone and karst aquifers, coral-rock islands, arid groundwater.","<b>Scale is the operating condition.</b> Fill water is at or above the pool ceiling on day one. Cloudy water, tile-line scale, fouled heaters, rising chemical spend. Softened or blended fill, and controlled dilution, are needed."],
 ["variable","Variable","swings across classes","Markets that blend desalinated water with hard wells, or where resorts run their own plant.","<b>Test every delivery.</b> Chemistry changes with the blend, the season and membrane age. Pull the property's own utility report or run a test kit before quoting treatment."]
];
var h='<section class="key" aria-label="Hardness classification key">';
KEY.forEach(function(k){h+='<div><h3><i class="swatch" style="background:var(--'+k[0]+')"></i>'+k[1]+'</h3><div class="range">'+k[2]+'</div><p>'+k[3]+'</p><div class="hotel">'+k[4]+'</div></div>';});
h+='</section>';
h+='<div class="poolnote"><div class="bar" aria-hidden="true"><i></i><s style="left:0">0</s><s style="left:33.3%">200</s><s style="left:66.6%">400</s><s style="left:100%">600</s></div><p><b>Pool calcium window.</b> Operators aim for 200–400 mg/L calcium hardness in the pool itself. The dashed band in each row\'s bar marks that window on a 0–600 scale, so you can see at a glance whether a market\'s fill water starts below it, inside it, or already above it. Evaporation only ever moves the number up.</p></div>';
h+='<div class="controls" role="group" aria-label="Filter map and table"><input id="hwa-q" type="search" placeholder="Search country, city or source…" aria-label="Search countries, cities or sources">';
["soft","moderate","hard","veryhard","variable"].forEach(function(c){h+='<button type="button" class="chip" data-cls="'+c+'" aria-pressed="false"><i class="swatch" style="background:var(--'+c+')"></i>'+CLS[c]+'</button>';});
h+='<span class="count" id="hwa-count"></span></div>';
h+='<div class="maphead"><h2>Where the water comes from</h2><p>Countries are shaded by the class of their listed markets; striped countries vary by region. Each dot is one row of the table. Hover for the figures, click to jump to its row. Scroll or use the buttons to zoom.</p></div>';
h+='<div class="map" id="hwa-map"><svg id="hwa-svg" viewBox="0 0 1180 560" role="img" aria-label="World map of hotel-market water hardness"></svg><div class="zoom"><button type="button" id="hwa-zin" aria-label="Zoom in">+</button><button type="button" id="hwa-zout" aria-label="Zoom out">−</button><button type="button" id="hwa-zreset" aria-label="Reset zoom">⌂</button></div><div class="legend" aria-hidden="true"><div><i class="swatch" style="background:var(--soft)"></i>Soft</div><div><i class="swatch" style="background:var(--moderate)"></i>Moderately hard</div><div><i class="swatch" style="background:var(--hard)"></i>Hard</div><div><i class="swatch" style="background:var(--veryhard)"></i>Very hard</div><div><i class="swatch" style="background:var(--variable)"></i>Variable / blended</div><div><i class="mixed"></i>Varies within country</div><div><i class="dot"></i>One table row</div></div><div class="tip" id="hwa-tip"></div></div>';
h+='<p class="mapfoot">Small island markets such as Malta, the Maldives, Singapore, Barbados and the Dutch Caribbean are below the map\'s resolution and appear as dots only.</p>';
h+='<div class="tablewrap"><table id="hwa-atlas"><thead><tr><th>Country / sub-region</th><th>Key hotel markets</th><th>Source</th><th class="num">Hardness (mg/L)</th><th>vs. pool window</th><th>Class</th><th>What it means on property</th></tr></thead><tbody id="hwa-body"></tbody></table><div class="empty" id="hwa-empty" hidden>No markets match that filter.</div></div>';
h+='<footer><p><b>About the figures.</b> Ranges are typical values for the named supplies, compiled from utility water-quality reports, national geological and hydrological surveys, and resort-operator testing. Hardness varies by district, season and blend within any market. Confirm with the property\'s most recent utility report or an on-site test before specifying treatment.</p><p>Classification follows the U.S. Geological Survey bands. Pool calcium hardness targets follow common North American operator guidance of 200–400 mg/L; regional codes may set narrower ranges.</p></footer>';
app.innerHTML=h;

/* ---------- flatten ---------- */
var ROWS=[];
DATA.forEach(function(g){g[1].forEach(function(r){ROWS.push({region:g[0],place:r[0],markets:r[1],source:r[2],lo:r[3],hi:r[4],cls:r[5],desal:r[6],note:r[7],ll:r[8],iso:r[9],idx:ROWS.length});});});
var total=ROWS.length;

/* ---------- table ---------- */
var body=document.getElementById("hwa-body");
var MAX=600;
(function(){
  var html="";
  DATA.forEach(function(g){
    html+='<tr class="group"><th colspan="7">'+g[0]+'<span>'+g[1].length+' markets</span></th></tr>';
    g[1].forEach(function(r){
      var row=ROWS.filter(function(x){return x.place===r[0];})[0];
      var l=Math.min(row.lo,MAX)/MAX*100, w=(Math.min(row.hi,MAX)-Math.min(row.lo,MAX))/MAX*100;
      html+='<tr class="row" id="hwa-r'+row.idx+'" data-idx="'+row.idx+'" data-cls="'+row.cls+'">'+
        '<td class="place">'+row.place+'</td>'+
        '<td class="markets">'+row.markets+'</td>'+
        '<td class="source">'+row.source+(row.desal?'<span class="desal">DESAL</span>':'')+'</td>'+
        '<td class="hard"><span class="lo">'+row.lo+'–</span>'+row.hi+'</td>'+
        '<td class="bar"><div class="rbar"><div class="win"></div><div class="fill" style="left:'+l+'%;width:'+Math.max(w,1.5)+'%;background:var(--'+row.cls+')"></div></div></td>'+
        '<td class="cls"><span class="tag '+row.cls+'">'+CLS[row.cls]+'</span></td>'+
        '<td class="issue">'+row.note+'</td></tr>';
    });
  });
  body.innerHTML=html;
})();

/* ---------- map ---------- */
var markers=null, halo=null, proj=null;
var hasMap=typeof d3!=="undefined"&&typeof topojson!=="undefined"&&typeof Datamap!=="undefined"&&Datamap.prototype&&Datamap.prototype.worldTopo;
if(hasMap){
  var W=1180,H=560;
  var svg=d3.select("#hwa-svg");
  var defs=svg.append("defs");
  var root=svg.append("g");
  var topo=Datamap.prototype.worldTopo;
  var land=topojson.feature(topo,topo.objects.world).features.filter(function(f){return f.id!=="ATA";});
  proj=d3.geoNaturalEarth1().fitExtent([[6,6],[W-6,H-6]],{type:"FeatureCollection",features:land});
  var path=d3.geoPath(proj);

  var byIso=new Map();
  ROWS.forEach(function(r){r.iso.forEach(function(c){if(!byIso.has(c))byIso.set(c,new Set());byIso.get(c).add(r.cls);});});
  byIso.forEach(function(set,iso){
    if(set.size<2)return;
    var arr=Array.from(set).sort(function(a,b){return SEV[a]-SEV[b];});
    var p=defs.append("pattern").attr("id","hwa-pat-"+iso).attr("patternUnits","userSpaceOnUse").attr("width",7).attr("height",7).attr("patternTransform","rotate(45)");
    var sw=7/arr.length;
    arr.forEach(function(c,i){p.append("rect").attr("x",i*sw).attr("width",sw+0.3).attr("height",7).attr("fill","var(--"+c+")");});
  });

  root.append("path").attr("class","sphere").attr("d",path({type:"Sphere"}));
  root.append("path").attr("class","grat").attr("d",path(d3.geoGraticule10()));
  root.append("g").selectAll("path").data(land).join("path")
    .attr("class",function(d){return "country"+(byIso.has(d.id)?" has":"");})
    .attr("d",path)
    .attr("fill",function(d){var s=byIso.get(d.id);if(!s)return null;return s.size===1?"var(--"+Array.from(s)[0]+")":"url(#hwa-pat-"+d.id+")";});

  var mg=root.append("g");
  halo=mg.append("circle").attr("class","halo").attr("r",11);
  markers=mg.selectAll("circle.marker").data(ROWS).join("circle")
    .attr("class","marker")
    .attr("cx",function(d){return proj([d.ll[1],d.ll[0]])[0];}).attr("cy",function(d){return proj([d.ll[1],d.ll[0]])[1];})
    .attr("r",5.5).attr("fill",function(d){return "var(--"+d.cls+")";})
    .attr("tabindex",0).attr("role","button").attr("aria-label",function(d){return d.place+", "+d.lo+" to "+d.hi+" mg/L, "+CLS[d.cls];});

  var zoom=d3.zoom().scaleExtent([1,8]).translateExtent([[0,0],[W,H]]).on("zoom",function(e){
    var k=e.transform.k; root.attr("transform",e.transform);
    markers.attr("r",5.5/Math.sqrt(k)); halo.attr("r",11/Math.sqrt(k));
  }).on("start",function(){svg.classed("grabbing",true);}).on("end",function(){svg.classed("grabbing",false);});
  svg.call(zoom);
  document.getElementById("hwa-zin").onclick=function(){svg.transition().duration(250).call(zoom.scaleBy,1.6);};
  document.getElementById("hwa-zout").onclick=function(){svg.transition().duration(250).call(zoom.scaleBy,1/1.6);};
  document.getElementById("hwa-zreset").onclick=function(){svg.transition().duration(300).call(zoom.transform,d3.zoomIdentity);};

  var map=document.getElementById("hwa-map"), tip=document.getElementById("hwa-tip");
  var showTip=function(d,ev){
    tip.innerHTML='<b>'+d.place+'</b><div class="m">'+d.markets+'</div><div class="h">'+d.lo+'–'+d.hi+' mg/L <span class="tag '+d.cls+'">'+CLS[d.cls]+'</span>'+(d.desal?'<span class="desal">DESAL</span>':'')+'</div><div class="i">'+d.note+'</div><div class="go">Click to jump to this row</div>';
    tip.classList.add("on"); moveTip(ev);
  };
  var moveTip=function(ev){
    var r=map.getBoundingClientRect(); var x=ev.clientX-r.left+14, y=ev.clientY-r.top+14;
    if(x+310>r.width)x=ev.clientX-r.left-314; if(y+tip.offsetHeight+10>r.height)y=ev.clientY-r.top-tip.offsetHeight-14;
    tip.style.left=x+"px"; tip.style.top=y+"px";
  };
  var hideTip=function(){tip.classList.remove("on");};
  markers.on("mouseenter",function(ev,d){showTip(d,ev);setHot(d.idx);})
    .on("mousemove",function(ev){moveTip(ev);})
    .on("mouseleave",function(){hideTip();setHot(selected);})
    .on("click",function(ev,d){ev.stopPropagation();select(d.idx);})
    .on("keydown",function(ev,d){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();select(d.idx);}});
}else{
  var mapEl=document.getElementById("hwa-map");
  mapEl.innerHTML='<div class="empty">The map could not load its libraries. The table below is complete.</div>';
}

/* ---------- linking ---------- */
var selected=null;
function setHot(idx){
  if(!markers)return;
  markers.classed("hot",function(d){return d.idx===idx;});
  var d=ROWS[idx]; if(d==null){halo.classed("on",false);return;}
  var p=proj([d.ll[1],d.ll[0]]); halo.attr("cx",p[0]).attr("cy",p[1]).classed("on",true);
}
function select(idx){
  selected=idx;
  Array.prototype.forEach.call(body.querySelectorAll("tr.row"),function(tr){tr.classList.toggle("selected",+tr.getAttribute("data-idx")===idx);});
  setHot(idx);
  var tr=document.getElementById("hwa-r"+idx);
  if(tr&&!tr.classList.contains("hidden")){
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tr.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});
  }
}
body.addEventListener("mouseover",function(e){var tr=e.target.closest("tr.row");if(tr)setHot(+tr.getAttribute("data-idx"));});
body.addEventListener("mouseout",function(e){var tr=e.target.closest("tr.row");if(tr)setHot(selected);});
body.addEventListener("click",function(e){
  var tr=e.target.closest("tr.row");if(!tr)return;
  var idx=+tr.getAttribute("data-idx");selected=idx;
  Array.prototype.forEach.call(body.querySelectorAll("tr.row"),function(x){x.classList.toggle("selected",x===tr);});
  setHot(idx);
});

/* ---------- filters ---------- */
var q=document.getElementById("hwa-q");
var chips=Array.prototype.slice.call(app.querySelectorAll(".chip"));
var count=document.getElementById("hwa-count");
var empty=document.getElementById("hwa-empty");
function apply(){
  var term=q.value.trim().toLowerCase();
  var active=new Set(chips.filter(function(c){return c.getAttribute("aria-pressed")==="true";}).map(function(c){return c.getAttribute("data-cls");}));
  var ok=new Set();
  ROWS.forEach(function(r){
    var s=(r.place+" "+r.markets+" "+r.source+" "+r.region).toLowerCase();
    if((!active.size||active.has(r.cls))&&(!term||s.indexOf(term)>-1))ok.add(r.idx);
  });
  Array.prototype.forEach.call(body.querySelectorAll("tr.group"),function(g){
    var n=0,tr=g.nextElementSibling;
    while(tr&&!tr.classList.contains("group")){var show=ok.has(+tr.getAttribute("data-idx"));tr.classList.toggle("hidden",!show);if(show)n++;tr=tr.nextElementSibling;}
    g.classList.toggle("hidden",n===0);
  });
  if(markers)markers.classed("dim",function(d){return !ok.has(d.idx);});
  count.textContent=ok.size+" of "+total+" markets";
  empty.hidden=ok.size>0;
}
q.addEventListener("input",apply);
chips.forEach(function(c){c.addEventListener("click",function(){c.setAttribute("aria-pressed",c.getAttribute("aria-pressed")==="true"?"false":"true");apply();});});
apply();
})();
