class TankCard extends HTMLElement {
  constructor() {
    super();
    console.info(
      "%c Saint`s Tank-Card %c v.0.1.2",
      "background:#fff;color:#000;font-weight:bold;padding:6px 12px;border-radius:4px;",
      "color:inherit;font-weight:bold;padding:6px 12px;"
    );
    this._config = {};
    this._hass = null;
    this.attachShadow({ mode: "open" });
  }

  static getConfigElement() {
    return document.createElement("saints-tank-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:saints-tank-card",
      title: "Saint`s Tank Card",
      tank_capacity: 1000,
      level_sensor: "",
      content_type: "water",
      unit: "L",
      tank_form: "rect",
      bg_color: "rgba(255, 255, 255, 0.6)",
      show_unittank: true,
      tank_name: "Tank"
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Configuration required");
    this._config = config;
    this.tankName = config.tank_name || "Tank";
    this.tankCapacity = config.tank_capacity || 1500;
    this.levelSensor = config.level_sensor || "";
    this.waterLevelSensor = config.water_level_sensor || "";
    this.lastDataTimeSensor = config.last_data_time || "";
    this.title = config.title || "Saint`s Tank Card";
    this.showLiters = config.show_unittank !== undefined ? config.show_unittank : true;
    this.bgColor = config.bg_color || "rgba(0,0,0,0)";
    this.tankBgColor = config.tank_bg_color || "rgb(73, 73, 73)";
    this.fontFamily = config.font_family || "sans-serif";
    this.fontColor = config.font_color || "rgba(0,0,0,1)";
    this.fontSizeHeader = config.font_size || "1.7em";
    this.fontSize = config.font_size || "1.2em";
    this.fontSizeFooter = config.font_size || "1em";
    this.tankForm = config.tank_form || "rect";

    switch (config.content_type) {
      case "water": this.fillColor = "linear-gradient(to top, rgba(0,120,255,0.8), rgba(0,180,255,0.8))"; break;
      case "orange": this.fillColor = "linear-gradient(to top, orange, darkorange)"; break;
      case "red": this.fillColor = "linear-gradient(to top, red, darkred)"; break;
      case "brown": this.fillColor = "linear-gradient(to top, sienna, saddlebrown)"; break;
      case "blue": this.fillColor = "linear-gradient(to top, dodgerblue, deepskyblue)"; break;
      case "yellow": this.fillColor = "linear-gradient(to top, yellow, gold)"; break;
      default: this.fillColor = "linear-gradient(to top, #ffcc00, #ffaa00)";
    }
    
    this.unit = config.unit || "L";
    
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  get hass() { return this._hass; }

  _getValues() {
    const totalCapacity = this.tankCapacity;
    let currentFill = 0;
    
    if (!this._hass) return { totalCapacity, currentFill };
  
      const p = parseFloat(this._hass.states[this.levelSensor]?.state);
      const percent = isNaN(p) ? 0 : Math.min(Math.max(p, 0), 100);
    
      currentFill = (totalCapacity * percent) / 100;
      
    return { totalCapacity, currentFill };
  }
  
  _getAdditionalValues() {
    let waterLevel = "-";
    let lastDataTime = "-";

    if (!this._hass) return { waterLevel, lastDataTime };

    if (this.waterLevelSensor) {
      waterLevel = this._hass.states[this.waterLevelSensor]?.state ?? "-";
    }

    if (this.lastDataTimeSensor) {
      const rawDate = this._hass.states[this.lastDataTimeSensor]?.state ?? "-";

      if (rawDate !== "-") {
        const date = new Date(rawDate);

        if (!isNaN(date)) {
          lastDataTime = date.toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        } else {
          lastDataTime = rawDate;
        }
      }
    }

    return { waterLevel, lastDataTime };
  }


    _getTankBorderRadius(form) {
      switch (form) {
        case "pool": return "200px / 15px";
        case "capsule": return "200px / 200px";
        default: return "4px";
      }
    }

  render() {
    if (!this._hass) return;

    const { totalCapacity, currentFill } = this._getValues();
    const { waterLevel, lastDataTime } = this._getAdditionalValues();
    const tankRadius = this._getTankBorderRadius(this.tankForm);
    const systemFillPercent = (currentFill / totalCapacity) * 100;
  
    const style = document.createElement("style");
    style.textContent = `
      .container { display:flex; flex-direction:column; background:${this.bgColor}; padding:10px; border-radius:12px; font-family:${this.fontFamily}; height:100%; box-sizing:border-box; }
      .title { text-align:center; font-size:${this.fontSizeHeader}; font-weight:bold; color:${this.fontColor}; }
      .info-bar { display:flex; justify-content:space-between; font-size:${this.fontSize}; font-weight:bold; color:${this.fontColor}; }
      .info-left { display:grid; grid-template-columns:auto auto; column-gap:10px; row-gap:6px; }
      .info-right { display:grid; grid-template-columns:auto auto; column-gap:10px; row-gap:6px;  }
      .tanks { display:flex; justify-content:center; align-items:flex-end; flex:1; }
      .tank { width:200px; max-width:100%; height:500px; max-height:100%; display:flex; flex-direction:column; align-items:center; background:${this.tankBgColor}; border-radius:${tankRadius}; padding:10px; box-shadow:inset 0 3px 6px rgba(255,255,255,0.08), inset 0 -6px 10px rgba(0,0,0,0.7); }
      .tank-name { font-size:${this.fontSize}; margin-bottom:8px; color:${this.fontColor}; }
      .tank-level { width:100%; flex:1; border-radius:${tankRadius}; overflow:hidden; position:relative; display:flex; align-items:flex-end; justify-content:center;
        background: radial-gradient(circle at center, #ddd 0%, #bdbdbd 80%, #888 100%);
        border:5px solid transparent;
        box-shadow: inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -6px 10px rgba(0,0,0,0.9), 0 6px 10px rgba(0,0,0,0.6);
      }
      .tank-fill { width:100%; background:${this.fillColor}; display:flex; align-items:flex-end; justify-content:center; font-size:0.9em; font-weight:bold; color:#FFF; text-shadow:0 0 4px rgba(0,0,0,1.0); padding-bottom:0.2em; transition:height 0.4s ease; box-shadow: inset 0 4px 6px rgba(255,255,255,0.2), inset 0 -6px 8px rgba(0,0,0,0.6); }
      .data-time { color:${this.fontColor}; text-align:left; font-size:${this.fontSizeFooter}; margin-top:10px; }
    `;

    const container = document.createElement("div");
    container.className = "container";

    container.innerHTML = `
      <div class="title">${this.title}</div>
      <div class="info-bar">
        <div class="info-left">
          <div>Füllung:</div><div id="fill-info">${systemFillPercent.toFixed(1)}%</div>
          <div>Wasser:</div><div id="water-info">${waterLevel}m</div>
        </div>
        <div class="info-right">
          <div>Max:</div><div>${totalCapacity.toFixed(0)} ${this.unit}</div>
          <div>Aktuell:</div><div>${currentFill.toFixed(0)} ${this.unit}</div>
        </div>
      </div>
    `;

    const fillInfo = container.querySelector("#fill-info");
    if (fillInfo && this.levelSensor) {
      fillInfo.style.cursor = "pointer";
      fillInfo.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: {
            entityId: this.levelSensor,
          },
        }));
      });
    }

    const waterInfo = container.querySelector("#water-info");
    if (waterInfo && this.waterLevelSensor) {
      waterInfo.style.cursor = "pointer";
      waterInfo.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: {
            entityId: this.waterLevelSensor,
          },
        }));
      });
    }

    const tankDiv = document.createElement("div");
    tankDiv.className = "tank";

    const nameDiv = document.createElement("div");
    nameDiv.className = "tank-name";
    nameDiv.textContent = this.tankName;

    const levelWrapper = document.createElement("div");
    levelWrapper.className = "tank-level";

    const levelFill = document.createElement("div");
    levelFill.className = "tank-fill";
    levelFill.style.height = `${systemFillPercent}%`;

    if (this.showLiters) {
        levelFill.textContent = `${currentFill.toFixed(0)} ${this.unit}`;
    }

    levelWrapper.appendChild(levelFill);
    tankDiv.appendChild(nameDiv);
    tankDiv.appendChild(levelWrapper);

    const tanksDiv = document.createElement("div");
    tanksDiv.className = "tanks";
    tanksDiv.appendChild(tankDiv);

    container.appendChild(tanksDiv);
    
    const dataTimeDiv = document.createElement("div");
    dataTimeDiv.className = "data-time";
    dataTimeDiv.textContent = `Letzte Daten: ${lastDataTime}`;

    container.appendChild(dataTimeDiv);

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }

  getCardSize() { return 6; }
}

