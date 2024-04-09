#if defined(TARGET_TX)

#include <ArduinoJson.h>
#include <StreamString.h>
#include <SPIFFS.h>
#include "common.h"
#include "config.h"
#include "OTA.h"
#include "FHSS.h"
#include "hwTimer.h"
#include "multi_uid.h"

proxy_options_t proxy_options;

void loadMultiUIDDefaults() {
    proxy_options.has_proxy_uid = false;
    proxy_options.aux_uid_switch = 0;
    proxy_options.has_tx_enable = false;
    proxy_options.aux_tx_enable = 0;
    memset(proxy_options.proxy_uid, 0, UID_LEN);
}

void loadMultiUIDOptionsFromJSON(DynamicJsonDocument json) {
    proxy_options.aux_uid_switch = json["aux-uid-switch"];
    DBGLN("multi-uid: json.aux-uid-switch == %d", json["aux-uid-switch"]);
    DBGLN("multi-uid: aux_uid_switch == %d", proxy_options.aux_uid_switch);

    copyArray(json["proxy-uid"], proxy_options.proxy_uid, UID_LEN);
    DBGLN("multi-uid: json.proxy-uid.size() == %d", json["proxy-uid"].size());
    DBGLN("multi-uid: proxy_options.proxy_uid == %d,%d,%d,%d,%d,%d",
        proxy_options.proxy_uid[0],
        proxy_options.proxy_uid[1],
        proxy_options.proxy_uid[2],
        proxy_options.proxy_uid[3],
        proxy_options.proxy_uid[4],
        proxy_options.proxy_uid[5]);

    proxy_options.has_proxy_uid = json["proxy-uid"].size() == 6 && proxy_options.aux_uid_switch > 0;
    DBGLN("multi-uid: has_proxy_uid == %d", proxy_options.has_proxy_uid);

    proxy_options.aux_tx_enable = json["aux-tx-enable"];
    DBGLN("multi-uid: json.aux-tx-enable == %d", json["aux-tx-enable"]);
    DBGLN("multi-uid: aux_tx_enable == %d", proxy_options.aux_tx_enable);

    proxy_options.has_tx_enable = proxy_options.aux_tx_enable > 0;
    DBGLN("multi-uid: has_tx_enable == %d", proxy_options.has_tx_enable);
}

void loadMultiUIDOptions() {
    DBGLN("multi-uid: Loading Multi-UID options");
    DynamicJsonDocument json(1024);

    File file = SPIFFS.open("/proxy.json", "r");
    if (file && !file.isDirectory()) {
        DeserializationError error = deserializeJson(json, file);
        if (error) {
            DBGLN("multi-uid: Error loading proxy.json: %d", error.code());
            return;
        }
        loadMultiUIDOptionsFromJSON(json);

        DBGLN("multi-uid: proxy.json loaded");
    } else {
        loadMultiUIDDefaults();

        DBGLN("multi-uid: proxy.json not found - loaded defaults");
    }
    file.close();
}

// DynamicJsonDocument proxyOptionsToJSON() {
//     DynamicJsonDocument json(1024);

//     copyArray(proxy_options.proxy_uid, UID_LEN, json.createNestedArray("proxy-uid"));
//     json["is-proxy"] = proxy_options.is_proxy;
//     json["aux"] = proxy_options.aux;
// }

// void saveMultiUIDOptionsJSON(
//     DynamicJsonDocument json
// ) {
//     File file = SPIFFS.open("/proxy.json", "w");
//     serializeJson(json, file);
//     file.close();

//     DBGLN("multi-uid: proxy.json saved");
// }

// void saveMultiUIDOptions() {
//     saveMultiUIDOptionsJSON(proxyOptionsToJSON());
// }

static void setupBindingFromConfig()
{
  if (firmwareOptions.hasUID) {
      memcpy(UID, firmwareOptions.uid, UID_LEN);
  } else {
#ifdef PLATFORM_ESP32
    esp_read_mac(UID, ESP_MAC_WIFI_STA);
#elif PLATFORM_STM32
    UID[0] = (uint8_t)HAL_GetUIDw0();
    UID[1] = (uint8_t)(HAL_GetUIDw0() >> 8);
    UID[2] = (uint8_t)HAL_GetUIDw1();
    UID[3] = (uint8_t)(HAL_GetUIDw1() >> 8);
    UID[4] = (uint8_t)HAL_GetUIDw2();
    UID[5] = (uint8_t)(HAL_GetUIDw2() >> 8);
#endif
  }

  DBGLN("multi-uid: Current UID == %d,%d,%d,%d,%d,%d", UID[0], UID[1], UID[2], UID[3], UID[4], UID[5]);

  OtaUpdateCrcInitFromUid();
}

void setProxyUID() {
    // use UID (as in the checksum of the binding phrase) of the proxy
    // UID[0] = 25;
    // UID[1] = 248;
    // UID[2] = 46;
    // UID[3] = 154;
    // UID[4] = 152;
    // UID[5] = 214;
    memcpy(UID, proxy_options.proxy_uid, UID_LEN);
    OtaUpdateCrcInitFromUid();
    FHSSrandomiseFHSSsequence(uidMacSeedGet());
}

void setFirmawareUID() {
    // we're back to the original receiver - use the one stored in config
    setupBindingFromConfig();
    FHSSrandomiseFHSSsequence(uidMacSeedGet());
}

int dualUIDAuxState = 0;
int txEnableAuxState = 0;

void DualUIDUpdate() {
    if (proxy_options.has_tx_enable) {
        uint8_t currentTxEnableAuxState = CRSF_to_BIT(ChannelData[proxy_options.aux_tx_enable]);

        if (txEnableAuxState != currentTxEnableAuxState) {
            txEnableAuxState = currentTxEnableAuxState;

            DBGLN("multi-uid: currentTxEnableAuxState == %d", currentTxEnableAuxState);

            // If this is the proxy transmitter and we are not transmitting over the proxy
            // then disable sending anything over the link.
            if (!txEnableAuxState && hwTimer::running) {
                // TODO: THIS MIGHT DISABLE MSP PACKET RETRIEVAL - NEED TO CHECK!!!
                hwTimer::stop();
            } else if (dualUIDAuxState && !hwTimer::running) {
                hwTimer::resume();
            }
        }
    }

    if (proxy_options.has_proxy_uid) {
        uint8_t currentDualUIDAuxState = CRSF_to_BIT(ChannelData[proxy_options.aux_uid_switch]);

        if (dualUIDAuxState != currentDualUIDAuxState) {
            dualUIDAuxState = currentDualUIDAuxState;

            DBGLN("multi-uid: currentDualUIDAuxState == %d", currentDualUIDAuxState);

            if (proxy_options.has_proxy_uid) {
                // This is the actual transmitter and we need to set the current UID
                if (dualUIDAuxState) {
                    DBGLN("multi-uid: setting proxy UID");
                    setProxyUID();
                } else {
                    DBGLN("multi-uid: setting primary UID");
                    setFirmawareUID();
                }
            }
        }
    }
}

// static void GetMultiUIDConfiguration(
//     AsyncWebServerRequest *request
// ) {
//     DynamicJsonDocument json = proxyOptionsToJSON();

//     AsyncResponseStream *response = request->beginResponseStream("application/json");
//     serializeJson(json, *response);
//     request->send(response);
// }

// static void UpdateMultiUIDConfiguration(
//     AsyncWebServerRequest *request,
//     JsonVariant &json
// ) {
//     saveMultiUIDOptionsJSON(json);
//     loadMultiUIDOptionsFromJSON(json);
// }

#endif
