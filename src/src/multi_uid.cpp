#include "common.h"
#include "config.h"
#include "OTA.h"
#include "FHSS.h"
#include "hwTimer.h"

static void setupBindingFromConfig()
{
  if (firmwareOptions.hasUID)
  {
      memcpy(UID, firmwareOptions.uid, UID_LEN);
  }
  else
  {
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

  DBGLN("UID=(%d, %d, %d, %d, %d, %d)",
    UID[0], UID[1], UID[2], UID[3], UID[4], UID[5]);

  OtaUpdateCrcInitFromUid();
}

int dualUIDAuxState = 0;
int isProxy = 0;

void DualUIDUpdte() {
    uint8_t currentDualUIDAuxState = CRSF_to_BIT(ChannelData[14]);

    // If channel 14 has changed its value
    if (dualUIDAuxState != currentDualUIDAuxState) {
        dualUIDAuxState = currentDualUIDAuxState;
        if (dualUIDAuxState) {
            // use UID (as in the checksum of the binding phrase) of the proxy
            // TODO: read the UID from some kind of configuration...
            UID[0] = 25;
            UID[1] = 248;
            UID[2] = 46;
            UID[3] = 154;
            UID[4] = 152;
            UID[5] = 214;
            OtaUpdateCrcInitFromUid();
            FHSSrandomiseFHSSsequence(uidMacSeedGet());
        } else {
            // we're back to the original receiver - use the one stored in config
            setupBindingFromConfig();
            FHSSrandomiseFHSSsequence(uidMacSeedGet());
        }
    }

    // If this is the proxy transmitter and we are not transmitting over the proxy
    // then disable sending anything over the link.
    if (isProxy) {
        // TODO: THIS MIGHT DISABLE MSP PACKET RETRIEVAL - NEED TO CHECK!!!
        if (!dualUIDAuxState && hwTimer::running) {
            hwTimer::stop();
        } else if (dualUIDAuxState && !hwTimer::running) {
            hwTimer::resume();
        }
    }
}