customElements.define("saints-tank-card", TankCard);

class TankCardEditor extends HTMLElement {
  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    this.innerHTML = `<div style="padding:16px"><ha-form></ha-form></div>`;
    this._form = this.querySelector("ha-form");

    this._form.addEventListener("value-changed", (e) => {
      this._config = e.detail.value;
      this.dispatchEvent(new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true
      }));
      this._updateSchema();
    });
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    this._updateSchema();
  }

  setConfig(config) {
    this._config = config;
    this._updateSchema();
  }

  _updateSchema() {
    if (!this._form || !this._config || !this._hass) return;

    const lang = this._hass.language; // z.B. "de" oder "en"
    const t = (en, de) => (lang === "de" ? de : en);

    const schema = [
      { name: "title", selector: { text: {} }, label: t("Titel","Titel") },
      { name: "tank_name", selector: { text: {} }, label: t("Tank name","Tankname") },
      { name: "tank_capacity", selector: { number: {} }, label: t("Capacity","Kapazität") },
      { name: "level_sensor", selector: { entity: { domain: "sensor" } }, label: t("Sensor Level","Sensor Level") },
      { name: "water_level_sensor", selector: { entity: { domain: "sensor" } }, label: t("Sensor Water Level","Sensor Wasser Höhe") },
      { name: "last_data_time", selector: { entity: { domain: "sensor" } }, label: t("Data Time","Daten Zeit") },

      {
        name: "content_type",
        selector: {
          select: {
            options: [
              { value: "water", label: t("Water","Wasser") },
              { value: "orange", label: t("Orange","Orange") },
              { value: "red", label: t("Red","Rot") },
              { value: "brown", label: t("Brown","Braun") },
              { value: "blue", label: t("Blue","Blau") },
              { value: "yellow", label: t("Yellow","Gelb") }
            ]
          }
        },
        label: t("content","Inhalt")
      },

    { 
      name: "unit",
      selector: {
        select: {
          options: [
            { value: "L", label: t("Liters", "Liter") },
            { value: "kg", label: t("Kilograms", "Kilogramm") },
            { value: "m3", label: t("Cubic meters", "Kubikmeter") }
          ]
        }
      },
      label: t("Unit", "Einheit")
    },      
      { name: "show_unittank", selector: { boolean: {} }, label: t("Show Unit/Tank","Einheit pro Tank anzeigen") }
    ];

    this._form.schema = schema;
    this._form.data = this._config;
    this._form.hass = this._hass;
  }
}
customElements.define("saints-tank-card-editor", TankCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "saints-tank-card",
  name: "Saint`s Tank Card",
  preview: true,
  description: "Displays the fill level of your tank using level sensors."
});
