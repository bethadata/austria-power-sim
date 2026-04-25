<template>
  <v-container>
    <v-card class="ps-6  mb-4" elevation="2">
      <v-card-title class="text-h5 font-weight-bold">
        General model 
      </v-card-title>

      <v-divider/>

      <v-card-text>
        <!-- General Model -->
        <p>
          The model is based on a simplified hourly simulation of electricity supply and demand. 
          Hourly generation time series from renewable energy sources (e.g., solar and wind) are 
          combined with an hourly load profile.
        </p>

        For each hour of the year, generation from the following sources is aggregated:
        <ul class="compact-list">
          <li v-for="item in sources" :key="item">
            {{ item }}
          </li>
        </ul>

        <p>
          All generation profiles are based on historical time series data (see Data Sources section below).
          All time series are normalized to the installed capacity defined in the selected scenario. When the user adjusts installed capacity (e.g., solar PV), the corresponding generation profiles are scaled proportionally.
          In addition to generation capacities, users can parameterize energy storage systems (battery and hydrogen storage) and the total load, which is again 
          scaled with the historic load curve. 
        </p>

        <v-alert type="info" variant="tonal" class="mb-6">
          Note: Biomass power is currently modeled similarly to variable renewable sources with a fixed historic profiles, which is mostly flat over the year. 
          In practice, biomass generation could also be dispatched more flexibly, but this capability is not yet represented in the model.
        </v-alert>
    </v-card-text> 
      </v-card>

        <!-- Energy Storage -->
      <v-card class="ps-6  mb-4" elevation="2">
        <v-card-title class="text-h5 font-weight-bold">
          Energy storage
        </v-card-title>

      <v-divider/>
      <v-card-text>
          The model includes three types of storage: Pumped hydro storage (not explicitly modeled), battery storage, hydrogen storage.

          Pumped hydro storage is not explicitly modeled because, in Austria, most pumped storage plants also
           have natural inflows and therefore operate as hybrid reservoir systems. 
           As a result, their generation is included in historical hydro data rather than modeled separately.
           <br><br>

           <b>Battery storage</b> operation follows a simple rule-based approach:

          <ul class="compact list">
          <li>Surplus renewable energy (generation exceeds load) is stored in batteries, limited by storage capacity and charging power.</li>
          <li>When there is a supply deficit, stored energy is discharged to meet demand (if available).</li>
          </ul>
          <b>Hydrogen storage</b> is modeled as a secondary storage layer:

          <ul class="compact list">
          <li>Excess renewable energy (after batteries are full) is used in electrolyzers to produce hydrogen.</li>
          <li>Hydrogen is stored up to the maximum storage capacity.</li>
          <li>In case of a supply deficit (and empty batteries), hydrogen is converted back to electricity using gas power plants.</li>    
          </ul>

        <v-alert type="warning" variant="tonal" class="mb-4">
          This simplified storage dispatch does not reflect real market behavior. 
          In reality, storage operation is driven by electricity prices and market optimization.
        </v-alert>
</v-card-text>
        </v-card>

      <v-card class="ps-6  mb-4" elevation="2">
        <v-card-title class="text-h5 font-weight-bold">
          Scenarios and Data Sources
        </v-card-title>

      <v-divider/>
      <v-card-text>
          Users can select between:
          <ul class="compact list">
          <li>Historical installed capacities</li>
          <li>Future scenarios based on the TYNDP 2024 National Trends</li>
          </ul>
          These scenarios reflect national policy projections and are used in the <a href = "https://2024.entsos-tyndp-scenarios.eu/download/">Ten-Year Network Development Plan (TYNDP)</a> of European Transmission System Operators.

          Time series data are based on historical production data from <a href = "https://transparency.entsoe.eu/">ENTSO-E</a>.

        <v-alert type="info" variant="tonal" class="mb-6">
          <b>Solar generation is not fully represented in ENTSO-E data</b> because a significant share of solar energy is consumed behind the meter.
          This leads to underestimated solar generation and a reduced apparent load during high solar production periods. <br>
          As a result, calculated full-load hours are significantly below the typical Austrian value (~1000 hours/year).
        </v-alert>
        </v-card-text>
        </v-card>

              <v-card class="ps-6  mb-2" elevation="2">
        <v-card-title class="text-h5 font-weight-bold">
          Limitations
        </v-card-title>

      <v-divider/>
        <v-card-text>
      <p>This model is highly simplified. For more detailed analysis, users are referred to, for example, TYNDP studies, which model the European power system in much greater detail.
          <br><br>
          Key simplifications include, among others:</p>
        <ul class="compact-list">
          <li v-for="item in limitations" :key="item">
            {{ item }}
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const sources = [
  "Solar / PV",
  "Onshore wind",
  "Run-of-river hydro",
  "Reservoir hydro",
  "Waste / Biomass"
];

