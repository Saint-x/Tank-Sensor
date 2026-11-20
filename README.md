# Tank-Sensor - Tank Level Visualization for Home Assistant

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-blue?logo=homeassistant)
![JavaScript](https://img.shields.io/badge/JavaScript-Custom%20Card-yellow?logo=javascript)
![GitHub Stars](https://img.shields.io/github/stars/Saint-x/Tank-Sensor?style=flat)
![GitHub Forks](https://img.shields.io/github/forks/Saint-x/Tank-Sensor?style=flat)
![Last Commit](https://img.shields.io/github/last-commit/Saint-x/Tank-Sensor)
![Repo Size](https://img.shields.io/github/repo-size/Saint-x/Tank-Sensor)
![Downloads](https://img.shields.io/github/downloads/Saint-x/Tank-Sensor/total)
![License](https://img.shields.io/github/license/Saint-x/Tank-Sensor)

Visualization for a water tank for Home Assistant

**Current version: 0.1.3**

<img width="451" height="640" alt="image" src="https://github.com/user-attachments/assets/a34061c5-b605-44a1-9ce6-83978454c5d4" />

# 📦 Installation

## Easy installation → [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Saint-x&repository=Tank-Sensor&category=plugin)


## HA Marketplace (HACS)

1. Open **Setting -> Marketplace**
3. Search for **Tank Sensor**
4. Install the card
5. Reload Home Assistant or the browser

## Manual

1. Download `tank-card.js`
2. Copy it to `/config/www/community/tank-sensor/`
3. Add the following resource under **Settings → Dashboards → Resources**:

   `/local/community/tank-sensor/HA-Tank-Sensor.js`

   Type: **JavaScript module**

Then reload the browser, e.g. with **Ctrl + F5**.

---


# ⚙️ Example configuration

Configuration over YAML or UI

```yaml
type: custom:saints-tank-card
title: Tank
tank_capacity: 1570
level_sensor: sensor.tank_liquid_level_percent
content_type: water
unit: L
bg_color: rgba(255, 255, 255, 1)
show_unittank: true
tank_name: Tank
water_level_sensor: sensor.zisterne_wassersensor_liquid_depth
last_data_time: sensor.tank_last_seen
```

# 📋 Configuration options

| Option               | Default                      | Type    | Description |
|----------------------|------------------------------|---------|-------------|
| `type`               | `custom:saints-tank-card`            | string  | Card type |
| `title`              | `Tank Card`                   | string  | Card title |
| `tank_name`              | `Tank`                   | string  | Tank Name |
| `tank_capacity`      | `1500`                       | number  | max. Capacity per tank|
| `level_sensor`       | `""`                         | string  | Fill-level sensor in % |
| `water_level_sensor`       | `""`                         | string  | Water level sensor for Visualization |
| `unit`               | `L`                       | string  | `L`, `kg`, `m³` |
| `show_unittank`      | `true`                       | boolean | Show the amount of tank fill inside the Tank |
| `bg_color`       | `rgba(255, 255, 255, 1)`             | list    | RGBa Color for Tank Background |
| `last_data_time`       | `""`                         | string  | Show under the Tank the Date & Time from the last data from the Sensor |
