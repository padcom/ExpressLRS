#pragma once

#if defined(TARGET_TX)

// #include <ESPAsyncWebServer.h>

typedef struct _multiuid_options {
    bool        has_proxy_uid;
    uint8_t     aux_uid_switch;
    bool        has_tx_enable;
    uint8_t     aux_tx_enable;
    uint8_t     proxy_uid[UID_LEN];
} proxy_options_t;

extern proxy_options_t proxy_options;

void loadMultiUIDOptions();
// void saveMultiUIDOptions();

void DualUIDUpdate();

// void GetMultiUIDConfiguration(
//   AsyncWebServerRequest *request
// );
// void UpdateMultiUIDConfiguration(
//     AsyncWebServerRequest *request,
//     JsonVariant &json
// );

#endif // TARGET_TX