const limitations = [
  "No cross-border exchange: Austria is modeled as an isolated system without imports/exports.",
  "Copper plate assumption: No spatial resolution within Austria; grid constraints are not represented.",
  "Sector coupling not included: Interactions with heat, transport, and industry sectors are excluded.",
  "Hydrogen demand not modeled: Industrial and transport hydrogen demand is not considered.",
  "No demand-side flexibility: Options like demand response or vehicle-to-grid are not included.",
  "No self-consumption modeling: Behind-the-meter generation (e.g., rooftop PV, industrial generation) is not captured - see also point on solar timeseries above.",
];
</script>

<style>

.compact-list {
  padding-left: 20px;
  margin: 2px 0;
}

.compact-list li {
  margin: 2px 0;
  line-height: 1.3;
}

</style>


<!-- <template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Models and Data sources</v-card-title>
      <v-card-text>
        Section: general model 

        The model is based on a simple hourly load and generation simulation, where hourly timeseries of power generation sources (e.g., solar) are correlated 
        with an hourly load profile. For each hour of the year, the generation profiles of the following sources are added up: solar, wind onshore, hydro rier,
        hydro reservoir, biomass - for each of these, the historic generation profile based on the timeseries scenario are used (see Sources section).

        Note: Biomass is so far modeled as the other renewable sources. In general, electricity from biomass has the potential to be also 
        used dynamically to provide system flexibility, which is nowaday however rather seldom used. 

        All timeseries are normalized to the installed capacity of the set scenario (see section on Scenarios). When the user changes the installed 
        power, for example of solar power, the profiles are scaled accordingly. 

        Besides the installed powers, also energy storage scenarios (batteries and hydrogen) can be parametized. 

       Section: energy storage 
       In the model, there are three types of enegy storage: pumped hydro reservoir, batteries, and hydrogen storage. The pumped hydro storage 
       is however not modelled (yet). The reason lies in the fact that in Austria, most pumped hydro reservoir also have a natural inflow, meaning they are also 
       classic reservoir storage generators. Therefore it is hard to separate previously pumped production from natural inflow-based prodution and the 
       pumped hydro generation is also taken from historical data. 

       Battery storage units follow a simple model: If there is excess renewable energy (the sum of all renewables exceeds the load), energy 
       is stored in the batteries, up to the maximum capacity and up to the maximum power. If there is an energy gap and the batteries 
       are not empty, the stored energy is used to supply the load. 
       Note: This battery dispatch represents no real market operation, but follows only this simple rule. In reality, battery and storage operation
       will follow according to the energy market prices and dispatch should occur mostly in hours where electricity prices are high. 

       Hydrogen storage follows a similar rule: If there is excess energy and also the batteries are already full, the renewable energy is 
       used within the electrolyzers to produce and store hydrogen, up to the maximum electrolyzer power and the maximum hydrogen storage content. 
       If there is then a load gap, and also batteries are empty, the stored hydrogen is used in the gas power plant to generate electricity. 

      Section: scnenarios and data sources 
      Currently, the user can choose between historic installed powers and power-scenarios from the TYNDP 2024 National Trends scenarios. 
      Those scenarios represent future projections based on national policies, which are the basis of the Ten Year Network Development reports 
      of the European Transmission System Operators, which are updated every 2 years. 
      Regarding timeseries, the user can choose from historic timeseries based on ENTSO-E data actual production data. 
      
        Important note: Solar power timeseries are not very well represented by the ENTSO-E timeseries data. The reason is that most produced solar energy 
        is consumed "behind the meter" and therefore takes not part in the public power system. Correspondingly, also the load profile is reduced at times 
        of high solar own consumption. As effect, the here seen full load hours - meaning total produced energy divided by installed power - are well below the
         normally in Austria expected value of 1000. 

      Section Limitations: 
      The present model is highly simplified, and the interested user is referenced for example to the TYNDP report pages, which model the whole 
      Europen powe rsystem in much more detail. 
      The following describe some of the simplifications of the model: 
      - Only Austria is modelled. In reality, Austria is part of a trans-national power grid, where energy imports and exports occur regularly, 
      heavily influencing the power production and especially storage dynamics. 
      - Austria is modelled as one aggregated ("copper plate") model. In reality, power production and consumption are geographically separated and the national 
      transmission and distribution grids transport power from power plants to consumers. 
      - The powre market is in strong exchange with other energy sectors, such as the heat sector (district heating), but in future also the 
      transport sector (electric vehicles), and the industry sectors (e.g., hydrogen production for industry demands). All these sectors would have to be 
      modelled in addition to give the complete picture. 
      - Hydrogen demand also occurs to a large part in industry and transport sectors, also heavily influencing potential electrolysis operation and hydrogen storage 
      dynamics. 
      - Modern fexibility options such as demand-side management or vehicle-to-grid are not modelled, but could reduce the amount of storage needed. 
        - Self-consumption of production at local consumer sites is not represented in public data - see the above point on solar timeseries - but this is 
        also relevant for own-consumption of industry power plants, for example with coking gases. 

      </v-card-text>
    </v-card>
  </v-container>
</template> -->